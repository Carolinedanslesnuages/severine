// Journey and RGAA checks in Chromium. Run by "npm run test:browser", site served on port 4173.
// Fails when a check fails. axe-core does not replace the manual RGAA method: see README.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const SITE_URL = process.env.URL || 'http://localhost:4173/';
const AXE_SOURCE = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const AXE_RULES = { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] };
const results = [];
const check = (criterion, passed, message) => {
  results.push(passed);
  console.log(`${passed ? '✅' : '❌'} ${criterion} · ${message}`);
};

const browser = await chromium.launch();

async function axeViolations(page) {
  await page.addScriptTag({ content: AXE_SOURCE });
  const report = await page.evaluate((rules) => window.axe.run(document, rules), AXE_RULES);
  return report.violations.map((violation) => `${violation.id} (${violation.nodes.length})`);
}

for (const colorScheme of ['light', 'dark']) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme });
  for (const [hash, title] of [['#/', 'Les femmes'], ['#/femme/louise-michel', 'Louise Michel'], ['#/frise', 'La frise'], ['#/a-propos', 'À propos']]) {
    await page.goto(SITE_URL + hash);
    await page.waitForSelector('h1');
    const violations = await axeViolations(page);
    check('axe', violations.length === 0, `${hash} (${colorScheme}) sans erreur axe${violations.length ? ' : ' + violations.join(', ') : ''}`);
    if (colorScheme === 'dark') continue;
    check('8.6', (await page.title()) === `${title} · Séverine`, `${hash} : titre de page « ${await page.title()} »`);
    check('9.1', (await page.locator('h1').count()) === 1, `${hash} : un seul titre de niveau 1`);
  }
  await page.close();
}

const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(SITE_URL);
await page.waitForSelector('h1');

// 12.7 skip link: first Tab, then Enter moves focus to the main content without changing the page.
await page.keyboard.press('Tab');
check('12.7', (await page.evaluate(() => document.activeElement.textContent)) === 'Aller au contenu', 'premier Tab : « Aller au contenu »');
await page.keyboard.press('Enter');
check('12.7', (await page.evaluate(() => document.activeElement.id)) === 'contenu', 'le lien mène au contenu');
check('12.7', (await page.locator('h1').textContent()) === 'Les femmes', 'la page reste la même');

// Search and filters, with a short status message.
const totalCount = await page.locator('.cards > li').count();
await page.fill('#search', 'commune montmartre');
const searchCount = await page.locator('.cards > li').count();
check('recherche', searchCount >= 1 && searchCount < totalCount, `« commune montmartre » : ${searchCount} fiche(s)`);
check('7.5', /^\d+ femmes?$/.test(await page.textContent('[role=status]')), `message de statut : « ${await page.textContent('[role=status]')} »`);
await page.fill('#search', '');
await page.getByText('Afrique', { exact: true }).click();
const africaCount = await page.locator('.cards > li').count();
check('filtre', africaCount > 0 && africaCount < totalCount, `région Afrique : ${africaCount} fiches`);
await page.getByText('Antiquité et Moyen Âge', { exact: true }).click();
const ancientCount = await page.locator('.cards > li').count();
check('filtre', ancientCount >= 1 && ancientCount < africaCount, `Afrique + Antiquité et Moyen Âge : ${ancientCount} fiche(s)`);
await page.getByText('Toutes', { exact: true }).first().click();
await page.getByText('Toutes', { exact: true }).nth(1).click();

// 12.x navigation: after a link, focus is on the new page title.
await page.click('a[href="#/femme/louise-michel"]');
await page.waitForSelector('h1:has-text("Louise Michel")');
check('12', (await page.evaluate(() => document.activeElement.tagName)) === 'H1', 'après un lien, le focus est sur le titre de la page');
check('navigation', (await page.locator('.pager a').count()) >= 1, 'liens vers la femme précédente ou suivante');
check('dates', (await page.locator('time[datetime]').count()) >= 5, 'dates des actions dans des balises <time>');

// Unknown woman: not found page.
await page.goto(SITE_URL + '#/femme/inconnue');
await page.waitForSelector('h1');
check('erreur', (await page.locator('h1').textContent()) === 'Page introuvable', 'fiche inconnue : page introuvable');

// 10.11 reflow at 320 px, no horizontal scroll.
const narrow = await browser.newPage({ viewport: { width: 320, height: 640 } });
for (const hash of ['#/', '#/frise', '#/femme/elisabeth-dmitrieff', '#/femme/funmilayo-ransome-kuti']) {
  await narrow.goto(SITE_URL + hash);
  await narrow.waitForSelector('h1');
  const overflow = await narrow.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check('10.11', overflow <= 0, `${hash} à 320 px : pas de défilement horizontal`);
}

// 10.4 text zoomed to 200 %.
await narrow.setViewportSize({ width: 640, height: 640 });
await narrow.goto(SITE_URL);
await narrow.addStyleTag({ content: 'html { font-size: 200% }' });
const zoomOverflow = await narrow.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
check('10.4', zoomOverflow <= 0, 'texte à 200 % : rien ne déborde');

await browser.close();
const failures = results.filter((passed) => !passed).length;
console.log(failures ? `\n${failures} vérification(s) en échec` : `\nToutes les vérifications passent (${results.length})`);
process.exit(failures ? 1 : 0);

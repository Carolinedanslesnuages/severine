// Every woman file must follow the schema described in the README.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { DATE_PATTERN, isChronological } from '../src/format.js';

const readJson = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const periodIds = readJson('../data/periods.json').map((period) => period.id);
const themeIds = readJson('../data/themes.json').map((theme) => theme.id);
const fileNames = readdirSync(new URL('../data/women/', import.meta.url)).filter((name) => name.endsWith('.json'));
const KNOWN_KEYS = ['name', 'birth', 'death', 'periods', 'summary', 'actions', 'sources'];

test('il y a des fiches', () => assert.ok(fileNames.length > 0));

for (const fileName of fileNames) {
  test(`fiche ${fileName}`, () => {
    assert.match(fileName, /^[a-z0-9]+(-[a-z0-9]+)*\.json$/, 'nom de fichier en minuscules, sans accent, mots séparés par des tirets');
    const woman = readJson(`../data/women/${fileName}`);
    for (const key of Object.keys(woman)) assert.ok(KNOWN_KEYS.includes(key), `clé inconnue : ${key}`);
    for (const key of ['name', 'birth', 'death', 'summary']) {
      assert.equal(typeof woman[key], 'string', `${key} doit être un texte`);
      assert.ok(woman[key].trim(), `${key} est vide`);
    }
    assert.ok(Array.isArray(woman.periods) && woman.periods.length, 'au moins une période');
    for (const period of woman.periods) assert.ok(periodIds.includes(period), `période inconnue : ${period}`);

    assert.ok(woman.actions.length, 'au moins une action');
    for (const action of woman.actions) {
      assert.match(action.date, DATE_PATTERN, `date « ${action.date} » : AAAA, AAAA-MM ou AAAA-MM-JJ`);
      assert.ok(themeIds.includes(action.theme), `thème inconnu : ${action.theme}`);
      assert.ok(action.text?.trim(), 'texte d\'action vide');
    }
    const dates = woman.actions.map((action) => action.date);
    assert.ok(isChronological(dates), `actions dans l'ordre chronologique : ${dates.join(', ')}`);

    assert.ok(woman.sources.length, 'au moins une source');
    for (const source of woman.sources) {
      assert.ok(source.title?.trim(), 'source sans titre');
      if (source.url) assert.match(source.url, /^https:\/\//, 'lien de source en https');
      assert.doesNotMatch(source.url ?? '', /wikipedia\.org/, 'Wikipédia n\'est pas une source');
      assert.ok(source.url || (source.author && source.publisher && source.year), 'une source sans lien cite auteur, éditeur et année');
    }
  });
}

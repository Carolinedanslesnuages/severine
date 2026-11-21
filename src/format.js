// Pure helpers, shared by the site and the tests.

const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août',
  'septembre', 'octobre', 'novembre', 'décembre'];

/** Accepted date formats: "1793", "1793-07" or "1793-07-13". */
export const DATE_PATTERN = /^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/;

/** "0060" → "60 apr. J.-C.", "1792" → "1792". */
export function formatYear(year) {
  const number = Number(year);
  return number < 1000 ? `${number} apr. J.-C.` : String(number);
}

/** "1793-07-13" → "13 juillet 1793", "1871-04" → "avril 1871", "1792" → "1792". */
export function formatDate(date) {
  const [rawYear, month, day] = date.split('-');
  const year = formatYear(rawYear);
  if (!month) return year;
  const monthName = MONTHS[Number(month) - 1];
  if (!day) return `${monthName} ${year}`;
  return `${Number(day) === 1 ? '1er' : Number(day)} ${monthName} ${year}`;
}

/** Lowercase, without accents: « Théroigne » matches « theroigne ». */
export function normalize(text) {
  return String(text).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

/** True when every word of the query appears in the woman's name, summary or actions. */
export function matchesQuery(woman, query) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const haystack = normalize([woman.name, woman.summary, ...woman.actions.map((action) => action.text)].join(' '));
  return words.every((word) => haystack.includes(word));
}

/** Sort key of a woman: the date of her first action. */
export function firstActionDate(woman) {
  return woman.actions.map((action) => action.date).sort()[0];
}

/** All actions of all women, oldest first, each with its woman. */
export function timelineOf(women) {
  return women
    .flatMap((woman) => woman.actions.map((action) => ({ ...action, woman })))
    .sort((first, second) => first.date.localeCompare(second.date) || first.woman.name.localeCompare(second.woman.name, 'fr'));
}


/**
 * Dates in order, comparing only what both dates say:
 * "1793-06" then "1793" is fine (both in 1793), "1793-11" then "1793-06" is not.
 */
export function isChronological(dates) {
  return dates.every((date, index) => {
    if (index === 0) return true;
    const previous = dates[index - 1];
    const length = Math.min(date.length, previous.length);
    return previous.slice(0, length) <= date.slice(0, length);
  });
}

/** "1748 – 1793", "née en 1979" (living woman: empty death), "naissance inconnue – 43". */
export function lifespan(woman) {
  if (!woman.death) return `née en ${woman.birth}`;
  const birth = woman.birth === 'inconnue' ? 'naissance inconnue' : woman.birth;
  return `${birth} – ${woman.death}`;
}

/** The era of a woman: the one containing the year of her first action. */
export function eraOf(woman, eras) {
  const year = Number(firstActionDate(woman).slice(0, 4));
  return eras.find((era) => year >= era.from && year <= era.to)?.id;
}

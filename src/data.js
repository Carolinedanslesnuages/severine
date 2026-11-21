import periods from '../data/periods.json';
import themes from '../data/themes.json';
import regions from '../data/regions.json';
import eras from '../data/eras.json';
import { eraOf, firstActionDate } from './format.js';

const womanFiles = import.meta.glob('../data/women/*.json', { eager: true, import: 'default' });

/** Regions of a woman, from her periods (movements). */
const regionsOf = (woman) => [...new Set(woman.periods.map((periodId) => periods.find((period) => period.id === periodId)?.region))];

/** Women, from the oldest first action to the most recent. Slug = file name. */
export const women = Object.entries(womanFiles)
  .map(([path, woman]) => ({ slug: path.split('/').pop().replace(/\.json$/, ''), ...woman }))
  .map((woman) => ({ ...woman, regions: regionsOf(woman), era: eraOf(woman, eras) }))
  .sort((first, second) => firstActionDate(first).localeCompare(firstActionDate(second)));

export { periods, themes, regions, eras };

const labelOf = (list) => (id) => list.find((item) => item.id === id)?.label ?? id;
export const periodLabel = labelOf(periods);
export const themeLabel = labelOf(themes);
export const regionLabel = labelOf(regions);

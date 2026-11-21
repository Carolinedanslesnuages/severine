import periods from '../data/periods.json';
import themes from '../data/themes.json';
import { firstActionDate } from './format.js';

const womanFiles = import.meta.glob('../data/women/*.json', { eager: true, import: 'default' });

/** Women, from the oldest first action to the most recent. Slug = file name. */
export const women = Object.entries(womanFiles)
  .map(([path, woman]) => ({ slug: path.split('/').pop().replace(/\.json$/, ''), ...woman }))
  .sort((first, second) => firstActionDate(first).localeCompare(firstActionDate(second)));

export { periods, themes };

export const periodLabel = (periodId) => periods.find((period) => period.id === periodId)?.label ?? periodId;
export const themeLabel = (themeId) => themes.find((theme) => theme.id === themeId)?.label ?? themeId;

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDate, normalize, matchesQuery, timelineOf, gallicaSearchUrl, isChronological } from '../src/format.js';

test('formatDate écrit les dates en français', () => {
  assert.equal(formatDate('1793-07-13'), '13 juillet 1793');
  assert.equal(formatDate('1871-03-01'), '1er mars 1871');
  assert.equal(formatDate('1871-04'), 'avril 1871');
  assert.equal(formatDate('1792'), '1792');
});

test('normalize retire accents et majuscules', () => {
  assert.equal(normalize('Théroigne ÉLISABETH'), 'theroigne elisabeth');
});

const louise = { name: 'Louise Michel', summary: 'Institutrice', actions: [{ date: '1871-03-18', text: 'Canons de Montmartre' }] };
const olympe = { name: 'Olympe de Gouges', summary: 'Femme de lettres', actions: [{ date: '1791-09', text: 'Déclaration' }] };

test('matchesQuery cherche tous les mots, sans accents', () => {
  assert.ok(matchesQuery(louise, ''));
  assert.ok(matchesQuery(louise, 'montmartre louise'));
  assert.ok(matchesQuery(olympe, 'declaration'));
  assert.ok(!matchesQuery(louise, 'louise declaration'));
});

test('timelineOf trie toutes les actions par date', () => {
  const timeline = timelineOf([louise, olympe]);
  assert.deepEqual(timeline.map((action) => action.woman.name), ['Olympe de Gouges', 'Louise Michel']);
});

test('gallicaSearchUrl encode le nom', () => {
  assert.match(gallicaSearchUrl('André Léo'), /^https:\/\/gallica\.bnf\.fr\/.*Andr%C3%A9%20L%C3%A9o/);
});

test('isChronological compare seulement la précision commune', () => {
  assert.ok(isChronological(['1792', '1793-06', '1793', '1793-11-08']));
  assert.ok(!isChronological(['1793-11', '1793-06']));
  assert.ok(!isChronological(['1794', '1793-06']));
});

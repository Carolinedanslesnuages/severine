import { ref } from 'vue';

// Minimal hash router: "#/", "#/femme/<slug>", "#/frise", "#/a-propos".
// Hashes that do not start with "#/" are ignored, so in-page anchors keep the current page.

function parse(hash) {
  const path = hash.startsWith('#/') ? hash.slice(1) : '/';
  const womanMatch = path.match(/^\/femme\/([a-z0-9-]+)\/?$/);
  if (womanMatch) return { name: 'woman', slug: womanMatch[1] };
  if (path === '/frise') return { name: 'timeline' };
  if (path === '/a-propos') return { name: 'about' };
  if (path === '/' || path === '') return { name: 'home' };
  return { name: 'notFound' };
}

export const route = ref(parse(location.hash));

window.addEventListener('hashchange', () => {
  if (location.hash && !location.hash.startsWith('#/')) return;
  route.value = parse(location.hash);
});

# Séverine

Les femmes qui ont fait les révolutions : leurs actions, datées et sourcées.

**Site : https://carolinedanslesnuages.github.io/severine/**

Le nom rend hommage à Séverine (Caroline Rémy, 1855-1929), journaliste libertaire, qui a dirigé
*Le Cri du peuple* après la mort de Jules Vallès et a écrit toute sa vie pour celles qu'on
n'écoutait pas.

## Ce qu'on y trouve

- **Les femmes** : une fiche par femme, avec ses actions et ses sources. Recherche sans accents
  et filtre par période.
- **La frise** : toutes les actions, année par année, filtrables par type (prendre les armes,
  écrire, s'organiser, réclamer des droits, instruire et soigner, payer le prix).

Partout dans le monde et à toutes les époques : des sœurs Trưng et de Boudica, qui se soulèvent
contre des empires, jusqu'au mouvement « Femme, vie, liberté ». Filtres par région et par époque.

## Les sources

Chaque fait vient d'une source citée dans la fiche : livre d'historienne ou d'historien, notice du
[Maitron](https://maitron.fr/), encyclopédie, site d'institution (musée, parc national, gouvernement,
Fondation Nobel), texte d'époque. Wikipédia sert à repérer une piste, jamais de
source (le test le refuse). Si une date est incertaine, la fiche garde seulement l'année ou le mois.

## Ajouter ou corriger une femme

Une femme = un fichier `data/women/<identifiant>.json` (minuscules, sans accents, tirets) :

```json
{
  "name": "Louise Michel",
  "birth": "1830",
  "death": "1905",
  "periods": ["commune"],
  "summary": "Une ou deux phrases courtes.",
  "actions": [
    { "date": "1871-03-18", "theme": "armes", "text": "Ce qu'elle a fait, en une ou deux phrases." }
  ],
  "sources": [
    { "title": "MICHEL Louise (Maitron)", "url": "https://maitron.fr/…" },
    { "author": "Louise Michel", "title": "La Commune", "publisher": "Stock", "year": 1898 }
  ]
}
```

- `date` : `AAAA`, `AAAA-MM` ou `AAAA-MM-JJ`, actions dans l'ordre chronologique.
- `death` : vide (`""`) si elle est vivante.
- `periods` : les mouvements de [data/periods.json](data/periods.json). Chaque mouvement a une
  région ([data/regions.json](data/regions.json)) ; l'époque se déduit de la première action
  ([data/eras.json](data/eras.json)). Une date avant l'an 1000 s'écrit sur 4 chiffres : `0060`.
- `theme` : identifiants de [data/themes.json](data/themes.json).
- Une source sans lien cite au moins son auteur.

`npm test` vérifie toutes les fiches.

## Développer

Il faut Node.js 20 ou plus récent.

```sh
npm install
npm run dev            # site local
npm test               # fiches et fonctions
npm run build && npm run preview &
npm run test:browser   # parcours et accessibilité dans Chromium
```

Site en Vue 3 et Vite, sans autre dépendance. Chaque push sur `main` vérifie les fiches, construit le
site, contrôle le parcours et l'accessibilité (RGAA 4.1.2 : titres, lien d'évitement, focus,
messages de statut, reflow à 320 px, texte à 200 %, axe-core en clair et en sombre), puis publie
sur GitHub Pages. Si une vérification échoue, rien n'est publié. Ces contrôles automatiques ne
remplacent pas un audit RGAA complet.

## Licence

[MIT](LICENSE).

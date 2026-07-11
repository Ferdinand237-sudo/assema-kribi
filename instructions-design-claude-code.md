# Instructions design — Finalisation ASSEMA Kribi

## Contexte pour Claude Code

Tu prends en charge la **finition visuelle complète** du site web de l'ASSEMA (Association des Étudiants Mabi de Kribi), un projet Next.js + Supabase + Tailwind CSS déjà entièrement fonctionnel : authentification, profils, commissions, articles, communiqués, messagerie, forum, système de délégation de modules, et une section culturelle riche (villages Mabi, grandes figures, contes, arts culinaires).

**Ta mission n'est PAS de reconstruire des fonctionnalités.** Le code métier, les server actions, les policies RLS Supabase et le stockage fonctionnent déjà et ont été testés intégralement. Ta mission est de **donner au site une identité visuelle cohérente, digne et chaleureuse**, actuellement absente (le site utilise des styles Tailwind par défaut, sans personnalité).

L'esprit du site : une institution culturelle et académique fière de ses racines. Le peuple Mabi de la côte de Kribi. Digne, mais chaleureux — jamais froid ni générique, jamais non plus tape-à-l'œil ou "gadget".

---

## 1. Palette de couleurs (obligatoire, ne pas dévier)

Cette palette est extraite du logo officiel ASSEMA et validée par l'association. Elle doit devenir la seule source de vérité chromatique du site — remplace toutes les couleurs Tailwind par défaut (`green-700`, `green-800`, `gray-*` génériques, etc.) actuellement codées en dur dans les composants.

| Token | Hex | Usage |
|---|---|---|
| `--couleur-primaire` | `#2E9BE0` | Couleur dominante : header, boutons principaux, liens, éléments d'identité, focus states |
| `--couleur-fond-clair` | `#E8F3FB` | Fonds de section alternés, cartes, zones de respiration visuelle |
| `--couleur-blanc` | `#FFFFFF` | Fond principal, cartes |
| `--couleur-encre` | `#1A1F2E` | Texte principal (jamais de noir pur `#000000`) |
| `--couleur-succes` | `#15803D` | **Réservé exclusivement** aux actions de validation/succès : boutons "Publier", "Valider", confirmations. Ne JAMAIS utiliser comme couleur décorative ou générale. C'est un signal, pas une couleur de marque. |
| `--couleur-erreur` | `#DC2626` | Messages d'erreur, actions destructrices (déjà globalement cohérent dans le code existant, garder rouge) |
| `--couleur-attente` | `#CA8A04` | Statuts "en attente de validation" (articles pending, etc.) |

**Implémentation recommandée** : définis ces couleurs comme variables CSS dans `globals.css` (`:root { --couleur-primaire: #2E9BE0; ... }`) et étends la palette Tailwind dans `tailwind.config` (ou via `@theme` si Tailwind v4) pour pouvoir écrire `bg-primaire`, `text-encre`, etc. Remplace ensuite systématiquement toute occurrence de `green-700`, `green-800`, `green-100` utilisée comme couleur de marque par `couleur-primaire`. Ne touche PAS aux couleurs utilisées pour des statuts sémantiques déjà cohérents (rouge = erreur/rejet, jaune = en attente) sauf pour les harmoniser avec les tokens ci-dessus.

---

## 2. Typographie

| Rôle | Police (Google Fonts) | Usage |
|---|---|---|
| Titres (display) | **Fraunces** (poids 400-600, variable si possible) | `h1`, `h2`, titres de section, noms de villages/figures historiques. Utilisée avec retenue — pas sur les labels de formulaire ou le texte courant. |
| Texte courant | **Work Sans** (poids 400-500) | Paragraphes, navigation, boutons, formulaires — tout le texte fonctionnel |
| Données/chiffres | **IBM Plex Mono** (poids 400) | Dates (naissance/décès des figures), population des villages, compteurs, badges numériques — évoque un registre/recensement officiel, cohérent avec l'esprit "mémoire et archive" de la section Culture Mabi |

Charge ces polices via `next/font/google` dans `layout.tsx` (comme c'est déjà fait pour Geist actuellement) et remplace les références à Geist par ces trois nouvelles familles.

**Échelle typographique suggérée** : `h1` en Fraunces 600, taille généreuse (36-48px desktop) ; `h2` Fraunces 600 (28-32px) ; corps de texte Work Sans 400 (16px, line-height 1.6 pour le confort de lecture en français) ; légendes/labels Work Sans 500 en 13-14px ; données chiffrées en IBM Plex Mono 14-16px.

---

## 3. Animations et micro-interactions (obligatoire, mais avec retenue)

Seules ces 4 animations sont demandées. **N'en ajoute pas d'autres** — le site ne doit pas donner une impression de gadget ou d'excès.

### 3.1 Arrivée en douceur (page d'accueil uniquement)
Au chargement de la page d'accueil, le titre principal et le bouton "Rejoindre l'association" apparaissent en fondu enchaîné avec un léger déplacement vertical (translateY de ~12px vers 0), l'un après l'autre avec un délai court (~100-150ms) entre chaque élément. Durée ~500-600ms, easing doux (`ease-out`).

### 3.2 Apparition au défilement
Les blocs de contenu (cartes de projets, actualités, talents, villages, figures, partenaires — partout où il y a des grilles de cartes) apparaissent en fondu + léger déplacement vertical au moment où ils entrent dans le viewport, via `IntersectionObserver` ou une librairie légère. Ne pas re-déclencher l'animation si l'utilisateur remonte puis redescend (une seule fois par élément).

### 3.3 Cartes réactives au survol
Toute carte cliquable (projet, village, figure, partenaire, article, membre) doit réagir au survol : légère élévation (`translateY(-4px)` ou `-2px`), ombre portée qui s'intensifie, transition fluide (~200ms). Sur mobile (pas de hover), cet effet est simplement ignoré — ne pas essayer de le simuler au tap.

### 3.4 Petits signaux vivants
- Les badges de notification (messages non lus, communiqués non lus dans le header) ont une pulsation très subtile et lente (`animation: pulse` discret, pas un clignotement agressif) pour attirer l'attention sans irriter.
- Les confirmations d'action (article publié, message envoyé, profil mis à jour, etc.) doivent apparaître avec une transition douce plutôt que brutalement — un léger fondu + glissement, pas un `alert()` JavaScript basique.

### Ce qu'il ne faut PAS faire
- Pas d'animations de transition entre les pages (route transitions) — complexité disproportionnée par rapport au bénéfice perçu.
- **Pas d'animation dans l'espace admin/gestion** (`/admin/*`, `/gestion/*`) — ces zones doivent rester sobres et efficaces, orientées tâche, pas décoratives.
- Respecte **impérativement** `prefers-reduced-motion` : toutes les animations doivent être désactivées ou réduites au minimum si l'utilisateur a activé cette préférence système.

---

## 4. Application par zone du site

### Zones à traiter avec le plus grand soin visuel (public, vitrine)
- Page d'accueil (`/`)
- Culture Mabi et toutes ses sous-pages (`/culture-mabi`, `/culture-mabi/villages`, `/culture-mabi/villages/[id]`, `/culture-mabi/figures`, `/culture-mabi/contes`, `/culture-mabi/culinaire`) — **c'est le cœur émotionnel du site**, à soigner en priorité
- Pages vitrine (`/a-propos`, `/bureau-executif`, `/partenaires`, `/galerie`, `/projets`, `/projets/[id]`, `/contact`)
- Profils membres publics (`/membres/[id]`)

### Zones fonctionnelles (soin visuel modéré, priorité à la clarté)
- Authentification (`/connexion`, `/inscription`, `/completer-profil`)
- Espace membre (`/profil`, `/messagerie`, `/communiques`, `/forum`)
- Rédaction (`/redaction`)

### Zones utilitaires (sobriété maximale, pas d'animation, pas de fioriture)
- Tout `/admin/*`
- Tout `/gestion/*`

### Éléments transverses à harmoniser
- **Header** (`src/components/site-header.tsx`) et **menu mobile** — appliquer la nouvelle palette et typographie, garder la structure/logique actuelle (menus déroulants Informations/Gestion) intacte.
- **Formulaires** : tous les `input`, `textarea`, `select` doivent avoir un style cohérent (bordure, focus ring dans `--couleur-primaire`, radius cohérent) à travers tout le site — actuellement chaque page a son propre style ad hoc.
- **Boutons** : définir 2-3 variantes réutilisables (primaire = `--couleur-primaire`, succès = `--couleur-succes`, secondaire = neutre/bordure) et les appliquer uniformément — actuellement les couleurs de boutons varient d'une page à l'autre sans cohérence.
- **Badges de statut** (brouillon/en attente/publié/rejeté, etc.) : harmoniser avec `--couleur-attente`, `--couleur-succes`, `--couleur-erreur`.

---

## 5. Détail suggéré (optionnel, si le temps le permet)

Le logo ASSEMA est un blason circulaire. Comme détail de signature visuelle discret, envisage de recadrer en cercle les photos de personnes dans toute la plateforme qui ne le sont pas déjà (photos de profil déjà circulaires — bien ; photos des chefs de village et figures historiques à vérifier/harmoniser en cercle également). C'est un clin d'œil cohérent au blason, sans effort de développement significatif.

---

## 6. Contraintes techniques impératives

- **Ne modifie aucune logique métier** : server actions, requêtes Supabase, policies RLS, structure de données. Le travail est exclusivement visuel (CSS/Tailwind, structure JSX pour l'animation, polices).
- Le site est construit en **Next.js 16 (App Router) + Tailwind CSS + Supabase**. Respecte ces choix techniques, n'introduis pas de nouvelle dépendance lourde sans nécessité (pour les animations, privilégie CSS natif ou une librairie légère type Framer Motion si nécessaire, mais évalue d'abord si CSS pur suffit).
- **Responsive obligatoire** : chaque page doit rester parfaitement utilisable et lisible sur mobile (le site a déjà un menu mobile fonctionnel à conserver).
- **Accessibilité** : focus visible au clavier sur tous les éléments interactifs, contrastes de couleur suffisants (vérifier notamment le texte sur fond `--couleur-fond-clair` et `--couleur-primaire`), respect de `prefers-reduced-motion`.
- Teste chaque page après modification pour t'assurer qu'aucune fonctionnalité existante n'est cassée (formulaires, uploads, navigation).

---

## 7. Ordre de priorité suggéré

1. Fondations : variables de couleur + polices dans `globals.css` / `layout.tsx`, boutons et formulaires harmonisés
2. Header + navigation
3. Page d'accueil
4. Culture Mabi (hub + 4 sous-sections) — la pièce maîtresse
5. Pages vitrine restantes (à propos, bureau, partenaires, galerie, projets, contact)
6. Espace membre (profil, messagerie, communiqués, forum, rédaction)
7. Authentification
8. Espace admin/gestion (sobriété, cohérence de base uniquement)

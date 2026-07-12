// Réduit un contenu (HTML de l'éditeur riche ou markdown hérité) à un extrait en texte brut,
// pour les aperçus (page d'accueil, cartes) où aucune mise en forme ne doit apparaître.
export function extraireTexte(contenu: string, longueur = 140): string {
  const brut = contenu
    .replace(/<[^>]+>/g, ' ')
    .replace(/[*_#>`~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return brut.length > longueur ? `${brut.slice(0, longueur)}` : brut
}

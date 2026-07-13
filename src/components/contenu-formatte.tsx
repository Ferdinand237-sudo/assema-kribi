import sanitizeHtml from 'sanitize-html'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Détecte si le contenu a été rédigé avec le nouvel éditeur riche (HTML) plutôt
// qu'avec l'ancien éditeur markdown (contenu déjà en base avant la mise à jour).
function estDuHtml(texte: string) {
  return /<\/?(p|h[1-6]|ul|ol|li|blockquote|strong|em|a|hr|img)[ >]/i.test(texte)
}

const BALISES_AUTORISEES = ['p', 'br', 'strong', 'em', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'a', 'hr', 'img']
const ATTRIBUTS_AUTORISES = { a: ['href', 'target', 'rel'], img: ['src', 'alt'], '*': ['style'] }

export default function ContenuFormatte({ texte }: { texte: string }) {
  if (estDuHtml(texte)) {
    const propre = sanitizeHtml(texte, {
      allowedTags: BALISES_AUTORISEES,
      allowedAttributes: ATTRIBUTS_AUTORISES,
    })
    return <div className="contenu-riche" dangerouslySetInnerHTML={{ __html: propre }} />
  }

  // Rétrocompatibilité : contenu rédigé avant le passage à l'éditeur riche (markdown brut).
  return (
    <div className="contenu-riche">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{texte}</ReactMarkdown>
    </div>
  )
}

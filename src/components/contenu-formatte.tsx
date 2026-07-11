import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ContenuFormatte({ texte }: { texte: string }) {
  return (
    <div className="space-y-3 text-encre/80">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h2 className="font-display text-xl font-semibold text-primaire">{children}</h2>,
          h2: ({ children }) => <h3 className="font-display text-lg font-semibold text-primaire">{children}</h3>,
          p: ({ children }) => <p className="whitespace-pre-line">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-encre">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => <ul className="list-inside list-disc space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-inside list-decimal space-y-1">{children}</ol>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primaire pl-4 italic text-encre/70">{children}</blockquote>
          ),
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primaire underline">
              {children}
            </a>
          ),
        }}
      >
        {texte}
      </ReactMarkdown>
    </div>
  )
}
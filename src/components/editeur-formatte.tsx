'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import { useState } from 'react'

function BoutonBarre({
  actif,
  desactive,
  titre,
  onClick,
  children,
}: {
  actif?: boolean
  desactive?: boolean
  titre: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={titre}
      disabled={desactive}
      onClick={onClick}
      className={`flex h-7 min-w-7 items-center justify-center rounded px-1 text-sm transition-colors disabled:opacity-30 ${
        actif ? 'bg-primaire text-white' : 'text-encre/80 hover:bg-white'
      }`}
    >
      {children}
    </button>
  )
}

export default function EditeurFormatte({
  name,
  defaultValue,
  placeholder,
  rows = 6,
  required = false,
}: {
  name: string
  defaultValue?: string
  placeholder?: string
  rows?: number
  required?: boolean
}) {
  const [html, setHtml] = useState(defaultValue ?? '')

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: placeholder ?? '' }),
    ],
    content: defaultValue ?? '',
    editorProps: {
      attributes: { class: 'contenu-riche focus:outline-none' },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  })

  if (!editor) {
    return (
      <div className="overflow-hidden rounded-lg border border-[#D1D9E0]">
        <div style={{ minHeight: `${rows * 1.6}rem` }} className="p-3 text-sm text-encre/40">Chargement de l'éditeur...</div>
      </div>
    )
  }

  function definirLien() {
    const url = window.prompt('Adresse du lien (https://...)', editor!.getAttributes('link').href ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor!.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor!.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#D1D9E0]">
      <div className="flex flex-wrap items-center gap-1 border-b border-[#D1D9E0] bg-fond-clair p-1.5">
        <select
          value={
            editor.isActive('heading', { level: 1 }) ? '1'
            : editor.isActive('heading', { level: 2 }) ? '2'
            : editor.isActive('heading', { level: 3 }) ? '3'
            : 'p'
          }
          onChange={(e) => {
            const v = e.target.value
            if (v === 'p') editor.chain().focus().setParagraph().run()
            else editor.chain().focus().toggleHeading({ level: Number(v) as 1 | 2 | 3 }).run()
          }}
          className="h-7 rounded border-0 bg-white px-1 text-xs text-encre/80"
        >
          <option value="p">Texte normal</option>
          <option value="1">Titre 1</option>
          <option value="2">Titre 2</option>
          <option value="3">Titre 3</option>
        </select>

        <span className="mx-1 h-5 w-px bg-black/10" />

        <BoutonBarre titre="Gras" actif={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <span className="font-semibold">G</span>
        </BoutonBarre>
        <BoutonBarre titre="Italique" actif={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <span className="italic">I</span>
        </BoutonBarre>

        <span className="mx-1 h-5 w-px bg-black/10" />

        <BoutonBarre titre="Aligner à gauche" actif={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
          ⬅
        </BoutonBarre>
        <BoutonBarre titre="Centrer" actif={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
          ↔
        </BoutonBarre>
        <BoutonBarre titre="Justifier" actif={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
          ≡
        </BoutonBarre>

        <span className="mx-1 h-5 w-px bg-black/10" />

        <BoutonBarre titre="Liste à puces" actif={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          •
        </BoutonBarre>
        <BoutonBarre titre="Liste numérotée" actif={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1.
        </BoutonBarre>
        <BoutonBarre titre="Citation" actif={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          ”
        </BoutonBarre>
        <BoutonBarre titre="Ligne de séparation" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          ―
        </BoutonBarre>
        <BoutonBarre titre="Lien" actif={editor.isActive('link')} onClick={definirLien}>
          🔗
        </BoutonBarre>
      </div>

      <EditorContent editor={editor} style={{ minHeight: `${rows * 1.6}rem` }} className="p-3" />

      {/* Champ réellement soumis avec le formulaire : masqué visuellement mais toujours
          validable (contrairement à display:none / type=hidden, exclus de la validation native). */}
      <textarea
        name={name}
        value={html}
        required={required}
        readOnly
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      />
    </div>
  )
}

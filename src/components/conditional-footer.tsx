'use client'

import { usePathname } from 'next/navigation'

export default function ConditionalFooter({ footer }: { footer: React.ReactNode }) {
  const pathname = usePathname()
  const estConversation = /^\/messagerie\/[^/]+$/.test(pathname ?? '')

  if (estConversation) return null
  return <>{footer}</>
}

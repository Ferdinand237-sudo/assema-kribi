'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export function estLienActif(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function NavLink({
  href,
  children,
  className = '',
  activeClassName = 'text-primaire font-semibold',
  onClick,
}: {
  href: string
  children: ReactNode
  className?: string
  activeClassName?: string
  onClick?: () => void
}) {
  const pathname = usePathname()
  const actif = estLienActif(pathname, href)

  return (
    <a href={href} onClick={onClick} className={`${className} ${actif ? activeClassName : ''}`.trim()}>
      {children}
    </a>
  )
}

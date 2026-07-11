import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function requireAdminOuPresident() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, first_name, last_name')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'president'].includes(profile.role)) {
    redirect('/')
  }

  return { supabase, profile }
}

export async function requireAdmin() {
  const { supabase, profile } = await requireAdminOuPresident()
  if (profile.role !== 'admin') redirect('/admin')
  return { supabase, profile }
}

export async function requireRedacteur() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, first_name, last_name')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/connexion')

  let commissions: { id: string; nom: string }[] = []
  let rubriquesCulture: { valeur: string; label: string }[] = []

  if (['admin', 'president'].includes(profile.role)) {
    const { data } = await supabase.from('commissions').select('id, nom')
    commissions = data ?? []
    rubriquesCulture = [
      { valeur: 'culture_contes', label: 'Contes & légendes Mabi' },
      { valeur: 'culture_culinaire', label: 'Arts culinaires Mabi' },
    ]
  } else {
    const { data } = await supabase
      .from('commission_members')
      .select('commissions(id, nom)')
      .eq('profile_id', profile.id)
    commissions = (data ?? []).map((d: any) => d.commissions).filter(Boolean)

    const { data: gestions } = await supabase
      .from('gestionnaires_module')
      .select('module')
      .eq('profile_id', profile.id)
      .in('module', ['culture_contes', 'culture_culinaire'])

    rubriquesCulture = (gestions ?? []).map((g: any) => ({
      valeur: g.module,
      label: g.module === 'culture_contes' ? 'Contes & légendes Mabi' : 'Arts culinaires Mabi',
    }))
  }

  return { supabase, profile, commissions, rubriquesCulture }
}

export async function requireModuleManager(module: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, first_name, last_name')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/connexion')

  const estAutorise =
    ['admin', 'president'].includes(profile.role) ||
    (await supabase
      .from('gestionnaires_module')
      .select('id')
      .eq('module', module)
      .eq('profile_id', profile.id)
      .maybeSingle()).data !== null

  if (!estAutorise) redirect('/')

  return { supabase, profile }
}
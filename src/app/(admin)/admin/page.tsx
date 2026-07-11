import { requireAdminOuPresident } from '@/lib/auth/guards'

export default async function PageAdminDashboard() {
  const { profile } = await requireAdminOuPresident()

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-2 text-2xl font-bold">
        Espace {profile.role === 'admin' ? 'Administrateur' : 'Président'}
      </h1>
      <p className="mb-6 text-sm text-gray-600">
        Connecté en tant que {profile.first_name} {profile.last_name}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <a href="/admin/commissions" className="rounded border p-4 hover:bg-gray-50">
          <h2 className="font-semibold">Commissions</h2>
          <p className="text-sm text-gray-600">Créer et gérer les commissions</p>
        </a>
        <a href="/admin/membres" className="rounded border p-4 hover:bg-gray-50">
          <h2 className="font-semibold">Membres & rôles</h2>
          <p className="text-sm text-gray-600">Gérer les rôles et le bureau</p>
        </a>
        <a href="/admin/articles" className="rounded border p-4 hover:bg-gray-50">
          <h2 className="font-semibold">Articles à valider</h2>
          <p className="text-sm text-gray-600">Approuver ou rejeter</p>
        </a>
        <a href="/admin/contenu-pages" className="rounded border p-4 hover:bg-gray-50">
          <h2 className="font-semibold">Contenu des pages</h2>
          <p className="text-sm text-gray-600">Éditer À propos et Contact</p>
        </a>
      </div>
    </div>
  )
}
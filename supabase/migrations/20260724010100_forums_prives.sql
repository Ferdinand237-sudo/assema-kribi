-- Forums de discussion privés : le créateur choisit librement les participants,
-- le forum n'est visible que par le créateur et les participants ajoutés.

create table if not exists forums_prives (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  created_by uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists forum_prive_participants (
  id uuid primary key default gen_random_uuid(),
  forum_id uuid not null references forums_prives(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  added_at timestamptz not null default now(),
  unique (forum_id, profile_id)
);

create table if not exists forum_prive_messages (
  id uuid primary key default gen_random_uuid(),
  forum_id uuid not null references forums_prives(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter table forums_prives enable row level security;
alter table forum_prive_participants enable row level security;
alter table forum_prive_messages enable row level security;

-- Un utilisateur fait partie d'un forum privé s'il en est le créateur ou un participant ajouté.
create or replace function est_membre_forum_prive(p_forum_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from forums_prives f
    where f.id = p_forum_id and f.created_by = auth.uid()
  ) or exists (
    select 1 from forum_prive_participants pp
    where pp.forum_id = p_forum_id and pp.profile_id = auth.uid()
  );
$$;

create policy "Voir ses forums privés" on forums_prives
  for select using (est_membre_forum_prive(id));
create policy "Créer un forum privé" on forums_prives
  for insert with check (created_by = auth.uid());
create policy "Supprimer son forum privé" on forums_prives
  for delete using (created_by = auth.uid());

create policy "Voir les participants de ses forums" on forum_prive_participants
  for select using (est_membre_forum_prive(forum_id));
create policy "Le créateur ajoute des participants" on forum_prive_participants
  for insert with check (
    exists (select 1 from forums_prives f where f.id = forum_id and f.created_by = auth.uid())
  );
create policy "Le créateur retire des participants" on forum_prive_participants
  for delete using (
    exists (select 1 from forums_prives f where f.id = forum_id and f.created_by = auth.uid())
  );

create policy "Lire les messages de ses forums" on forum_prive_messages
  for select using (est_membre_forum_prive(forum_id));
create policy "Écrire dans ses forums" on forum_prive_messages
  for insert with check (author_id = auth.uid() and est_membre_forum_prive(forum_id));

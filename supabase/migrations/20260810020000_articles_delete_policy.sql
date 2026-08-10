create policy "Auteurs et admins peuvent supprimer des articles"
on public.articles
for delete
to authenticated
using (
  author_id = auth.uid()
  or exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role in ('admin', 'president')
  )
);

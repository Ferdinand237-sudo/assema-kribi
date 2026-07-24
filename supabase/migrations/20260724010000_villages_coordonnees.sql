-- Coordonnées GPS des villages Mabi, pour la carte interactive.
alter table villages_mabi
  add column if not exists latitude double precision,
  add column if not exists longitude double precision;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  body_number text unique,
  username text unique,
  rank text not null,
  name text not null,
  company text not null,
  phone text not null,
  role text not null check (role in ('cadet', 'duty_officer')),
  password text not null,
  created_at timestamptz not null default now()
);

create table if not exists movement_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  body_number text,
  rank text,
  name text,
  peringkat text,
  phone text,
  vehicle text,
  destination text not null,
  purpose text not null,
  expected_return timestamptz not null,
  checkout_time timestamptz,
  return_time timestamptz,
  status text not null default 'pending',
  approved_by uuid references users(id),
  remarks text,
  qr_token text,
  duty_officer_name text,
  duty_officer_id text,
  duty_started_at timestamptz,
  duty_ended_at timestamptz,
  approval_time timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists sick_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  body_number text not null,
  rank text not null,
  name text not null,
  peringkat text,
  phone text not null,
  symptoms text not null,
  description text not null,
  location_type text not null,
  building text,
  room text,
  status text not null default 'active',
  officer_remarks text,
  qr_token text,
  duty_officer_name text,
  duty_officer_id text,
  duty_started_at timestamptz,
  duty_ended_at timestamptz,
  check_in_time timestamptz not null default now(),
  check_out_time timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  created_by uuid not null references users(id),
  created_at timestamptz not null default now()
);

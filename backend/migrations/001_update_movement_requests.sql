alter table movement_requests add column if not exists body_number text;
alter table movement_requests add column if not exists rank text;
alter table movement_requests add column if not exists name text;
alter table movement_requests add column if not exists phone text;
alter table movement_requests add column if not exists vehicle text;
alter table movement_requests add column if not exists qr_token text;
alter table movement_requests add column if not exists approval_time timestamptz;

alter table movement_requests alter column user_id drop not null;

alter table movement_requests drop constraint if exists movement_requests_user_id_fkey;

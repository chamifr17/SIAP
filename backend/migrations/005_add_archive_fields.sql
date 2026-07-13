alter table sick_reports add column if not exists is_archived boolean not null default false;
alter table sick_reports add column if not exists delete_reason text;
alter table sick_reports add column if not exists deleted_at timestamptz;
alter table sick_reports add column if not exists deleted_by text;

alter table movement_requests add column if not exists is_archived boolean not null default false;
alter table movement_requests add column if not exists delete_reason text;
alter table movement_requests add column if not exists deleted_at timestamptz;
alter table movement_requests add column if not exists deleted_by text;

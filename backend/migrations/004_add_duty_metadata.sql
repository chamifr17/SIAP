alter table sick_reports add column if not exists duty_officer_name text;
alter table sick_reports add column if not exists duty_officer_id text;
alter table sick_reports add column if not exists duty_started_at timestamptz;
alter table sick_reports add column if not exists duty_ended_at timestamptz;

alter table movement_requests add column if not exists duty_officer_name text;
alter table movement_requests add column if not exists duty_officer_id text;
alter table movement_requests add column if not exists duty_started_at timestamptz;
alter table movement_requests add column if not exists duty_ended_at timestamptz;

notify pgrst, 'reload schema';


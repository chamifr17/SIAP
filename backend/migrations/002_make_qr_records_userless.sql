alter table movement_requests alter column user_id drop not null;
alter table movement_requests drop constraint if exists movement_requests_user_id_fkey;

alter table sick_reports alter column user_id drop not null;
alter table sick_reports drop constraint if exists sick_reports_user_id_fkey;

notify pgrst, 'reload schema';


alter table sick_reports add column if not exists peringkat text;
alter table movement_requests add column if not exists peringkat text;

notify pgrst, 'reload schema';


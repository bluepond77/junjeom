insert into public.profiles (id, display_name, role)
select id, '오쿠박', 'owner'
from auth.users
where email = 'okupark@gmail.com'
on conflict (id) do update set role = 'owner';

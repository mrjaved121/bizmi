-- Fixes infinite recursion between classrooms/classroom_students RLS:
-- classrooms_student_read (on classrooms) queries classroom_students, and
-- classroom_students_teacher_all (on classroom_students) queried classrooms
-- directly, so any query touching both tables recursed. Same fix pattern as
-- is_staff() — a security-definer function breaks the cycle by bypassing
-- RLS internally.

create or replace function public.is_classroom_teacher(target_classroom_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from classrooms
    where id = target_classroom_id and teacher_id = auth.uid()
  );
$$;

drop policy if exists "classroom_students_teacher_all" on classroom_students;
create policy "classroom_students_teacher_all" on classroom_students for all
  using (public.is_classroom_teacher(classroom_id))
  with check (public.is_classroom_teacher(classroom_id));

-- Bizmi — initial schema
-- Run this in the Supabase SQL Editor (or `supabase db push` if you're using
-- the CLI) against a fresh project. Matches BIZMI_MASTER_PROMPT.md Part 7.
-- Order matters — tables reference earlier tables via foreign keys.

-- ============================================================
-- 0. Extensions
-- ============================================================

create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists pg_trgm;    -- typo-tolerant product search

-- ============================================================
-- 1. Users & profiles
-- ============================================================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text check (role in ('customer','student','teacher','school_admin','staff','admin')) default 'customer',
  phone text,
  phone_verified boolean default false,
  city text,
  province text,
  address text,
  avatar_url text,
  preferred_language text default 'en',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  province text,
  contact_person text,
  contact_phone text,
  contact_email text,
  verified boolean default false,
  billing_address text,
  created_at timestamptz default now()
);

create table school_members (
  school_id uuid references schools(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  role_in_school text,
  primary key (school_id, user_id)
);

create table classrooms (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references profiles(id),
  school_id uuid references schools(id),
  name text,
  grade_level text,
  join_code text unique,
  created_at timestamptz default now()
);

create table classroom_students (
  classroom_id uuid references classrooms(id) on delete cascade,
  student_id uuid references profiles(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (classroom_id, student_id)
);

-- ============================================================
-- 2. Product catalog
-- ============================================================

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  name text, name_ur text,
  description text,
  parent_id uuid references categories(id),
  color text,
  order_index int default 0,
  is_active boolean default true
);

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  sku text unique,
  name text, name_ur text,
  short_description text, short_description_ur text,
  long_description text, long_description_ur text,
  category_id uuid references categories(id),
  brand text,
  product_type text check (product_type in ('physical','digital')),
  price_pkr integer,
  compare_at_price_pkr integer,
  cost_pkr integer,
  weight_grams int,
  cover_image text,
  gallery text[],
  specs jsonb,
  components jsonb,
  age_min int, age_max int,
  grade_tags text[],
  difficulty text check (difficulty in ('beginner','intermediate','advanced')),
  featured boolean default false,
  is_bestseller boolean default false,
  is_new boolean default false,
  inventory_count int default 0,
  low_stock_threshold int default 5,
  is_active boolean default true,
  meta_title text, meta_description text, og_image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table digital_files (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  file_name text,
  file_path text,
  file_size_bytes bigint,
  file_type text,
  is_preview boolean default false,
  order_index int default 0
);

create table product_bundles (
  bundle_id uuid references products(id) on delete cascade,
  included_product_id uuid references products(id),
  discount_percent int default 0,
  primary key (bundle_id, included_product_id)
);

-- ============================================================
-- 3. Cart & orders
-- ============================================================

create table carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  session_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table cart_items (
  cart_id uuid references carts(id) on delete cascade,
  product_id uuid references products(id),
  quantity int check (quantity > 0),
  price_at_add_pkr int,
  primary key (cart_id, product_id)
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique,           -- e.g. BZ-0000123
  user_id uuid references profiles(id),
  guest_email text,
  guest_phone text,
  guest_access_token uuid default gen_random_uuid(),
  status text check (status in (
    'pending','phone_confirmed','payment_pending','paid',
    'dispatched','delivered','completed','cancelled','refunded'
  )) default 'pending',
  payment_method text check (payment_method in (
    'cod','bank_transfer','invoice','stripe','telr','jazzcash'
  )),
  payment_reference text,
  subtotal_pkr int,
  discount_pkr int default 0,
  discount_code text,
  delivery_fee_pkr int,
  total_pkr int,
  currency text default 'PKR',
  shipping_name text,
  shipping_phone text,
  shipping_address text,
  shipping_city text,
  shipping_province text,
  notes text,
  courier text,
  tracking_number text,
  is_school_order boolean default false,
  school_id uuid references schools(id),
  po_number text,
  internal_notes text,
  confirmed_at timestamptz,
  dispatched_at timestamptz,
  delivered_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_type text,
  product_name_snapshot text,
  quantity int,
  unit_price_pkr int,
  unit_cost_pkr int,
  line_total_pkr int
);

create table order_status_log (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  from_status text,
  to_status text,
  actor_id uuid references profiles(id),
  note text,
  created_at timestamptz default now()
);

-- ============================================================
-- 4. Digital product delivery
-- ============================================================

create table digital_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  product_id uuid references products(id),
  order_id uuid references orders(id),
  granted_at timestamptz default now(),
  download_count int default 0,
  max_downloads int default 100,
  unique (user_id, product_id)
);

create table download_log (
  id uuid primary key default gen_random_uuid(),
  grant_id uuid references digital_grants(id),
  file_id uuid references digital_files(id),
  ip_address text,
  user_agent text,
  downloaded_at timestamptz default now()
);

-- ============================================================
-- 5. Courses
-- ============================================================

create table courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text, title_ur text,
  description text, description_ur text,
  category text,
  difficulty text,
  duration_weeks int,
  price_pkr int,
  cover_image text,
  intro_video_url text,
  instructor_name text,
  instructor_bio text,
  instructor_photo text,
  is_published boolean default false,
  created_at timestamptz default now()
);

create table course_lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  order_index int,
  title text,
  content_md text,
  video_url text,
  duration_minutes int,
  is_free_preview boolean default false
);

create table course_enrollments (
  user_id uuid references profiles(id),
  course_id uuid references courses(id),
  enrolled_at timestamptz default now(),
  completed_at timestamptz,
  progress_percent int default 0,
  primary key (user_id, course_id)
);

-- ============================================================
-- 6. Services, school demos & testimonials
-- ============================================================

create table service_inquiries (
  id uuid primary key default gen_random_uuid(),
  service_type text,
  school_name text,
  contact_name text,
  contact_role text,
  contact_email text,
  contact_phone text,
  city text,
  student_count int,
  grade_levels text[],
  interests text[],
  preferred_demo_at timestamptz,
  message text,
  status text default 'new',
  assigned_to uuid references profiles(id),
  created_at timestamptz default now()
);

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  attribution text not null,
  school_id uuid references schools(id),
  context text check (context in ('home','schools','course')) default 'home',
  is_published boolean default true,
  order_index int default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- 7. Miscellaneous
-- ============================================================

create table wishlists (
  user_id uuid references profiles(id),
  product_id uuid references products(id),
  added_at timestamptz default now(),
  primary key (user_id, product_id)
);

create table product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  user_id uuid references profiles(id),
  rating int check (rating between 1 and 5),
  title text,
  body text,
  is_verified_purchase boolean default false,
  is_published boolean default true,
  created_at timestamptz default now()
);

create table discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  discount_type text check (discount_type in ('percent','fixed')),
  amount int,
  min_order_pkr int,
  max_uses int,
  used_count int default 0,
  valid_from timestamptz,
  valid_until timestamptz,
  is_active boolean default true
);

create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  subscribed_at timestamptz default now(),
  unsubscribed_at timestamptz
);

create table posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text,
  excerpt text,
  cover_image text,
  category text,
  author_name text,
  author_photo text,
  content_md text,
  read_minutes int,
  is_published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================================
-- 8. Indexes
-- ============================================================

create index if not exists products_category_id_idx on products (category_id);
create index if not exists products_name_trgm_idx on products using gin (name gin_trgm_ops);
create index if not exists products_sku_trgm_idx on products using gin (sku gin_trgm_ops);
create index if not exists orders_user_id_idx on orders (user_id);
create index if not exists orders_status_idx on orders (status);
create index if not exists order_items_order_id_idx on order_items (order_id);
create index if not exists cart_items_cart_id_idx on cart_items (cart_id);
create index if not exists digital_grants_user_id_idx on digital_grants (user_id);
create index if not exists wishlists_user_id_idx on wishlists (user_id);
create index if not exists course_enrollments_user_id_idx on course_enrollments (user_id);
create index if not exists classroom_students_classroom_id_idx on classroom_students (classroom_id);
create index if not exists school_members_school_id_idx on school_members (school_id);
create index if not exists service_inquiries_status_idx on service_inquiries (status);
create index if not exists product_reviews_product_id_idx on product_reviews (product_id);

-- ============================================================
-- 9. Helper functions
-- ============================================================

-- security definer so it can read `profiles` without tripping that table's
-- own RLS (avoids self-referencing recursion in the policies below)
create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role in ('admin','staff')
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on profiles
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on products
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on carts
  for each row execute procedure public.set_updated_at();

-- auto-create a profile row whenever someone signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone',
    coalesce(new.raw_user_meta_data ->> 'role', 'customer')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 10. Row Level Security
-- ============================================================

-- profiles
alter table profiles enable row level security;
create policy "profiles_self_or_staff_read" on profiles for select
  using (auth.uid() = id or public.is_staff());
create policy "profiles_self_update" on profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);

-- schools
alter table schools enable row level security;
create policy "schools_member_or_staff_read" on schools for select
  using (
    exists (select 1 from school_members where school_id = schools.id and user_id = auth.uid())
    or public.is_staff()
  );
create policy "schools_staff_write" on schools for all
  using (public.is_staff()) with check (public.is_staff());

-- school_members
alter table school_members enable row level security;
create policy "school_members_self_or_staff_read" on school_members for select
  using (user_id = auth.uid() or public.is_staff());
create policy "school_members_staff_write" on school_members for all
  using (public.is_staff()) with check (public.is_staff());

-- classrooms
alter table classrooms enable row level security;
create policy "classrooms_teacher_all" on classrooms for all
  using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());
create policy "classrooms_student_read" on classrooms for select
  using (exists (
    select 1 from classroom_students
    where classroom_id = classrooms.id and student_id = auth.uid()
  ));
create policy "classrooms_staff_read" on classrooms for select using (public.is_staff());

-- classroom_students
alter table classroom_students enable row level security;
create policy "classroom_students_teacher_all" on classroom_students for all
  using (exists (
    select 1 from classrooms
    where classrooms.id = classroom_students.classroom_id and classrooms.teacher_id = auth.uid()
  ))
  with check (exists (
    select 1 from classrooms
    where classrooms.id = classroom_students.classroom_id and classrooms.teacher_id = auth.uid()
  ));
create policy "classroom_students_self_read" on classroom_students for select
  using (student_id = auth.uid());
create policy "classroom_students_self_join" on classroom_students for insert
  with check (student_id = auth.uid());

-- categories
alter table categories enable row level security;
create policy "categories_public_read" on categories for select using (is_active = true);
create policy "categories_staff_write" on categories for all
  using (public.is_staff()) with check (public.is_staff());

-- products
alter table products enable row level security;
create policy "products_public_read" on products for select using (is_active = true);
create policy "products_staff_all" on products for all
  using (public.is_staff()) with check (public.is_staff());

-- digital_files (real downloads are served via a service-role route handler,
-- which bypasses RLS entirely — clients only ever need the preview file)
alter table digital_files enable row level security;
create policy "digital_files_preview_read" on digital_files for select using (is_preview = true);
create policy "digital_files_staff_all" on digital_files for all
  using (public.is_staff()) with check (public.is_staff());

-- product_bundles
alter table product_bundles enable row level security;
create policy "product_bundles_public_read" on product_bundles for select using (true);
create policy "product_bundles_staff_write" on product_bundles for all
  using (public.is_staff()) with check (public.is_staff());

-- carts / cart_items (guest carts live in localStorage — see Part 8;
-- these policies only ever apply once a cart is tied to a signed-in user)
alter table carts enable row level security;
create policy "carts_own_all" on carts for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table cart_items enable row level security;
create policy "cart_items_own_all" on cart_items for all
  using (exists (select 1 from carts where carts.id = cart_items.cart_id and carts.user_id = auth.uid()))
  with check (exists (select 1 from carts where carts.id = cart_items.cart_id and carts.user_id = auth.uid()));

-- orders (writes happen through the `createOrder` / `updateOrderStatus`
-- server actions using the service-role client, so no client insert/update
-- policy is needed — only read access for the owner and staff)
alter table orders enable row level security;
create policy "orders_own_read" on orders for select
  using (user_id = auth.uid() or public.is_staff());

alter table order_items enable row level security;
create policy "order_items_via_order_read" on order_items for select
  using (exists (
    select 1 from orders
    where orders.id = order_items.order_id
    and (orders.user_id = auth.uid() or public.is_staff())
  ));

alter table order_status_log enable row level security;
create policy "order_status_log_staff_read" on order_status_log for select
  using (public.is_staff());

-- digital_grants / download_log
alter table digital_grants enable row level security;
create policy "grants_own_read" on digital_grants for select using (user_id = auth.uid());
create policy "grants_staff_read" on digital_grants for select using (public.is_staff());

alter table download_log enable row level security;
create policy "download_log_staff_read" on download_log for select using (public.is_staff());

-- courses
alter table courses enable row level security;
create policy "courses_public_read" on courses for select using (is_published = true);
create policy "courses_staff_all" on courses for all
  using (public.is_staff()) with check (public.is_staff());

alter table course_lessons enable row level security;
create policy "course_lessons_preview_read" on course_lessons for select using (is_free_preview = true);
create policy "course_lessons_enrolled_read" on course_lessons for select
  using (exists (
    select 1 from course_enrollments
    where course_enrollments.course_id = course_lessons.course_id
    and course_enrollments.user_id = auth.uid()
  ));
create policy "course_lessons_staff_all" on course_lessons for all
  using (public.is_staff()) with check (public.is_staff());

alter table course_enrollments enable row level security;
create policy "enrollments_own_all" on course_enrollments for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "enrollments_staff_read" on course_enrollments for select using (public.is_staff());

-- service_inquiries (inserts happen via a server action using the
-- service-role client — no public insert policy needed)
alter table service_inquiries enable row level security;
create policy "inquiries_staff_read" on service_inquiries for select using (public.is_staff());
create policy "inquiries_staff_write" on service_inquiries for update using (public.is_staff());

-- testimonials
alter table testimonials enable row level security;
create policy "testimonials_public_read" on testimonials for select using (is_published = true);
create policy "testimonials_staff_all" on testimonials for all
  using (public.is_staff()) with check (public.is_staff());

-- wishlists
alter table wishlists enable row level security;
create policy "wishlists_own_all" on wishlists for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- product_reviews
alter table product_reviews enable row level security;
create policy "reviews_public_read" on product_reviews for select using (is_published = true);
create policy "reviews_own_write" on product_reviews for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "reviews_staff_all" on product_reviews for all
  using (public.is_staff()) with check (public.is_staff());

-- discount_codes
alter table discount_codes enable row level security;
create policy "discount_codes_public_read" on discount_codes for select
  using (
    is_active = true
    and (valid_from is null or valid_from <= now())
    and (valid_until is null or valid_until >= now())
  );
create policy "discount_codes_staff_all" on discount_codes for all
  using (public.is_staff()) with check (public.is_staff());

-- newsletter_subscribers (public can subscribe; only staff can read the list)
alter table newsletter_subscribers enable row level security;
create policy "newsletter_public_insert" on newsletter_subscribers for insert with check (true);
create policy "newsletter_staff_read" on newsletter_subscribers for select using (public.is_staff());

-- posts
alter table posts enable row level security;
create policy "posts_public_read" on posts for select using (is_published = true);
create policy "posts_staff_all" on posts for all
  using (public.is_staff()) with check (public.is_staff());

-- ============================================================
-- 11. Storage buckets
-- ============================================================

insert into storage.buckets (id, name, public)
values
  ('products', 'products', true),
  ('digital-source', 'digital-source', false),
  ('digital-watermarked', 'digital-watermarked', false),
  ('certificates', 'certificates', false)
on conflict (id) do nothing;

create policy "products_bucket_public_read" on storage.objects for select
  using (bucket_id = 'products');
create policy "products_bucket_staff_write" on storage.objects for all
  using (bucket_id = 'products' and public.is_staff())
  with check (bucket_id = 'products' and public.is_staff());

-- digital-source / digital-watermarked / certificates are never read
-- directly by clients — the download route and PDF generators use the
-- service-role key, which bypasses storage RLS entirely. Staff still need
-- direct access for uploading source files via /admin/digital.
create policy "private_buckets_staff_all" on storage.objects for all
  using (bucket_id in ('digital-source','digital-watermarked','certificates') and public.is_staff())
  with check (bucket_id in ('digital-source','digital-watermarked','certificates') and public.is_staff());

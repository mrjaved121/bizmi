# Bizmi — Full Build Prompt for Next.js

> **How to use this file:** Paste the contents into Claude Code or Cursor at the start of a new Next.js project. This is a complete build brief — brand, design system, product catalog, database schema, features, and phased roadmap. Everything in one place.

---

## 1. Project Overview

**Product:** Bizmi is a gamified robotics, electronics, and STEM e-commerce platform for Pakistani schools and curious kids at home. It sells physical kits, development boards, sensors, and digital programming project packs — plus offers school services (curriculum, teacher training, lab setup) and courses.

**One-liner:** "Learn. Build. Create. Innovate." — everything a young engineer needs, in one workshop.

**Market:** Launching Pakistan-wide, headquartered in Faisalabad, Punjab.

**Primary buyers:**
- Schools (bulk institutional orders, POs, invoices)
- Teachers (individual class kits)
- Parents (birthday gifts, learning support at home)
- Hobbyists (18+ makers)

**End users:** Students ages 6–18.

**Payment reality:**
- Cash on Delivery (primary)
- Bank Transfer (upload receipt)
- Institutional Purchase Order / Invoice for schools (10+ units)
- Online gateway (Stripe / Telr / JazzCash) is Phase 2 — build the order model so it slots in later.

**Languages:** English + Urdu (RTL). PKR only for MVP.

**Fulfillment:** TCS / Leopards / M&P nationwide courier.

---

## 2. Brand & Visual Identity

### Brand name
**Bizmi** — styled as "Bizmi" in prose, with multi-color letters in the logo mark.

### Tagline
"Learn · Build · Create · Innovate"

### Multi-color letter system (used in logo, footer, key headlines)
- **B** — Orange `#FF6B35`
- **i** — Blue `#3B82F6`
- **z** — Purple `#8B5CF6`
- **m** — Yellow `#FDB833`
- **i** — Green `#34D399`

### Mascot
A friendly cartoon robot with a screen face, waving hand, antenna with a red bulb, and orange body. Used in hero sections and empty states. Available as SVG components at `/components/brand/RobotMascot.tsx`.

### Personality
Playful, curious, warm. Never corporate. Never childish. Speaks to kids AND respects parents/school admins. Voice guidelines:
- Use sentence case everywhere (not Title Case)
- Contractions are fine ("you'll", "we've")
- Verbs first ("Build your first robot", not "Robot building starts here")
- No "please", no "!" on system UI, no "click here"

---

## 3. Design System

### 3.1 Color palette

Store as CSS variables at `/app/globals.css`:

```css
:root {
  /* Base surfaces */
  --bg: #FFFBF3;              /* Warm cream base */
  --surface: #FFFFFF;         /* Pure white cards */
  --surface-2: #FAF6EC;       /* Slightly warmer surface */
  --ink: #1A1A2E;             /* Rich navy-black text */
  --ink-2: #4A4A5E;           /* Secondary text */
  --muted: #8B8B9A;            /* Muted / metadata */
  --line: #EEE8DA;             /* Dividers / borders */

  /* Department signature colors */
  --orange: #FF6B35;           /* Robotics · Primary CTA */
  --orange-soft: #FFE8DE;
  --blue: #3B82F6;             /* Arduino */
  --blue-soft: #DBEAFE;
  --red: #E63946;              /* Raspberry Pi */
  --red-soft: #FFE1E4;
  --purple: #8B5CF6;           /* STM32 */
  --purple-soft: #EDE4FE;
  --green: #34D399;            /* Sensors */
  --green-soft: #D6F5E5;
  --yellow: #FDB833;           /* Digital / Highlights */
  --yellow-soft: #FFF3D6;
  --pink: #EC4899;             /* Accent only */
  --pink-soft: #FCE7F3;
}
```

Tailwind config extension in `tailwind.config.ts`:

```ts
theme: {
  extend: {
    colors: {
      bg: 'var(--bg)',
      surface: 'var(--surface)',
      'surface-2': 'var(--surface-2)',
      ink: { DEFAULT: 'var(--ink)', 2: 'var(--ink-2)' },
      muted: 'var(--muted)',
      line: 'var(--line)',
      orange: { DEFAULT: 'var(--orange)', soft: 'var(--orange-soft)' },
      blue: { DEFAULT: 'var(--blue)', soft: 'var(--blue-soft)' },
      red: { DEFAULT: 'var(--red)', soft: 'var(--red-soft)' },
      purple: { DEFAULT: 'var(--purple)', soft: 'var(--purple-soft)' },
      green: { DEFAULT: 'var(--green)', soft: 'var(--green-soft)' },
      yellow: { DEFAULT: 'var(--yellow)', soft: 'var(--yellow-soft)' },
      pink: { DEFAULT: 'var(--pink)', soft: 'var(--pink-soft)' },
    },
    fontFamily: {
      serif: ['var(--font-fraunces)', 'serif'],
      sans: ['var(--font-inter)', 'sans-serif'],
      mono: ['var(--font-jetbrains)', 'monospace'],
    },
    borderRadius: {
      '4xl': '32px',
      '5xl': '40px',
    }
  }
}
```

### 3.2 Typography

Load via `next/font/google`:

```tsx
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });
```

**Usage:**
- `font-serif` (Fraunces): all display headings, hero copy, editorial moments
- `font-serif italic`: emphasized phrases inside a heading
- `font-sans` (Inter): all body text
- `font-mono` (JetBrains Mono): prices, SKUs, badges, small labels

**Type scale:**
- Hero: `text-[clamp(56px,8.5vw,118px)]` line-height 0.96, letter-spacing -0.03em
- Section: `text-[clamp(38px,5.5vw,72px)]` line-height 1, letter-spacing -0.02em
- Card title: `text-2xl` to `text-3xl` (font-serif)
- Body: `text-base leading-relaxed`
- Micro: `text-xs font-mono uppercase tracking-wider`

### 3.3 Component patterns

**Rounded corners:**
- Small elements (chips, buttons): `rounded-full`
- Product cards: `rounded-3xl` (24px)
- Bento tiles: `rounded-[32px]`
- Section blocks with curved top: `rounded-t-[40px]`

**Buttons:**
- Primary: black bg (`bg-ink`), white text, `rounded-full`, `px-6 py-3.5`, hover translate-y-[-2px]
- Orange CTA: `bg-orange`, white text
- Outline: transparent bg, 1.5px `border-ink`, hover fills

**Chips:**
- Base: `bg-white border border-line rounded-full px-3.5 py-1.5 font-mono text-xs`
- Colored variants: soft bg + strong color text (e.g. `bg-blue-soft text-blue`)

**Cards:**
- White bg, `border border-line`, `rounded-3xl p-6`, hover translate + soft shadow

**Arrow bubbles (for card CTAs):**
- 44×44 circle, ink bg, white arrow, rotates -45deg + scales on parent card hover

**Section eyebrow:**
- Mono, uppercase, tracking-widest, prefixed with an orange dot (`::before`)

**Wavy underline flourish:**
- Applied to a `<span>` via SVG background-image, orange stroke, used sparingly on hero words

**Section rhythm:**
- Standard: `py-24` (mobile `py-16`)
- Rounded-top blocks: alternate between `bg-surface`, `bg-white`, and `bg-ink` (dark blocks)

### 3.4 Component library

Use **shadcn/ui** as base, restyled to match the design system. Install and customize:
- Button (with orange, ink, outline variants)
- Input (rounded-full for newsletter, standard for forms)
- Sheet (mobile menu, cart drawer)
- Dialog (modal confirmations)
- Card
- Badge (map to our chip system)
- Toast (Sonner)
- Skeleton (loading states)

Custom components at `/components/`:
- `<Chip variant="blue|red|purple|green|yellow|orange|dark" />`
- `<DepartmentCard color="orange" title subtitle count />`
- `<ProductCard product />`
- `<Eyebrow>01 / Shop</Eyebrow>`
- `<BrandMark size="sm|md|lg" />` (multi-color Bizmi logo)
- `<Mascot pose="waving|thinking|building" />`
- `<Marquee items={[]} />`

---

## 4. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) + TypeScript | RSC for catalog SEO |
| Styling | Tailwind CSS + shadcn/ui + Framer Motion | Framer Motion for hero animations, hover transitions |
| Database + Auth | Supabase (Postgres + Auth + Storage + Realtime) | Row-level security enforces role-based access |
| State | Zustand | Cart, UI state |
| Forms | React Hook Form + Zod | Checkout, address, contact |
| Emails | Resend + React Email | Order confirmations, digital delivery, invoices |
| SMS | Local PK provider (Jazz/Zong bulk SMS) OR Twilio | COD confirmations |
| PDF generation | `@react-pdf/renderer` | Invoices, certificates, digital product delivery packaging |
| Digital delivery | Supabase Storage with signed URLs | Secure download links for project packs |
| Hosting | Vercel | Auto ISR for catalog |
| Error tracking | Sentry | |
| Analytics | PostHog | Product analytics + funnels |
| Payments (Phase 2) | Stripe (international) + Telr / PayTabs / JazzCash (PK) | Not needed for MVP |
| i18n | `next-intl` | English + Urdu (RTL) |

---

## 5. Site Map & Routes

```
/                                       Home
/shop                                   All products catalog
/shop/robotics-kits                     Robotics kits category
/shop/arduino                           Arduino boards subcategory
/shop/raspberry-pi                      Raspberry Pi subcategory
/shop/stm32                             STM32 subcategory
/shop/sensors                           Sensors & shields
/shop/stem-toys                         STEM toys
/shop/smart-gadgets                     Smart / IoT
/shop/gaming-gadgets                    Gaming
/shop/[category]/[product-slug]         Product detail page
/digital                                Digital products catalog
/digital/[pack-slug]                    Project pack detail
/courses                                All courses
/courses/[course-slug]                  Course detail
/schools                                For Schools landing
/schools/curriculum                     Curriculum service
/schools/lab-setup                      Lab setup service
/schools/teacher-training               Teacher training service
/schools/lesson-plans                   Lesson plans service
/schools/evaluation                     Student evaluation service
/schools/book-demo                      Demo booking form
/simulator                              Free circuit simulator (Phase 3)
/about                                  About us
/contact                                Contact
/blog                                   Blog (optional Phase 2)
/blog/[slug]                            Blog post

/auth/sign-in                           Sign in
/auth/sign-up                           Sign up
/auth/verify                            Phone/email verification

/account                                Account dashboard (redirects based on role)
/account/orders                         Order history
/account/orders/[order-id]              Order detail
/account/downloads                      Digital product downloads
/account/certificates                   Earned certificates
/account/progress                       Mission / course progress
/account/settings                       Profile, address, language

/teacher                                Teacher dashboard
/teacher/classrooms                     Classroom list
/teacher/classrooms/[id]                Classroom detail + student progress
/teacher/assignments                    Mission assignments

/admin                                  Admin dashboard (role-gated)
/admin/orders                           Order management
/admin/products                         Product CMS
/admin/digital                          Digital product CMS
/admin/customers                        User management
/admin/schools                          School accounts
/admin/analytics                        Sales + engagement analytics

/cart                                   Cart page (also drawer)
/checkout                               Checkout flow (guest allowed)
/checkout/success                       Order confirmation
```

---

## 6. Product Catalog Taxonomy

### 6.1 Physical products

#### Robotics (department 01, color: orange)
- **Robotics Kits** — complete beginner-to-advanced kits
  - Bizmi Robotics & Electronics Kit (ages 6–10) — flagship kit
  - Line Follower Bot Kit
  - Bluetooth Rover Kit
  - Obstacle Avoiding Robot Kit
  - Robotic Arm Kit
  - Solar-Powered Robot Kit
- **DIY Robotics Projects** — modular project sets
- **Robotics Accessories** — chassis, wheels, gears
- **Robotics Components** — individual robotics parts

#### Arduino (department 02, color: blue)
- Arduino UNO R3 (original + clones)
- Arduino Nano
- Arduino Nano ESP32
- Arduino Mega 2560
- Arduino Pro Mini
- Arduino Leonardo
- Arduino Due
- Arduino Uno WiFi Rev2
- Arduino MKR series (WiFi 1010, GSM 1400, WAN 1300, Zero, Vidor)

#### Raspberry Pi (department 03, color: red)
- Raspberry Pi 5 (4GB / 8GB)
- Raspberry Pi 4 (2GB / 4GB / 8GB)
- Raspberry Pi 3 B+
- Raspberry Pi Zero 2 W
- Raspberry Pi Zero W
- Raspberry Pi Pico
- Raspberry Pi Pico W
- Raspberry Pi Pico 2
- Raspberry Pi Camera Module 3
- Raspberry Pi Official Cases + Power Supplies

#### STM32 (department 04, color: purple)
- STM32 Blue Pill (STM32F103C8T6)
- STM32 Black Pill (STM32F401CCU6, F411CEU6)
- STM32 Nucleo-64 (F401RE, F411RE, F446RE, L476RG)
- STM32 Nucleo-144 (F429ZI, H743ZI)
- STM32 Discovery Kits (F407VG, F746NG)
- ST-Link V2 Programmer

#### Sensors & Shields (department 05, color: green)
- **Displays:** LCD 16×2, LCD 20×4, OLED 0.96", OLED 1.3", TFT 2.4", TFT 3.5", E-Paper
- **Input:** 4×3 Keypad, 4×4 Keypad, Membrane Keypad, Rotary Encoder, Joystick
- **Motion:** Servo (SG90, MG996R), DC Motor (with gearbox), Stepper (28BYJ-48, NEMA 17), L298N Driver, L293D Driver
- **Distance:** HC-SR04 Ultrasonic, JSN-SR04T, Sharp IR
- **Environment:** DHT11, DHT22, BME280, BMP180, MQ series (gas), LDR, Rain Sensor
- **Motion/Presence:** PIR, IR Receiver, IR Remote, IMU (MPU6050, MPU9250)
- **Communication:** HC-05 Bluetooth, HC-06, HM-10 BLE, ESP-01, NRF24L01, LoRa RA-02
- **Identification:** RC522 RFID, PN532 NFC
- **Location:** NEO-6M GPS, NEO-M8N GPS
- **Power/Switching:** Relay modules (1/2/4/8-channel), MOSFET modules
- **Prototyping:** Breadboards (170, 400, 830-tie-point), Jumper wires (M-M, M-F, F-F), PCB boards
- **Shields:** Motor shield, Ethernet shield, WiFi shield, SD Card shield, Sensor shield
- **Storage:** SD Card module, EEPROM modules

#### STEM Toys (department 06, color: pink/mixed)
- Snap Circuits Jr., Snap Circuits Pro, Snap Circuits Green
- micro:bit v2 (with accessories)
- LEGO Education SPIKE Prime kits
- Coding robots (Ozobot, Sphero)
- Age-based learning kits (5-7, 8-10, 11-14)

#### Smart Gadgets (department 07)
- **IoT Devices:** ESP32 dev boards, ESP8266 (NodeMCU, D1 Mini), ESP32-CAM
- **Smart Home Kits:** Smart lighting kit, Smart security kit, Smart plants kit

#### Gaming Gadgets (department 08)
- Retro handheld consoles (Retroid Pocket, ANBERNIC RG series)
- Controllers (8BitDo, Retro-Bit)
- Emulation kits (Raspberry Pi with RetroPie preloaded)

### 6.2 Digital products (department 09, color: yellow)

Downloadable project bundles delivered via signed Supabase Storage URLs.

- **Arduino Mastery Pack** — 20 projects, PKR 2,499
  - Source code (.ino files)
  - Fritzing wiring diagrams
  - 200-page PDF guide (English + Urdu)
  - Video walkthroughs (hosted, streamed)
  - Bonus: Cheat sheet posters

- **Raspberry Pi IoT Projects Pack** — 15 projects, PKR 2,999
  - Python source code
  - Full setup scripts
  - 180-page PDF guide
  - Video walkthroughs
  - Includes home automation, computer vision, weather stations, media servers

- **STM32 Advanced Pack** — 12 projects, PKR 3,999
  - CubeIDE project files
  - Schematic files (Kicad)
  - 240-page PDF guide
  - Video walkthroughs
  - Covers HAL, CubeMX, FreeRTOS, low-power modes

- **Bizmi Mega Bundle** — all three packs, PKR 6,599 (30% off individual total)

- **Individual project downloads** — PKR 299–499 each (future: Phase 2)

Digital products are delivered via:
1. Instant email with signed download link (24h expiry)
2. Always available in `/account/downloads` after purchase
3. Watermarked PDFs (buyer email + order ID stamped) to reduce piracy

### 6.3 Courses (from bizmi.pk taxonomy)
- 3D Modeling
- Beginner Electronics
- Advanced Electronics
- Basic Robotics
- Advanced Robotics
- Game Development
- Python Programming
- STEM Activities
- Visual Coding (Scratch, Blockly)
- Visual Storytelling
- Web Designing

### 6.4 Services (for schools)
- Robotics Curriculum (grade-mapped, editable syllabus)
- Robotics Lab Solutions (turnkey lab setup)
- Science Lab Solutions
- Student Evaluation (progress tracking + certificates)
- Lesson Plans (ready-to-teach modules)
- Teachers Training Programs (certified)

---

## 7. Database Schema (Supabase / Postgres)

### 7.1 Users & profiles

```sql
create table profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  role text check (role in ('customer','student','teacher','school_admin','staff','admin')) default 'customer',
  phone text,
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
```

### 7.2 Product catalog

```sql
create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  name text, name_ur text,
  description text,
  parent_id uuid references categories(id),
  color text,       -- signature color (orange/blue/red/purple/green/yellow)
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
  brand text,                                -- e.g. 'Arduino', 'Raspberry Pi', 'Bizmi'
  product_type text check (product_type in ('physical','digital')),
  price_pkr integer,
  compare_at_price_pkr integer,               -- for discounts / strike-through
  cost_pkr integer,                           -- for margin tracking
  weight_grams int,
  cover_image text,
  gallery text[],
  specs jsonb,                                -- e.g. {microcontroller: 'ATmega328P', voltage: '5V', ...}
  components jsonb,                           -- for kits: [{name, qty, note}]
  age_min int, age_max int,
  grade_tags text[],
  difficulty text check (difficulty in ('beginner','intermediate','advanced')),
  featured boolean default false,
  is_bestseller boolean default false,
  is_new boolean default false,
  inventory_count int default 0,
  low_stock_threshold int default 5,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- For digital products: file storage + delivery
create table digital_files (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  file_name text,
  file_path text,          -- Supabase Storage path
  file_size_bytes bigint,
  file_type text,          -- pdf, zip, mp4, etc.
  is_preview boolean default false,   -- allow preview download before purchase
  order_index int default 0
);

-- For product bundles (e.g. Mega Bundle contains 3 packs)
create table product_bundles (
  bundle_id uuid references products(id) on delete cascade,
  included_product_id uuid references products(id),
  discount_percent int default 0,
  primary key (bundle_id, included_product_id)
);
```

### 7.3 Cart & orders

```sql
create table carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  session_id text,        -- for guest carts
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
  order_number text unique,           -- e.g. BZ-0000123, human-friendly
  user_id uuid references profiles(id),
  guest_email text,
  guest_phone text,
  status text check (status in (
    'pending','phone_confirmed','payment_pending','paid',
    'dispatched','delivered','completed','cancelled','refunded'
  )) default 'pending',
  payment_method text check (payment_method in (
    'cod','bank_transfer','invoice','stripe','telr','jazzcash'
  )),
  payment_reference text,             -- for bank transfer receipts, gateway txn ids
  subtotal_pkr int,
  discount_pkr int default 0,
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
  product_type text,                 -- snapshot: 'physical'|'digital'
  product_name_snapshot text,        -- snapshot for historical accuracy
  quantity int,
  unit_price_pkr int,
  line_total_pkr int
);
```

### 7.4 Digital product delivery

```sql
create table digital_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  product_id uuid references products(id),
  order_id uuid references orders(id),
  granted_at timestamptz default now(),
  download_count int default 0,
  max_downloads int default 100,     -- reasonable cap to prevent abuse
  primary key (user_id, product_id)
);

create table download_log (
  id uuid primary key default gen_random_uuid(),
  grant_id uuid references digital_grants(id),
  file_id uuid references digital_files(id),
  ip_address text,
  user_agent text,
  downloaded_at timestamptz default now()
);
```

### 7.5 Courses

```sql
create table courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text, title_ur text,
  description text, description_ur text,
  category text,           -- basic-robotics, python, etc.
  difficulty text,
  duration_weeks int,
  price_pkr int,
  cover_image text,
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
  duration_minutes int
);

create table course_enrollments (
  user_id uuid references profiles(id),
  course_id uuid references courses(id),
  enrolled_at timestamptz default now(),
  completed_at timestamptz,
  progress_percent int default 0,
  primary key (user_id, course_id)
);
```

### 7.6 Services & school demos

```sql
create table service_inquiries (
  id uuid primary key default gen_random_uuid(),
  service_type text,        -- curriculum, lab-setup, teacher-training, etc.
  school_name text,
  contact_name text,
  contact_email text,
  contact_phone text,
  city text,
  student_count int,
  message text,
  status text default 'new',
  assigned_to uuid references profiles(id),
  created_at timestamptz default now()
);
```

### 7.7 Miscellaneous

```sql
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
```

### 7.8 Row Level Security (RLS)

Enable RLS on every user-data table. Key policies:

```sql
-- Profiles: users can read + update their own; admins read all
alter table profiles enable row level security;
create policy "profiles_self_read" on profiles for select
  using (auth.uid() = id or exists (
    select 1 from profiles where id = auth.uid() and role in ('admin','staff')
  ));
create policy "profiles_self_update" on profiles for update
  using (auth.uid() = id);

-- Orders: users see their own, staff/admin see all
alter table orders enable row level security;
create policy "orders_own_read" on orders for select
  using (user_id = auth.uid() or exists (
    select 1 from profiles where id = auth.uid() and role in ('admin','staff')
  ));

-- Digital grants: users see only their own
alter table digital_grants enable row level security;
create policy "grants_own_read" on digital_grants for select
  using (user_id = auth.uid());

-- Classrooms: teacher owns, students in classroom can see it
alter table classrooms enable row level security;
create policy "classrooms_teacher_all" on classrooms for all
  using (teacher_id = auth.uid());
create policy "classrooms_student_read" on classrooms for select
  using (exists (
    select 1 from classroom_students
    where classroom_id = classrooms.id and student_id = auth.uid()
  ));

-- Products, categories, courses: public read; admin write
alter table products enable row level security;
create policy "products_public_read" on products for select
  using (is_active = true);
```

---

## 8. Feature Details

### 8.1 Home page structure (matches `bizmi-v3.html` mockup)

Sections top-to-bottom:
1. **Top announcement bar** — free shipping / COD / phone number
2. **Sticky glass-blur nav** — logo, Shop / Dev Boards / Digital Projects / Courses / For Schools, search + cart
3. **Hero** — playful headline with wavy underline flourish, robot mascot with floating info cards
4. **School names marquee** — Beaconhouse, LGS, etc. (real customer names once you have them)
5. **Bento categories grid** — 6 department cards, each in its signature color
6. **Development boards section** — 4 featured products, category tabs (All / Arduino / RPi / STM32)
7. **Sensors & shields grid** — 12 color-coded tiles
8. **Digital projects section** — 3 pack cards + mega bundle strip (dark background block)
9. **For Schools** — service cards, big CTA to book demo
10. **Testimonial** — big serif quote with colored highlights
11. **Newsletter CTA** — full orange rounded-top block
12. **Footer** — huge brand type ("Learn. Build. Create. Innovate."), contact, link columns

### 8.2 Product detail page

Layout: 2 columns (60/40) desktop, stacked mobile.

**Left column:**
- Image gallery (thumbnails below, zoom on click)
- Sticky at scroll on desktop

**Right column:**
- Category chip (colored per department)
- Product name (serif)
- Price (mono, large, PKR format with thousands separator)
- Age / grade / difficulty badges
- Short description
- Quantity selector + Add to Cart (large orange button)
- "Add to Wishlist" (heart icon, ghost)
- Free shipping badge, COD available badge
- Delivery estimate (based on city, e.g. "Lahore — 2 days")

**Below the fold:**
- Description tab / Specs tab / What's in the box tab / Reviews tab
- "Frequently bought together" bundle offer
- Related products (same category)
- Recently viewed

**For digital products:** replace "Add to Cart" with "Buy now" or "Get instant access". Show a preview file if available. Below: "What's included" checklist + sample PDF pages screenshot.

### 8.3 Catalog / shop page

- Grid layout: 4 columns desktop, 2 mobile
- Filters sidebar (collapsible on mobile as a Sheet):
  - Category tree
  - Price range slider
  - Brand (Arduino / Raspberry Pi / STM32 / Bizmi / Other)
  - Age range
  - Difficulty
  - In stock only
- Sort: Featured / New / Price low-high / Price high-low / Best selling
- Pagination or infinite scroll (prefer pagination for SEO)
- Empty state uses the robot mascot with "Nothing here yet — check back soon"

### 8.4 Checkout flow

Single-page checkout (Vercel-optimized), or 3 steps: Contact → Shipping → Payment.

**Step 1: Contact**
- Guest or sign in
- Phone (required, PK format +92) + email

**Step 2: Shipping**
- Full name
- Phone
- Province → City → Area (cascading dropdowns from a static list)
- Full address
- Landmark (optional but recommended in PK)
- Delivery notes

**Step 3: Payment**
- Payment method radio: COD / Bank Transfer / Request Invoice (for schools 10+)
- If Bank Transfer: show bank account details + upload receipt (Supabase Storage)
- If Invoice: capture PO number, school name, billing address; sends to sales queue
- Order summary sidebar: items, subtotal, delivery fee (city-based), total

**On submit:**
- Create order (status: `pending`)
- Send SMS confirmation to customer
- Send Slack/email alert to fulfillment team
- Redirect to `/checkout/success?order=BZ-0000123`

**For digital-only orders (no physical items):**
- Skip shipping step
- Show "Delivery via email" note
- On success, immediately grant `digital_grants` rows + send download email

**For mixed orders (physical + digital):**
- Digital grants issued immediately; physical items ship normally
- Success page shows both statuses

### 8.5 Digital delivery mechanics

When a digital product order is `paid` (or `pending` for COD test/free products):
1. Insert row(s) into `digital_grants` (one per digital product in the order)
2. Generate signed URLs from Supabase Storage (24h expiry)
3. Send order email via Resend with download links
4. Log the email send
5. User can always re-download from `/account/downloads` (fresh signed URL each time)

**PDF watermarking:** on first download of a PDF, run a serverless function that:
- Fetches the source PDF
- Stamps buyer email + order number in the footer of every page
- Returns the watermarked file
- Caches per-buyer version in Supabase Storage under `watermarked/{user_id}/{product_id}/{filename}.pdf`

### 8.6 School order flow

Schools ordering 10+ units of anything:
- On product detail, show "Ordering for a school? Request bulk quote" button
- Opens a modal capturing: school name, contact, quantities, delivery date, PO number if available
- Creates a `service_inquiries` row + emails sales team
- Sales team creates a manual `orders` row with `payment_method: 'invoice'`, `is_school_order: true`, `po_number`
- Bizmi generates a PDF invoice (via `@react-pdf/renderer`), sends to school
- School pays via bank transfer + shares receipt, or on delivery
- Digital grants (if any) issued to a school-level account; classroom teachers can access

### 8.7 Classroom flow (teacher features)

- Teacher signs up → role auto-set to `teacher`
- Teacher creates a classroom → gets a 6-character `join_code`
- Teacher shares the code with students (via WhatsApp usually in PK context)
- Students sign up (or use existing account) → enter join code on `/account/join-classroom`
- Teacher dashboard shows: classroom list, student count, aggregate progress
- Teacher can assign courses / project packs to classrooms (Phase 2)
- Bulk order integration: school buys 30 Arduino UNO R3 kits → admin can bulk-assign to 30 students in one flow

### 8.8 Search

- Fuzzy search across products (name, description, SKU, brand, category)
- Use Supabase full-text search + `pg_trgm` for typo tolerance
- Instant search dropdown in nav (SWR-cached)
- Dedicated `/search?q=` page with filters

### 8.9 Internationalization

- Default: English
- Toggle: Urdu (RTL)
- All strings in `/messages/en.json` and `/messages/ur.json`
- Product names and descriptions have `_ur` fields on the table
- On locale switch, `dir="rtl"` attribute + use Tailwind logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`)
- Currency stays PKR; phone number format stays international `+92`
- Address form fields adapt (Province → City → Area order stays the same in both)

---

## 9. Build Phases

### Phase 0 — Setup (2–3 days)
- Initialize Next.js 15 project with TypeScript, Tailwind, shadcn/ui
- Configure fonts (Fraunces, Inter, JetBrains Mono)
- Set up Supabase project, enable auth, configure storage buckets (`products/`, `digital/`, `certificates/`)
- Push initial schema migration
- Set up Vercel deployment + environment variables
- Configure Resend, Sentry, PostHog

### Phase 1 — Marketing site (1 week)
- Home page (full v3 mockup)
- Category landing pages (`/shop/robotics-kits`, `/shop/arduino`, etc.)
- For Schools landing + 5 service subpages
- About, Contact
- Full navigation + footer
- Seed initial content (10 dummy products across categories)
- Deploy publicly

### Phase 2 — Catalog + product detail (1 week)
- Catalog page with filters, sort, pagination
- Product detail page (all tabs, gallery, related products)
- Search functionality
- Wishlist (auth required)
- Load full product catalog (Arduino, RPi, STM32, sensors — around 80 products for launch)

### Phase 3 — Auth + cart + COD checkout (1 week)
- Sign up / sign in / phone verification
- Cart (drawer + full page)
- 3-step checkout with guest option
- COD flow (create order, SMS notification, admin queue)
- Bank Transfer flow (receipt upload)
- Order confirmation email
- Order tracking page (`/account/orders/[id]`)

### Phase 4 — Digital products (4–5 days)
- Digital product detail page + preview file
- Digital-only checkout (skip shipping)
- Digital grants system
- Signed URL download flow
- Email delivery (Resend + React Email template)
- Downloads page in account
- Basic PDF watermarking (server-side function)

### Phase 5 — Admin dashboard (1 week)
- `/admin` role-gated shell
- Order list + detail + status update
- Product CMS (create/edit/publish)
- Digital file uploader
- Customer list
- Basic analytics dashboard (orders per day, revenue, top products)

### Phase 6 — Schools & classrooms (1 week)
- School inquiry form + admin queue
- Manual invoice generation (PDF via `@react-pdf/renderer`)
- Teacher role + classroom creation
- Join code + student enrollment
- Bulk kit assignment to classroom students

### Phase 7 — Localization (3 days)
- Set up `next-intl`
- Translate all UI strings to Urdu
- RTL layout pass
- Language toggle in nav
- Test on real content

### Phase 8 — Courses (optional, 1 week)
- Course catalog + detail pages
- Enrollment + progress tracking
- Simple lesson viewer (markdown + video embed)

### Phase 9 — Polish + launch (1 week)
- Full accessibility audit
- Mobile testing across devices
- Loading states, empty states, error boundaries
- SEO: meta tags, sitemap, robots.txt, structured data
- Performance: image optimization, ISR tuning, Lighthouse ≥90 on all pages
- Real content: 80+ products with real photos, real prices, real descriptions
- Soft launch to 3 pilot schools + WhatsApp broadcast

**Total estimated timeline:** 8–10 weeks with a single full-stack developer, 4–5 weeks with two devs.

---

## 10. Kickoff Prompt for Claude Code / Cursor

Paste this into Claude Code at the start of a new project:

---

> Initialize a Next.js 15 (App Router) TypeScript project called **bizmi-web**. This is the codebase for **Bizmi**, a Pakistani robotics/electronics/STEM e-commerce platform selling physical kits, development boards (Arduino, Raspberry Pi, STM32), sensors, and digital programming project packs — with a school services layer on top.
>
> **Reference the file `BIZMI_BUILD_BRIEF.md` in this repo** (paste this whole document) as the source of truth for design, features, product catalog, and database schema. Don't invent things it doesn't specify — ask if you need clarification.
>
> **Set up the project with:**
> - Next.js 15 App Router + TypeScript strict mode
> - Tailwind CSS + shadcn/ui (initialize with `npx shadcn@latest init`)
> - Framer Motion
> - Supabase JS client (server + browser variants), auth helpers for Next.js
> - Zustand
> - React Hook Form + Zod
> - `next-intl` for en/ur localization
> - Resend + React Email
> - Sentry + PostHog SDKs
> - `@react-pdf/renderer`
>
> **Configure `tailwind.config.ts` with the CSS variables from Section 3.1 of the brief.** Load Fraunces (variable), Inter, and JetBrains Mono via `next/font/google` with CSS variables. Set up a base globals.css with the color tokens.
>
> **Create the folder structure:**
> - `app/(marketing)/` — home, about, contact, schools/*
> - `app/(shop)/shop/*` — catalog + product detail
> - `app/(shop)/digital/*` — digital product catalog + detail
> - `app/(shop)/courses/*`
> - `app/(shop)/cart`, `app/(shop)/checkout/*`
> - `app/(auth)/*` — sign-in, sign-up, verify
> - `app/(account)/account/*` — user dashboard
> - `app/(account)/teacher/*` — teacher dashboard
> - `app/(admin)/admin/*` — admin dashboard
> - `app/api/*` — server actions and webhooks
> - `components/ui/*` — shadcn primitives
> - `components/brand/*` — BrandMark, Mascot
> - `components/features/*` — feature components (ProductCard, DepartmentCard, etc.)
> - `lib/supabase/` — clients + helpers
> - `lib/pdf/` — invoice + watermark generators
> - `lib/email/` — Resend templates
> - `types/` — shared TS types (generated from Supabase)
> - `messages/{en,ur}.json`
> - `supabase/migrations/` — SQL migrations
>
> **Configure middleware for:**
> - Supabase auth session refresh
> - Locale detection (default 'en')
> - Role-based redirect for `/admin/*` and `/teacher/*`
>
> **First deliverable: the home page**, rebuilt component-by-component to match the mockup in `bizmi-v3.html`. Break it into these components:
> 1. `<TopBar />` — announcement bar
> 2. `<Nav />` — sticky glass-blur nav with brand mark
> 3. `<Hero />` — with `<RobotMascot />` and floating info cards
> 4. `<SchoolsMarquee />`
> 5. `<BentoCategories />` — with `<DepartmentCard color={...} />`
> 6. `<FeaturedDevBoards />` — with `<ProductCard />` and tab filter
> 7. `<SensorsGrid />` — 12 color-coded tiles
> 8. `<DigitalProjectsBlock />` — dark rounded-top section with 3 pack cards
> 9. `<ForSchoolsSection />` — service cards grid
> 10. `<Testimonial />`
> 11. `<NewsletterCTA />` — full orange section
> 12. `<Footer />` — with massive brand type
>
> Use placeholder content and TypeScript-typed props so the components are reusable later when we fetch real data from Supabase.
>
> **After the home page ships**, we'll:
> 1. Push the Supabase migration for products/categories
> 2. Build the catalog page with filters
> 3. Build the product detail page
> 4. Build auth + cart + COD checkout
> 5. Add digital products and delivery
> 6. Build admin dashboard
> 7. Add localization
>
> Ask clarifying questions before making architectural decisions you're unsure about. When in doubt, prefer simplicity, RSC over client components, and Supabase's built-in features over custom infrastructure.

---

## 11. Environment Variables

Create `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Site
NEXT_PUBLIC_SITE_URL=https://bizmi.pk
NEXT_PUBLIC_SITE_NAME=Bizmi

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=orders@bizmi.pk

# SMS (choose one)
JAZZ_SMS_API_KEY=
JAZZ_SMS_SENDER_ID=Bizmi
# OR
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Error tracking
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# Admin
ADMIN_EMAIL_ALLOWLIST=jay@bizmi.pk,friend@bizmi.pk
```

---

## 12. Deployment Notes

- **Vercel project:** connect the GitHub repo, set env vars, deploy `main` branch to production, other branches to previews
- **Custom domain:** `bizmi.pk` — A record + CNAME per Vercel instructions (note: bizmi.pk currently hosts a live WordPress site — decide whether this build replaces it in place with URL redirects, or launches at a staging subdomain first)
- **Supabase project:** production tier once traffic warrants; free tier is fine for MVP
- **Storage buckets:** create `products` (public), `digital-source` (private), `digital-watermarked` (private), `certificates` (private)
- **Database backups:** enable daily backups in Supabase
- **Rate limiting:** Vercel Edge middleware for auth endpoints
- **CDN:** Vercel CDN handles most; large digital files served via signed Supabase Storage URLs
- **Email deliverability:** verify domain in Resend, set up SPF/DKIM/DMARC on `bizmi.pk`

---

## 13. Post-Launch Roadmap (Phase 10+)

- Circuit simulator (browser-based) with mission packs — the original v1 vision
- Native payment gateway integration (Stripe / Telr / JazzCash)
- Mobile apps (React Native or Expo)
- Affiliate / referral program
- Blog + SEO content strategy
- Partner marketplace (other Pakistani makers listing their kits)
- Live workshops / virtual classroom
- Certification exams

---

**End of build brief.**

Save this file as `BIZMI_BUILD_BRIEF.md` at the root of your project. Point Claude Code at it whenever architecture decisions come up.

Any decision not explicitly written here is delegated to the developer — but the direction is always: simpler over cleverer, RSC over client, Supabase-native over custom, warm over cold.

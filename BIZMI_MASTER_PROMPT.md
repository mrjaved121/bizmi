# Bizmi — Master Build Prompt (Full Site)

> Single source of truth for building the Bizmi website. Every page, every section, every component. Paste this at the start of a new Next.js project in Claude Code or Cursor.

---

## Part 0 — How to use this document

1. Create a new Next.js 15 project: `npx create-next-app@latest bizmi-web --typescript --tailwind --app --eslint`
2. Save this file at the repo root as `BIZMI_MASTER_PROMPT.md`
3. Open the project in Claude Code
4. Send Claude Code this message: *"Read `BIZMI_MASTER_PROMPT.md` in full and use it as your source of truth. Start with Part 3 (setup), then build pages in the order given in Part 11 (build order). Ask before making any decision the doc doesn't cover."*

---

## Part 1 — Product Context

**Bizmi** is a Pakistani robotics, electronics, and STEM e-commerce platform for schools and curious kids at home. It sells:
- Physical kits (Bizmi branded kits, robotics kits)
- Development boards (Arduino, Raspberry Pi, STM32 — full range)
- Sensors, shields, components
- STEM toys, smart gadgets, gaming gadgets
- Digital programming project packs (downloadable)
- Online courses
- School services (curriculum, lab setup, teacher training)

**Launch market:** Pakistan · PKR only · English + Urdu (RTL)
**HQ:** Faisalabad, Punjab
**Payment:** COD (primary), Bank Transfer, Invoice for schools. Online gateway is Phase 2.
**Fulfillment:** TCS / Leopards / M&P nationwide
**Voice:** playful, curious, warm — never corporate, never childish. Sentence case everywhere. Verbs first.

---

## Part 2 — Brand & Design System

### 2.1 Brand
- **Name:** Bizmi (always lowercase in prose except at start of sentence)
- **Multi-color logo letters:** B-orange, i-blue, z-purple, m-yellow, i-green
- **Tagline:** "Learn · Build · Create · Innovate"
- **Mascot:** friendly robot with screen face, waving hand, red-bulb antenna, orange body

### 2.2 Color tokens (CSS variables in `app/globals.css`)

```css
:root {
  --bg: #FFFBF3;
  --surface: #FFFFFF;
  --surface-2: #FAF6EC;
  --ink: #1A1A2E;
  --ink-2: #4A4A5E;
  --muted: #8B8B9A;
  --line: #EEE8DA;

  --orange: #FF6B35; --orange-soft: #FFE8DE;   /* Robotics · Primary CTA */
  --blue: #3B82F6;   --blue-soft: #DBEAFE;     /* Arduino */
  --red: #E63946;    --red-soft: #FFE1E4;      /* Raspberry Pi */
  --purple: #8B5CF6; --purple-soft: #EDE4FE;   /* STM32 */
  --green: #34D399;  --green-soft: #D6F5E5;    /* Sensors */
  --yellow: #FDB833; --yellow-soft: #FFF3D6;   /* Digital */
  --pink: #EC4899;   --pink-soft: #FCE7F3;     /* Accent */
}
```

Extend `tailwind.config.ts` to expose all tokens as Tailwind colors (`bg-orange`, `text-blue`, `border-purple-soft`, etc.).

### 2.3 Typography

Load via `next/font/google`:
- `font-serif` = **Fraunces** (variable, opsz + wght) — display / headings / editorial
- `font-sans` = **Inter** — body
- `font-mono` = **JetBrains Mono** — prices, SKUs, small labels

Type scale:
- Hero: `text-[clamp(56px,8.5vw,118px)]` line-height 0.96, tracking -0.03em
- Section H2: `text-[clamp(38px,5.5vw,72px)]` line-height 1, tracking -0.02em
- Card title: `text-2xl` to `text-3xl` (font-serif)
- Body: `text-base leading-relaxed`
- Micro: `text-xs font-mono uppercase tracking-wider`

### 2.4 Component patterns

- Chips: rounded-full pills with mono text. Variants: dark, orange, blue, red, purple, green, yellow
- Cards: `rounded-3xl border border-line p-6 bg-white`, hover translate-y-[-4px] + soft shadow
- Bento tiles: `rounded-[32px] p-8`, colored per department
- Buttons: `rounded-full px-6 py-3.5`. Variants: primary (ink bg), orange, outline, ghost
- Arrow bubbles: 44×44 circles that rotate -45deg on parent hover
- Eyebrows: mono + uppercase + orange dot prefix
- Wavy underline flourish: SVG background-image on span, orange stroke
- Section rhythm: `py-24` desktop, `py-16` mobile. Alternate cream/white/dark blocks.
- Rounded-top blocks: `rounded-t-[40px]` for section transitions

Reference the mockup file `bizmi-v3.html` for exact styling patterns.

---

## Part 3 — Setup (Do this first)

### 3.1 Install dependencies

```bash
# Core
npm install @supabase/supabase-js @supabase/ssr
npm install zustand
npm install react-hook-form @hookform/resolvers zod
npm install framer-motion
npm install next-intl
npm install @tanstack/react-query
npm install date-fns

# UI
npx shadcn@latest init
npx shadcn@latest add button input label textarea select checkbox radio-group sheet dialog dropdown-menu popover toast badge card tabs accordion separator skeleton avatar

# Email
npm install resend react-email @react-email/components

# PDFs
npm install @react-pdf/renderer

# Monitoring
npm install @sentry/nextjs posthog-js posthog-node

# Utilities
npm install lucide-react class-variance-authority clsx tailwind-merge
```

### 3.2 Folder structure

```
bizmi-web/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx           # marketing shell (nav + footer)
│   │   ├── page.tsx             # home
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── schools/
│   │   │   ├── page.tsx         # schools landing
│   │   │   ├── curriculum/page.tsx
│   │   │   ├── lab-setup/page.tsx
│   │   │   ├── teacher-training/page.tsx
│   │   │   ├── lesson-plans/page.tsx
│   │   │   ├── evaluation/page.tsx
│   │   │   └── book-demo/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   └── returns/page.tsx
│   ├── (shop)/
│   │   ├── layout.tsx
│   │   ├── shop/
│   │   │   ├── page.tsx         # /shop all products
│   │   │   ├── [category]/
│   │   │   │   ├── page.tsx     # /shop/arduino
│   │   │   │   └── [slug]/page.tsx  # /shop/arduino/uno-r3
│   │   ├── digital/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── courses/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── search/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/
│   │   │   ├── page.tsx
│   │   │   └── success/page.tsx
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── sign-in/page.tsx
│   │   ├── sign-up/page.tsx
│   │   ├── verify/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── callback/route.ts    # auth callback
│   ├── (account)/
│   │   ├── layout.tsx
│   │   ├── account/
│   │   │   ├── page.tsx         # dashboard
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── downloads/page.tsx
│   │   │   ├── certificates/page.tsx
│   │   │   ├── wishlist/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── join-classroom/page.tsx
│   │   ├── teacher/
│   │   │   ├── page.tsx
│   │   │   ├── classrooms/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── assignments/page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx           # role-gated
│   │   ├── admin/
│   │   │   ├── page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   ├── orders/[id]/page.tsx
│   │   │   ├── products/page.tsx
│   │   │   ├── products/new/page.tsx
│   │   │   ├── products/[id]/page.tsx
│   │   │   ├── digital/page.tsx
│   │   │   ├── customers/page.tsx
│   │   │   ├── schools/page.tsx
│   │   │   ├── inquiries/page.tsx
│   │   │   └── analytics/page.tsx
│   ├── api/
│   │   ├── checkout/route.ts
│   │   ├── webhooks/
│   │   │   └── payment/route.ts
│   │   ├── download/[grantId]/[fileId]/route.ts
│   │   └── og/route.tsx          # dynamic OG images
│   ├── layout.tsx                # root layout
│   ├── globals.css
│   ├── not-found.tsx
│   └── error.tsx
├── components/
│   ├── ui/                       # shadcn primitives
│   ├── brand/
│   │   ├── BrandMark.tsx
│   │   └── Mascot.tsx
│   ├── layout/
│   │   ├── TopBar.tsx
│   │   ├── Nav.tsx
│   │   └── Footer.tsx
│   ├── shop/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── PriceFilter.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── AddToCartButton.tsx
│   │   └── QuantityStepper.tsx
│   ├── marketing/
│   │   ├── Hero.tsx
│   │   ├── Eyebrow.tsx
│   │   ├── BentoCategories.tsx
│   │   ├── DepartmentCard.tsx
│   │   ├── SchoolsMarquee.tsx
│   │   ├── FeaturedDevBoards.tsx
│   │   ├── SensorsGrid.tsx
│   │   ├── DigitalProjectsBlock.tsx
│   │   ├── ForSchoolsSection.tsx
│   │   ├── Testimonial.tsx
│   │   └── NewsletterCTA.tsx
│   ├── account/
│   │   ├── AccountNav.tsx
│   │   ├── OrderRow.tsx
│   │   └── DownloadRow.tsx
│   ├── admin/
│   │   ├── AdminNav.tsx
│   │   ├── DataTable.tsx
│   │   └── StatusPill.tsx
│   └── common/
│       ├── Chip.tsx
│       ├── ArrowBubble.tsx
│       ├── Marquee.tsx
│       ├── WavyUnderline.tsx
│       └── LanguageToggle.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # browser
│   │   ├── server.ts             # server (RSC)
│   │   ├── middleware.ts
│   │   └── admin.ts              # service role
│   ├── auth.ts
│   ├── cart.ts                   # Zustand store
│   ├── format.ts                 # PKR formatter, dates
│   ├── shipping.ts               # delivery fee calculator
│   ├── pdf/
│   │   ├── invoice.tsx
│   │   ├── watermark.ts
│   │   └── certificate.tsx
│   ├── email/
│   │   ├── send.ts
│   │   └── templates/
│   │       ├── OrderConfirmation.tsx
│   │       ├── DigitalDelivery.tsx
│   │       ├── ShippingUpdate.tsx
│   │       └── SchoolInquiry.tsx
│   ├── sms/
│   │   └── send.ts
│   └── validators/               # zod schemas
├── types/
│   ├── database.types.ts         # generated from Supabase
│   └── index.ts
├── messages/
│   ├── en.json
│   └── ur.json
├── supabase/
│   └── migrations/
│       └── 20260101000000_init.sql
├── middleware.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── .env.local
```

### 3.3 Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_SITE_URL=https://bizmi.pk
NEXT_PUBLIC_SITE_NAME=Bizmi

RESEND_API_KEY=
RESEND_FROM_EMAIL=orders@bizmi.pk

JAZZ_SMS_API_KEY=
JAZZ_SMS_SENDER_ID=Bizmi

NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=

ADMIN_EMAIL_ALLOWLIST=jay@bizmi.pk,friend@bizmi.pk
```

### 3.4 Middleware

`middleware.ts` handles:
- Supabase auth session refresh
- Locale detection (default `en`, alt `ur`)
- Route protection: `/account/*`, `/teacher/*`, `/admin/*` require auth; `/admin/*` requires role `admin` or `staff`; `/teacher/*` requires role `teacher` or higher

---

## Part 4 — Complete Site Map (52 routes)

**Marketing (11):** `/`, `/about`, `/contact`, `/schools`, `/schools/curriculum`, `/schools/lab-setup`, `/schools/teacher-training`, `/schools/lesson-plans`, `/schools/evaluation`, `/schools/book-demo`, `/privacy`, `/terms`, `/returns`

**Shop (4):** `/shop`, `/shop/[category]`, `/shop/[category]/[slug]`, `/search`

**Digital (2):** `/digital`, `/digital/[slug]`

**Courses (2):** `/courses`, `/courses/[slug]`

**Commerce (3):** `/cart`, `/checkout`, `/checkout/success`

**Auth (4):** `/auth/sign-in`, `/auth/sign-up`, `/auth/verify`, `/auth/forgot-password`

**Account (8):** `/account`, `/account/orders`, `/account/orders/[id]`, `/account/downloads`, `/account/certificates`, `/account/wishlist`, `/account/settings`, `/account/join-classroom`

**Teacher (4):** `/teacher`, `/teacher/classrooms`, `/teacher/classrooms/[id]`, `/teacher/assignments`

**Admin (10):** `/admin`, `/admin/orders`, `/admin/orders/[id]`, `/admin/products`, `/admin/products/new`, `/admin/products/[id]`, `/admin/digital`, `/admin/customers`, `/admin/schools`, `/admin/inquiries`, `/admin/analytics`

**System (3):** `/not-found`, `/error`, `/blog`, `/blog/[slug]` (optional)

---

## Part 5 — Full Page Specifications

Each spec below covers: purpose, layout, sections top-to-bottom, components, data fetching, states (loading/empty/error), and interactions.

---

### 5.1 `/` — Home

**Purpose:** Convert first-time visitors into browsers → shoppers → school inquiries.

**Layout:** Full-width sections stacked vertically. Rendered as RSC where possible.

**Sections (top to bottom):**
1. `<TopBar />` — announcement bar (dark ink bg, mono type, phone number)
2. `<Nav />` — sticky glass-blur nav with multi-color brand mark
3. `<Hero />` — big serif headline "Small hands, big ideas. Start building." + mascot + floating info cards
4. `<SchoolsMarquee />` — infinite scroll of Pakistani school names in mixed serif/sans typography
5. `<BentoCategories />` — 6 department cards in a bento grid (Robotics orange, Arduino blue-soft, RPi red-soft, STM32 purple-soft, Sensors green-soft, Digital yellow full-width)
6. `<FeaturedDevBoards />` — 4 featured products in a grid; category filter tabs (All / Arduino / Pi / STM32)
7. `<SensorsGrid />` — 12 tinted tiles (LCDs, Keypads, Motors, Ultrasonic, DHT, Shields, IR/PIR, RFID, GPS, Bluetooth, Relays, Breadboards)
8. `<DigitalProjectsBlock />` — dark rounded-top section with 3 project pack cards (Arduino blue, RPi red, STM32 purple) + yellow Mega Bundle strip
9. `<ForSchoolsSection />` — big serif headline + service card grid (5 tiles, one is yellow full-width)
10. `<Testimonial />` — massive serif quote with colored italic highlights
11. `<NewsletterCTA />` — full orange rounded-top section with email input
12. `<Footer />` — huge "Learn. Build. Create. Innovate." brand type + link columns

**Data:**
- `SELECT * FROM products WHERE featured = true LIMIT 4` for featured boards
- `SELECT * FROM products WHERE product_type = 'digital' LIMIT 3`
- Static: categories list (from `categories` table, cache 1 hour)

**States:** Loading skeletons per section during initial paint. If featured products query returns empty, show a "New arrivals coming soon" mascot state.

**Interactions:**
- Nav search opens a Sheet with instant search
- Cart icon opens `<CartDrawer />`
- Bento tiles navigate to category pages
- Newsletter form POSTs to `newsletter_subscribers` table

**Reference:** exact HTML mockup in `bizmi-v3.html`.

---

### 5.2 `/about` — About

**Purpose:** Build trust, tell the founder story, show credibility for schools.

**Sections:**
1. Nav
2. Hero: eyebrow "About Bizmi" + serif headline "Curiosity is a Pakistani superpower." + short mission statement paragraph
3. Founder story block: 2-column with photo placeholder + prose (Faisalabad origins, why STEM education, why kits)
4. **Numbers row** (4 metric cards): 40+ schools, 12k+ students, 180+ products, 98% teacher satisfaction
5. Team section: 3-4 team cards (photo, name, role, one-liner) — Jay + friend + advisor + community lead
6. Values section: 3 columns (Curiosity · Hands-on · Access) with icon + description
7. Timeline block: "Our journey" 2022 → 2026 with 5-6 milestones
8. Big CTA: "Ready to bring Bizmi to your school? Book a demo →"
9. Footer

**Data:** Static content managed in markdown files under `content/about.md`. Team photos in `public/team/`.

**States:** N/A (static page).

---

### 5.3 `/contact` — Contact

**Purpose:** Enable direct contact via multiple channels.

**Sections:**
1. Nav
2. Hero: "Get in touch." serif headline + short subhead
3. Two-column block:
   - Left: Contact form (Name, Email, Phone, Subject dropdown [General / Sales / Schools / Support / Partnership], Message)
   - Right: Info cards
     - Address card (Faisalabad HQ)
     - WhatsApp card (green, "Chat on WhatsApp" button opens wa.me link)
     - Phone card (+92 313 897 9696, tap to call)
     - Email card (hello@bizmi.pk)
     - Response time note ("We reply within 24 hours")
4. Map embed (Google Maps iframe of Faisalabad location)
5. FAQ accordion (5 common Qs — shipping, returns, bulk orders, digital delivery, school programs)
6. Footer

**Data:** Contact form submits to `service_inquiries` with `service_type = 'general'`. Send email to sales via Resend.

**States:** Form has loading state on submit, success toast + form reset, error toast on failure.

**Interactions:**
- WhatsApp button opens `https://wa.me/923138979696?text=Hi%20Bizmi`
- Phone tap-to-call on mobile
- Form validates required fields with Zod

---

### 5.4 `/schools` — For Schools Landing

**Purpose:** Convert school admins/principals into demo bookings.

**Sections:**
1. Nav
2. Hero: eyebrow "For Schools" + huge serif headline "A robotics program, delivered end-to-end." + subhead + dual CTA (Book Demo / Download Brochure)
3. Trust numbers row: 40+ schools, 12k+ students taught, 98% satisfaction, 4 provinces
4. Big services grid (5 tiles in bento layout, each linking to service subpage):
   - Curriculum (orange)
   - Lab Setup (blue)
   - Teacher Training (purple)
   - Lesson Plans (green)
   - Student Evaluation (yellow, full-width)
5. **How it works** — 4-step process cards (Contact us → Site visit → Custom plan → Rollout)
6. Testimonial carousel: 3 school testimonials (rotate on interval or arrows)
7. Featured pilot schools grid (6 logos or school-name cards)
8. Pricing tiers: 3 packages (Starter Lab / Full Program / Custom) with feature list
9. **FAQ accordion** (10 Qs): pricing, delivery, curriculum alignment (SNC?), languages, training duration, ongoing support, discontinuation, upgrade paths, teacher certification
10. Big orange CTA section: "Ready to start? Book a 30-min demo →"
11. Footer

**Data:** Fetch testimonials from a `testimonials` table (or hardcoded for MVP).

**Interactions:** All service tiles link to `/schools/[service-slug]`. Demo CTAs link to `/schools/book-demo`.

---

### 5.5 `/schools/curriculum` — Curriculum Service

**Purpose:** Explain the curriculum service in depth.

**Sections:**
1. Nav
2. Breadcrumb: For Schools / Curriculum
3. Hero: service title + one-paragraph explanation + "Book a demo" CTA
4. **What's included** section: 6 feature cards
   - Grade-mapped syllabus (Grades 5–12)
   - Weekly lesson plans
   - Assessment rubrics
   - Digital resources library
   - Teacher notes for every lesson
   - Editable / customizable
5. Curriculum preview: table showing sample grade → topic mapping (Grade 5: Circuits basics, Grade 6: Sensors, etc.)
6. Sample lesson preview (image + description of one week's plan)
7. **Alignment section**: how it maps to Pakistan's SNC + O-levels
8. Pricing note: "Included with our Full Program tier. Also available standalone."
9. Related services (3 cards: Lab Setup, Teacher Training, Lesson Plans)
10. Book-demo CTA
11. Footer

**Data:** Static content.

---

### 5.6 `/schools/lab-setup` — Lab Setup Service

**Sections:** Same shape as `/schools/curriculum`. Content covers:
- What's included: site survey, equipment list, procurement, installation, safety compliance, teacher orientation
- Sample lab layouts (2-3 sketches)
- Equipment inventory example (table)
- Warranty and support terms
- Timeline: "From order to opening in 6–8 weeks"

---

### 5.7 `/schools/teacher-training` — Teacher Training Service

**Sections:** Same shape. Content covers:
- Training modules (4 tracks: Beginner, Intermediate, Advanced, Specialization)
- Duration options (2-day intensive, 8-week program)
- Certification issued on completion
- Ongoing support model
- Trainer credentials
- Sample training day schedule

---

### 5.8 `/schools/lesson-plans` — Lesson Plans Service

**Sections:** Same shape. Content covers:
- 200+ ready-to-teach lessons
- Aligned to curriculum
- Downloadable PDFs + editable DOCX
- Video walkthroughs for teachers
- Sample lesson preview

---

### 5.9 `/schools/evaluation` — Student Evaluation Service

**Sections:** Same shape. Content covers:
- Auto-graded rubrics
- Progress dashboards (per student, per class, per school)
- Printable certificates
- Portfolio building
- Sample report card

---

### 5.10 `/schools/book-demo` — Book a Demo

**Purpose:** Convert schools into scheduled sales calls.

**Sections:**
1. Nav
2. Two-column layout:
   - Left: Headline "See Bizmi in your school." + benefits bullets ("30-min video call", "See sample kits", "Custom pricing", "No commitment")
   - Right: Multi-step form
     - Step 1: School name, city, student count, grade levels (multi-select)
     - Step 2: Contact name, role, phone, email, WhatsApp
     - Step 3: What are you interested in (multi-select checkboxes: Kits, Curriculum, Lab Setup, Teacher Training, etc.), preferred demo date (date picker), timezone (default PKT), notes textarea
     - Submit
3. After submit: success screen with "Thanks — we'll be in touch within 24 hours. Meanwhile, here's a brochure to share with colleagues [Download PDF]."
4. Footer

**Data:** POST to `service_inquiries` with `service_type = 'demo'`. Send email to sales + Slack alert. Send confirmation email to school.

**States:** Multi-step wizard with progress bar. Validate each step before proceeding.

**Interactions:**
- Progress bar shows step 1 of 3, 2 of 3, 3 of 3
- Back / Next buttons
- Auto-save to localStorage in case they navigate away
- Success page auto-fires PostHog conversion event

---

### 5.11 `/shop` — All Products Catalog

**Purpose:** Browse the full product catalog with rich filtering.

**Layout:** Sidebar (left, 260px) + product grid (right).

**Sections:**
1. Nav
2. Breadcrumb: Shop / All products
3. Page header: "All products" + total count (e.g. "Showing 180 of 180")
4. Two-column below the header:
   - **Sidebar filters** (collapsible on mobile, Sheet):
     - Category (accordion tree: Robotics > Kits/DIY/Accessories/Components, Arduino, RPi, STM32, Sensors > sub-tree, etc.)
     - Brand (checkbox list: Arduino, Raspberry Pi, STM32, Bizmi, Other)
     - Price range (dual slider PKR 0 – PKR 50,000+)
     - Age range (dropdown: 6-8, 9-12, 13-16, 17+)
     - Difficulty (chip select: Beginner, Intermediate, Advanced)
     - Availability (toggle: In stock only)
     - Clear all button
   - **Product grid** (4 cols desktop, 2 mobile):
     - Sort bar (top): Featured / Newest / Price low-high / Price high-low / Best selling
     - View toggle (grid / list) — optional
     - Product cards (`<ProductCard />`)
     - Pagination at bottom (24 per page)
5. Empty state: robot mascot + "No products match your filters. Try clearing some."
6. Footer

**Data:**
```sql
SELECT p.*, c.slug as category_slug, c.color as category_color
FROM products p JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true
AND (filters applied)
ORDER BY (sort applied)
LIMIT 24 OFFSET (page * 24)
```
Cache list with React Query. Use search params for filters (`/shop?category=arduino&price_min=1000&sort=price_asc&page=2`).

**States:** Loading skeletons for cards. Empty state with mascot.

**Interactions:**
- Filter changes update URL search params (shareable)
- Add-to-cart button on hover (adds without leaving page, opens toast + updates cart badge)
- Product card click → product detail page

---

### 5.12 `/shop/[category]` — Category Page

**Purpose:** Category-specific catalog page. SEO-optimized.

**Same layout as `/shop`** but:
- Category header shows the category name + description + hero image/pattern in the category's signature color
- Sidebar starts collapsed to the current category (subcategory filter visible)
- SEO: title = "Arduino Development Boards | Bizmi", meta description, structured data
- URL: `/shop/arduino`, `/shop/raspberry-pi`, `/shop/robotics-kits`, etc.
- Static generation via `generateStaticParams()` for known categories
- ISR (revalidate every hour) for inventory freshness

**Data:** Fetch category by slug, then filter products where `category_id = ?`.

---

### 5.13 `/shop/[category]/[slug]` — Product Detail Page

**Purpose:** Convert a browser into a buyer. This is the highest-leverage page.

**Layout:** Two columns (60/40) desktop, stacked mobile.

**Sections:**
1. Nav
2. Breadcrumb: Shop / Category / Product name
3. **Main product block** (2 columns):
   - **Left column (sticky on scroll desktop):**
     - Image gallery: main image (large, 1:1 aspect) + thumbnail strip below (4-6 thumbs)
     - Click main image to open lightbox with zoom
     - Optional: 360° view for kits
   - **Right column (product info):**
     - Category chip (colored per department)
     - Product name (font-serif, text-4xl)
     - Star rating (average) + review count link
     - Price block: current price (mono, text-3xl) + strike-through if on sale + savings badge
     - "In stock" badge (green) or "Only X left" (orange) or "Out of stock" (gray)
     - Short description (2-3 lines)
     - Badges row: Age range, Grade tags, Difficulty (colored chips)
     - Quantity stepper (with min 1, max = inventory_count)
     - **Add to Cart** button (large, orange, full-width)
     - Wishlist button (heart icon, ghost)
     - Delivery estimate: "Deliver to [city] — 2-3 days" (auto-detect city from geo, editable)
     - COD + Free Shipping badges
     - Buy-now button (skips cart, goes to checkout with just this item)
4. **Tabs section** below the fold (or accordion on mobile):
   - Description (long_description, formatted markdown)
   - Specs (table of key/value from `specs` jsonb — voltage, dimensions, weight, etc.)
   - What's in the box (list of components from `components` jsonb)
   - Reviews (list of reviews, form to leave a review if authenticated + purchased)
   - Q&A (community questions — Phase 2)
5. **Frequently bought together** — 3 related products with combined price + savings
6. **Related products** — 4-8 cards from same category
7. **Recently viewed** — client-side, from localStorage
8. Footer

**Data:**
- Fetch product by slug (server-side, RSC)
- Fetch reviews (RSC with revalidation)
- Fetch related products (`WHERE category_id = ? AND id != ? LIMIT 8`)
- Recently viewed: client-side Zustand store from localStorage

**States:**
- Loading: skeleton for gallery + info
- Out of stock: disable Add to Cart, show "Notify me when back in stock" form
- Discontinued: show "This product is no longer available. Try [related]."

**Interactions:**
- Quantity stepper: buttons + input, respects min/max
- Add to Cart: optimistic UI, opens cart drawer, toasts confirmation
- Buy Now: adds to cart + navigates to checkout
- Image gallery: click thumb to swap main, click main to open lightbox
- Wishlist: requires auth, toggle heart icon

**SEO:**
- Structured data: `Product` schema with offers, ratings, availability
- Dynamic OG image with product name + price
- Sitemap includes all product URLs

---

### 5.14 `/digital` — Digital Products Catalog

**Purpose:** Sell downloadable project packs.

**Sections:**
1. Nav
2. Hero: eyebrow "Digital · Instant download" + headline "Programming project packs, in your hands in 60 seconds." + subhead about what they get (source code, PDFs, videos, wiring diagrams)
3. **Category filter chips**: All / Arduino / Raspberry Pi / STM32 / Bundles
4. **Product grid** (3 cols): Digital pack cards. Each shows:
   - Colored top strip in platform color
   - Platform badge chip
   - Pack name (serif)
   - Number of projects
   - Includes list (Source · PDF · Video · Diagrams)
   - Price + Buy button
5. **Mega bundle strip** (yellow highlight): "All packs together — save 30%"
6. **How it works** — 3-step process (Buy → Instant email → Download & build)
7. **What's inside** section with sample screenshots of PDF pages, code repos, video thumbnails
8. **FAQ**: Can I share it? How do I get updates? Format compatibility? Refund policy?
9. CTA: "New packs monthly — subscribe to be notified."
10. Footer

**Data:** `SELECT * FROM products WHERE product_type = 'digital' AND is_active = true`.

---

### 5.15 `/digital/[slug]` — Digital Product Detail

**Purpose:** Convert into digital purchase.

**Sections:**
1. Nav
2. Breadcrumb: Digital / Pack name
3. **Two-column main block**:
   - Left: Product visual (mockup of what they get — stack of files graphic + platform icon)
   - Right:
     - Chip: platform (Arduino / Pi / STM32)
     - Title (serif, text-4xl)
     - Subtitle: "20 projects · 200-page guide · Instant download"
     - Price (mono, text-3xl) + "One-time payment" note
     - **Buy Now** button (colored per platform)
     - "Preview a sample project [free download]"
     - Includes checklist (6-8 items with green ✓)
4. **What you'll build** section: grid of 6-8 project screenshots/cards with names ("Build 1: Blink an LED", "Build 20: Bluetooth-controlled car")
5. **Sample content**: embed 2-3 pages from the PDF as preview images
6. **Video preview**: embed a 60-second sample walkthrough
7. **What you'll learn** — checklist of learning outcomes
8. **Requirements** section — what hardware they need (with links to buy those parts)
9. **Reviews** section
10. **FAQ**: Refund? Updates? Support? Sharing?
11. **Related packs** — same platform or "next step" pack
12. Footer

**Data:** Product record + `digital_files` for the preview file link.

**Interactions:**
- Buy Now → adds to cart → checkout (skips shipping since digital-only)
- Preview download → direct link to preview file (public)
- Video preview embedded from Bunny.net or YouTube

---

### 5.16 `/courses` — Courses Catalog

**Purpose:** Sell online courses.

**Sections:**
1. Nav
2. Hero: eyebrow "04 / Learn online" + serif headline "Courses for every stage."
3. Category chip row (11 course categories from bizmi taxonomy)
4. Featured courses (3 highlighted cards, one dark for contrast)
5. All courses grid (3 cols)
6. Each course card:
   - Category (chip)
   - Course number (mono)
   - Duration (e.g. "8 WEEKS")
   - Title (serif)
   - Instructor name
   - Enrollments count
   - Price
7. FAQ
8. Footer

**Data:** `SELECT * FROM courses WHERE is_published = true`.

---

### 5.17 `/courses/[slug]` — Course Detail

**Purpose:** Convert into course enrollment.

**Sections:**
1. Nav
2. Two-column hero:
   - Left: chip + title + rating + short description + Enroll button + "Preview first lesson"
   - Right: cover image or intro video embed
3. **What you'll learn** — checklist of outcomes
4. **Curriculum** section: accordion of modules → lessons (some marked as free preview)
5. **Instructor** section: photo, bio, credentials
6. **Requirements** — what students need to start
7. **Reviews**
8. **FAQ**
9. Related courses
10. Enroll CTA
11. Footer

**Data:** Course + `course_lessons` + `course_enrollments` (for count).

**Interactions:**
- Enroll → auth gate → add course to `course_enrollments` → redirect to `/account/courses/[slug]` lesson viewer (Phase 8)

---

### 5.18 `/search` — Search Results

**Purpose:** Serve search queries.

**Sections:**
1. Nav
2. Search bar (large, sticky) with current query pre-filled
3. Tab filters: Products / Digital / Courses / Content
4. Results grid (same product card style)
5. "Did you mean X?" suggestions if low results
6. Empty state: "No results for 'X'. Try: [popular searches] or [browse categories]."
7. Footer

**Data:** Full-text search across `products.name`, `products.description`, `products.sku` using Postgres `to_tsvector` + `pg_trgm`. Weight name matches highest.

**Interactions:**
- Typing debounces (300ms) and updates URL search param
- Instant search dropdown in Nav also uses this endpoint

---

### 5.19 `/cart` — Cart Page

**Purpose:** Review items before checkout.

**Layout:** Two columns (60/40).

**Sections:**
1. Nav
2. Page title: "Your cart" + item count
3. **Two columns:**
   - **Left (60%): Cart items list**
     - Each item: thumbnail + name (link to PDP) + variant info + quantity stepper + line total + Remove button + Move to wishlist
     - Empty cart: mascot + "Your cart is empty. Explore kits →"
     - Divider between physical and digital items
     - "You saved PKR X" if any discount codes applied
   - **Right (40%): Order summary card** (sticky):
     - Subtotal
     - Delivery fee (calculated based on primary city; note if some items are digital-only = free)
     - Discount code input + Apply button
     - Total (large, mono)
     - **Proceed to Checkout** button (orange, full-width)
     - "Guest checkout available" note
     - Trust badges row: COD, Free returns, Secure, PKR
4. **You might also like** — 4 related products
5. Footer

**Data:** Cart is a Zustand store persisted to localStorage. Synced to `carts` + `cart_items` when authenticated.

**States:**
- Empty cart with mascot
- Loading during checkout kickoff
- Discount code failure toast

**Interactions:**
- Quantity change → update line total in real time
- Remove → confirmation toast with Undo
- Move to wishlist → requires auth; if guest, prompt sign-in
- Discount code Apply → validates against `discount_codes` table

---

### 5.20 `/checkout` — Checkout

**Purpose:** Convert cart into paid order.

**Layout:** Two columns. Left: form steps. Right: order summary (sticky).

**Steps:**

**Step 0 (Guest vs. Sign In):**
- Shown only if user isn't authenticated
- Buttons: "Continue as guest" · "Sign in" · "Create account"

**Step 1 — Contact:**
- Full name
- Phone (+92 format, mask input)
- Email (optional if COD)
- Checkbox: "Subscribe to Bizmi updates"

**Step 2 — Shipping:**
- Full address form
- Province (dropdown: Punjab, Sindh, KPK, Balochistan, Islamabad, GB, AJK)
- City (dropdown, cascaded from province)
- Area / Sector / Neighborhood (text)
- Full address (textarea)
- Nearest landmark (text, optional but recommended)
- Delivery instructions (textarea, optional)
- Show delivery fee update in summary as city changes
- Skip this step entirely if cart contains only digital products

**Step 3 — Payment:**
- Radio options:
  - **Cash on Delivery** (default; shows "Pay when you receive")
  - **Bank Transfer** (shows bank details + Upload receipt input)
  - **Request Invoice / PO** (only if cart total > PKR 20,000 or user is school_admin; shows PO number field + billing address)
- Terms checkbox: "I agree to the terms of sale and privacy policy"
- **Place Order** button (large, orange)

**Order summary (right column, sticky):**
- Item thumbnails + names + quantities
- Subtotal
- Delivery fee (updates with city)
- Discount (if applied)
- Total (large, mono)
- Trust badges

**On submit:**
- Server action `createOrder`:
  1. Validate cart items still in stock
  2. Create `orders` row (status: pending)
  3. Create `order_items` rows
  4. Decrement `products.inventory_count`
  5. If digital items: create `digital_grants` immediately
  6. Send order confirmation SMS
  7. Send order confirmation email (via Resend)
  8. Slack/email alert to fulfillment team
  9. Clear cart
  10. Redirect to `/checkout/success?order=BZ-0000123`

**States:**
- Loading during submission (disable submit button)
- Inventory conflict error: "Item X went out of stock. Update cart?"
- Validation errors inline per field

**Interactions:**
- Step navigation (back/next) with progress bar
- Autofill from user's saved address if authenticated
- Save draft to localStorage on every step change

---

### 5.21 `/checkout/success` — Order Confirmation

**Purpose:** Confirm and delight after purchase.

**Sections:**
1. Nav
2. **Success block** — centered:
   - Large green checkmark or celebratory mascot
   - "Thanks — order BZ-0000123 is in."
   - Order summary table
3. **What happens next** — 4-step visual timeline:
   - Now: We received your order
   - Soon: We'll call to confirm (COD)
   - 24-48h: Your order ships via TCS
   - 2-3 days: It arrives
4. **Digital items** (if any):
   - "Your downloads are ready" section
   - Big download buttons per digital product
   - "Also sent to your email"
5. **Order tracking** link → `/account/orders/[id]` (guest users get a magic link via email)
6. **Cross-sell**: "You might love these related packs"
7. **Share your build** section: WhatsApp/Instagram invite to tag @bizmi
8. Footer

**Data:** Fetch order by ID + verify user ownership OR by magic-link token for guest.

**Interactions:**
- Download button on digital items triggers server route `/api/download/[grantId]/[fileId]` which:
  - Verifies grant ownership
  - Increments download count
  - Logs to `download_log`
  - Returns signed Supabase Storage URL
  - Watermarks PDFs with buyer email on first download

---

### 5.22 `/auth/sign-in` — Sign In

**Layout:** Centered card on cream background. Two-column on desktop (form left, mascot illustration right).

**Sections:**
1. Small logo top-left
2. Card:
   - "Welcome back."
   - Email input
   - Password input (with show/hide toggle)
   - "Forgot password?" link
   - **Sign In** button (orange, full-width)
   - Divider "or"
   - "Continue with Google" button (Phase 2)
   - "New here? Create account →"
3. Illustration: mascot with a key or waving
4. Small footer with links

**Data:** Supabase Auth `signInWithPassword`.

**States:** Loading spinner in button, error toast on wrong credentials.

---

### 5.23 `/auth/sign-up` — Sign Up

**Sections:**
1. Logo top-left
2. Card:
   - "Join Bizmi."
   - Full name
   - Phone (+92 format)
   - Email
   - Password + strength meter
   - Confirm password
   - Role radio: "I'm a parent/student · I'm a teacher · I'm a school admin"
   - Terms checkbox
   - **Create Account** button
   - "Already have an account? Sign in →"
3. Right: mascot with sparkles
4. Small footer

**On submit:**
- Supabase Auth `signUp` with metadata (full_name, phone, role)
- Insert `profiles` row via trigger
- Send OTP to phone via Jazz SMS
- Redirect to `/auth/verify`

---

### 5.24 `/auth/verify` — Phone/Email Verification

**Sections:**
1. Logo
2. Card:
   - "Enter the code."
   - "We sent a 6-digit code to +92 313 xxx 96"
   - 6-digit OTP input (native or `<InputOTP>`)
   - Resend link (with 60-second cooldown)
   - "Wrong number? Change it →"
3. Mascot on right

**On success:** update `profiles.phone_verified = true`, redirect to `/account`.

---

### 5.25 `/auth/forgot-password` — Reset Password

**Sections:**
1. Logo
2. Card:
   - "Reset your password."
   - Email input
   - **Send Reset Link** button
   - "Back to sign in"
3. Success state: "Check your email at x@y.com for the link"

Uses Supabase `resetPasswordForEmail`.

---

### 5.26 `/account` — Account Dashboard

**Purpose:** Landing after sign-in. Show at-a-glance info.

**Layout:** Sidebar (left, 260px, `<AccountNav />`) + main content.

**Sidebar links:**
- Dashboard (this page)
- Orders
- Downloads
- Certificates
- Wishlist
- Progress
- Classrooms (if teacher/student)
- Settings
- Sign out

**Main content:**
1. Welcome header: "Hi, [First name]." + short line about their journey
2. **Metric cards row** (4): Total orders, Active downloads, Certificates earned, Wishlist items
3. **Recent orders** — table of last 5 orders (link to Orders page)
4. **Available downloads** — 3 most recent digital purchases with download buttons
5. **Recommended for you** — 4 product cards based on purchase history
6. **Continue learning** — course cards in progress (Phase 8)

**Data:**
- User profile
- `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 5`
- Aggregate counts
- Recommendations via simple category-based logic

---

### 5.27 `/account/orders` — Orders List

**Sections:**
1. Sidebar
2. Page title: "Your orders"
3. Filter bar: All / Active / Delivered / Cancelled
4. Orders table (or cards on mobile):
   - Order number (link)
   - Date
   - Item count + primary item thumbnail
   - Status pill (color-coded)
   - Total
   - "View details" button
5. Pagination or infinite scroll
6. Empty state: "No orders yet. Start shopping →"

**Data:** `SELECT * FROM orders WHERE user_id = ?`.

---

### 5.28 `/account/orders/[id]` — Order Detail

**Sections:**
1. Sidebar
2. Breadcrumb: Orders / BZ-0000123
3. **Order header**: number + date + status pill
4. **Progress tracker** — visual timeline: Pending → Confirmed → Dispatched → Delivered (highlight current step)
5. **Items table**: thumbnails, names, quantities, prices, line totals
6. **Delivery card**: shipping address + courier + tracking number (link to courier site)
7. **Payment card**: method (COD/Bank Transfer), reference, total
8. **Actions**:
   - Download invoice (PDF)
   - Cancel order (only if status = pending)
   - Reorder (adds items back to cart)
   - Report an issue
9. **Digital items section** (if any): download buttons per digital file
10. Support contact

---

### 5.29 `/account/downloads` — Downloads

**Sections:**
1. Sidebar
2. Page title: "Your downloads"
3. **Filter tabs**: All / Arduino / Raspberry Pi / STM32 / Other
4. **Downloads grid** — cards showing:
   - Digital product name + platform chip
   - Purchase date
   - Files count
   - Downloads used / max
   - **Download** button (opens list of files)
5. Empty state: "No downloads yet. Explore project packs →"

**Data:** `SELECT dg.*, p.* FROM digital_grants dg JOIN products p ON dg.product_id = p.id WHERE user_id = ?`.

**Interactions:** Click Download → dropdown or modal with individual file downloads.

---

### 5.30 `/account/certificates` — Certificates

**Sections:**
1. Sidebar
2. Page title: "Your certificates"
3. Certificate cards grid: preview image + course name + date issued + Download PDF + Share on LinkedIn
4. Empty state: "Complete a course to earn your first certificate →"

---

### 5.31 `/account/wishlist` — Wishlist

**Sections:**
1. Sidebar
2. Page title: "Your wishlist" + count
3. Product grid (same style as shop)
4. Each card has: Add to Cart button + Remove from Wishlist button
5. Empty state

---

### 5.32 `/account/settings` — Settings

**Sections:**
1. Sidebar
2. Tabs: Profile / Address / Password / Notifications / Language
3. **Profile tab**: Full name, phone (change requires re-verify), email, avatar upload
4. **Address tab**: Default shipping address, alternate addresses
5. **Password tab**: Current + new + confirm
6. **Notifications tab**: Toggles for order updates (email/SMS/WhatsApp), marketing emails, product recommendations
7. **Language tab**: English / Urdu toggle

Save button per tab.

---

### 5.33 `/account/join-classroom` — Join Classroom

**Sections:**
1. Sidebar
2. Card:
   - "Join a classroom."
   - Explanation: "Enter the 6-character code your teacher shared."
   - 6-character code input
   - **Join** button
3. On success: redirect to classroom view or account with success toast

---

### 5.34 `/teacher` — Teacher Dashboard

**Layout:** Same sidebar pattern as `/account`, but with teacher-specific items.

**Sidebar:**
- Dashboard
- Classrooms
- Assignments
- Students
- Resources (curriculum materials)
- Reports
- Settings

**Main content:**
1. Welcome
2. **Metric cards**: Active classrooms, Total students, Assignments graded, Average score
3. **My classrooms** — cards for each classroom (name + student count + Recent activity)
4. **Recent submissions** — list of last 10 student submissions to grade
5. **Upcoming assignments** — list

---

### 5.35 `/teacher/classrooms` — Classrooms List

**Sections:**
1. Sidebar
2. Page title: "Your classrooms" + **Create classroom** button
3. Classroom cards grid:
   - Classroom name
   - Grade level
   - Student count
   - Join code (with copy button)
   - Recent activity summary
   - **View** button
4. Empty state: "Create your first classroom to get started"

**Create classroom modal:** Name + Grade Level + Optional school (from teacher's affiliation).

---

### 5.36 `/teacher/classrooms/[id]` — Classroom Detail

**Sections:**
1. Sidebar
2. Breadcrumb: Classrooms / [name]
3. Header: name + grade + join code (copy) + Edit + Delete
4. **Metric row**: Students, Assignments, Avg progress, Avg score
5. Tabs: Students / Assignments / Progress / Materials
6. **Students tab**: table with name, joined date, progress, last active, actions
7. **Assignments tab**: list of assignments (add new, view submissions)
8. **Progress tab**: aggregate charts + individual student progress
9. **Materials tab**: shared kits, courses, digital packs

---

### 5.37 `/teacher/assignments` — Assignments

Shows all assignments across all classrooms. Filter by classroom, status (draft/active/closed), and due date.

---

### 5.38 `/admin` — Admin Dashboard

**Layout:** Sidebar + main. Auth-gated with role check.

**Sidebar:**
- Overview
- Orders
- Products
- Digital files
- Customers
- Schools
- Inquiries
- Analytics
- Settings

**Main:**
1. Header: "Admin — Bizmi"
2. **Metric cards row** (6): Today's orders, Today's revenue, Pending orders, Low-stock items, New customers, Active school leads
3. **Chart**: Revenue over last 30 days (line chart)
4. **Recent orders** — table of last 10 orders with quick action buttons (Confirm / Dispatch / Details)
5. **Pending actions** panel:
   - X orders need phone confirmation
   - Y bank transfer receipts to verify
   - Z inventory alerts (below threshold)
   - W school inquiries awaiting response
6. **Top products this week** — bar list

---

### 5.39 `/admin/orders` — Orders Management

**Sections:**
1. Sidebar
2. Page header + Export CSV button
3. **Filter bar**:
   - Status (multi-select)
   - Date range picker
   - Payment method
   - City
   - Search by order # or customer name/phone
4. **Orders table**:
   - Checkbox (bulk actions)
   - Order # (link)
   - Customer name + phone
   - Items count + primary item thumbnail
   - City
   - Total
   - Payment method
   - Status pill
   - Created at
   - Actions dropdown (View / Confirm / Dispatch / Mark delivered / Cancel / Print label)
5. Bulk actions bar: Dispatch selected / Print labels / Export
6. Pagination

**Data:** Full orders with joined customer info. Server-side filtering via search params.

---

### 5.40 `/admin/orders/[id]` — Order Detail (Admin View)

**Sections:**
1. Sidebar
2. Breadcrumb
3. **Order header**: number + created + status pill + Actions dropdown
4. **Status timeline** — visual with buttons to advance status
5. **Customer card**: name, phone (click to WhatsApp), email, view profile
6. **Shipping card**: address, courier assignment dropdown, tracking number input, print label button
7. **Items list** (with cost + margin for admin)
8. **Payment card**: method, receipt (if bank transfer, viewable), verification status
9. **Internal notes** section (only visible to staff)
10. **Activity log**: automated timeline of all status changes with actor and timestamp

---

### 5.41 `/admin/products` — Products CMS

**Sections:**
1. Sidebar
2. Header: "Products" + **New product** button + Import CSV button
3. Filter bar: category, brand, active/inactive, low stock, search
4. Products table:
   - Thumbnail
   - Name
   - SKU
   - Category
   - Price
   - Inventory
   - Status pill (Active / Draft / Archived)
   - Actions (Edit / Duplicate / Archive)
5. Bulk actions: publish, archive, adjust inventory
6. Pagination

---

### 5.42 `/admin/products/new` and `/admin/products/[id]` — Product Editor

**Layout:** Multi-section form.

**Sections (as tabs or long form):**
1. **Basics**: name (EN + UR), slug (auto), SKU, brand, category, product_type (physical/digital)
2. **Pricing**: price, compare_at_price, cost
3. **Description**: short (EN + UR), long (EN + UR, markdown editor)
4. **Media**: cover image upload + gallery (multiple), drag-to-reorder
5. **Inventory**: stock count, low-stock threshold, weight (for shipping calc)
6. **Specs**: key-value JSON editor (microcontroller, voltage, dimensions, etc.)
7. **Components** (for kits): list of {name, qty, note}
8. **Targeting**: age min/max, grade tags, difficulty
9. **Flags**: is_active, is_featured, is_bestseller, is_new
10. **Digital files** (if type = digital): file uploader + preview toggle per file
11. **SEO**: meta title, meta description, OG image
12. Save / Save & Publish / Save Draft / Delete

---

### 5.43 `/admin/digital` — Digital Files Library

**Sections:**
1. Sidebar
2. Header + Upload button
3. Files table:
   - Thumbnail (PDF preview or file icon)
   - Filename
   - Product it belongs to
   - Size
   - Type
   - Total downloads (count from `download_log`)
   - Upload date
   - Actions (Replace / Delete)
4. Upload modal: drag-drop + select product to attach

---

### 5.44 `/admin/customers` — Customers

**Sections:**
1. Sidebar
2. Header + search bar
3. Customers table:
   - Avatar + name
   - Email
   - Phone
   - Role
   - Total orders
   - Total spent (PKR)
   - Last order date
   - Joined
   - Actions (View / Message / Ban)
4. Click name → customer detail page with full order history + notes

---

### 5.45 `/admin/schools` — Schools

**Sections:**
1. Sidebar
2. Header: "Schools" + **New school** button + toggle "Show unverified"
3. Schools table:
   - Name
   - City
   - Contact person
   - Contact phone
   - Total orders
   - Total spent
   - Verified badge
   - Actions
4. Click name → school detail page with contact info, related orders, members (teachers/admins), classrooms

---

### 5.46 `/admin/inquiries` — Service Inquiries

**Sections:**
1. Sidebar
2. Filter bar: type (demo/curriculum/lab-setup/general), status (new/contacted/converted/lost), assigned to
3. Inquiries table:
   - Received at
   - School / contact name
   - Service type
   - Status pill
   - Assigned to
   - Actions (Mark contacted / Convert to lead / Assign)
4. Click row → inquiry detail with all fields + notes + conversion button

---

### 5.47 `/admin/analytics` — Analytics

**Sections:**
1. Sidebar
2. Date range picker
3. **KPI cards**: Revenue, Orders, AOV, Conversion rate, New customers, Repeat customers
4. **Revenue chart** — daily line
5. **Top products** — bar chart
6. **Top categories** — pie
7. **Traffic sources** — bar (integrate PostHog)
8. **Cart abandonment funnel** — funnel viz
9. **Digital vs physical** split
10. Export report button

---

### 5.48 `/blog` — Blog Index (Optional, Phase 2)

**Sections:**
1. Nav
2. Hero: "The Bizmi journal — stories from the workshop."
3. Featured post (large card)
4. Post grid (3 cols) with category filter
5. Newsletter CTA
6. Footer

Content stored in markdown files under `content/blog/` OR in a `posts` table.

---

### 5.49 `/blog/[slug]` — Blog Post

**Sections:**
1. Nav
2. Header: category, title, author, date, read time
3. Cover image
4. Article body (markdown-rendered, prose styles)
5. Author card at end
6. Related posts (3)
7. Newsletter CTA
8. Footer

---

### 5.50 `/privacy`, `/terms`, `/returns` — Legal Pages

Simple markdown-driven pages using `content/legal/*.md`. Standard layout: nav + article + footer.

---

### 5.51 `/not-found` — 404

**Purpose:** Keep a lost visitor on-site instead of bouncing.

**Sections:**
1. Nav
2. Centered block: mascot in a "confused" pose (tilted head, question-mark speech bubble), serif headline "This page took a wrong turn.", short line ("The link might be broken, or the page moved.")
3. Search bar (same instant-search as Nav)
4. Quick links row: Shop · Digital projects · For schools · Home
5. Footer

**Data:** None — static. **Note:** implemented as `app/not-found.tsx` per Next.js convention; it's rendered for any unmatched route, so keep it dependency-light (no data fetching that could itself fail).

---

### 5.52 `/error` — 500 / Runtime Error Boundary

**Purpose:** Fail gracefully; never show a raw stack trace to a visitor.

**Sections:**
1. Minimal header (logo only, no full Nav — the error may have originated in Nav's own data fetching)
2. Centered block: mascot in a "broken" pose, headline "Something broke on our end.", short reassuring line ("It's been logged — try again in a moment.")
3. **Try again** button (calls the `reset()` function Next.js passes to `error.tsx`)
4. **Back to home** link
5. Contact support line (WhatsApp + email)

**Data:** None. **Note:** implemented as `app/error.tsx` (must be a Client Component per Next.js convention). Automatically reports to Sentry via the `@sentry/nextjs` instrumentation — don't hand-roll a second report call here, just let the SDK's automatic error boundary capture handle it.

---

## Part 6 — Component Library

Every reusable component, grouped by folder (see Part 3.2), with its prop API. Build these as typed, presentational components wherever possible — pass data in via props from RSC parents rather than fetching inside client components.

### 6.1 `components/brand/`

```ts
// BrandMark.tsx
type BrandMarkProps = { size?: "sm" | "md" | "lg"; className?: string };
// Renders "Bizmi" with the multi-color letter mapping (B-orange, i-blue, z-purple, m-yellow, i-green).

// Mascot.tsx
type MascotProps = {
  pose: "waving" | "thinking" | "building" | "confused" | "broken" | "celebrating";
  className?: string;
};
// SVG robot mascot. Add "confused" (404) and "broken" (500) and "celebrating" (checkout success)
// poses on top of the three already built (waving/thinking/building).
```

### 6.2 `components/layout/`

```ts
// TopBar.tsx — no props; reads static announcement copy (or a future `announcements` table)

// Nav.tsx — no props; client component (mobile Sheet + instant search state).
// Renders <CartDrawer /> trigger and search Sheet.

// Footer.tsx — no props; static link columns from a config object + the giant tagline type.
```

### 6.3 `components/shop/`

```ts
// ProductCard.tsx
type ProductCardProps = { product: ProductCardData; className?: string };
// ProductCardData: { slug, name, category, categoryHref, color, brand?, pricePkr,
//   compareAtPricePkr?, difficulty?, ageMin?, ageMax?, isBestseller?, isNew?, inventoryCount? }

// ProductGrid.tsx
type ProductGridProps = { products: ProductCardData[]; emptyState?: React.ReactNode };

// CategoryFilter.tsx
type CategoryFilterProps = {
  categories: { slug: string; name: string; children?: {slug:string;name:string}[] }[];
  selected: string[];
  onChange: (slugs: string[]) => void;
};

// PriceFilter.tsx
type PriceFilterProps = { min: number; max: number; value: [number, number]; onChange: (v:[number,number]) => void };

// CartDrawer.tsx — no props; reads the `useCart()` Zustand store directly.

// AddToCartButton.tsx
type AddToCartButtonProps = { product: ProductCardData; quantity?: number; variant?: "default" | "icon" };

// QuantityStepper.tsx
type QuantityStepperProps = { value: number; min?: number; max?: number; onChange: (v: number) => void };
```

### 6.4 `components/marketing/`

These are the home-page sections already built this session (currently under `components/features/home/` — see the note at the end of this Part about reconciling the two folder layouts).

```ts
// Hero.tsx — no props; static marketing copy + <Mascot pose="waving" />

// Eyebrow.tsx
type EyebrowProps = { children: React.ReactNode; className?: string };

// BentoCategories.tsx — no props; reads department list (static config or `categories` table)

// DepartmentCard.tsx
type DepartmentCardProps = {
  href: string; color: DepartmentColor; title: string; subtitle: string;
  count?: number; className?: string;
};

// SchoolsMarquee.tsx
type SchoolsMarqueeProps = { schoolNames?: string[] }; // falls back to a static list

// FeaturedDevBoards.tsx
type FeaturedDevBoardsProps = { products: ProductCardData[] }; // client component for the tab filter

// SensorsGrid.tsx
type SensorsGridProps = { tiles?: { label: string; color: DepartmentColor; href?: string }[] };

// DigitalProjectsBlock.tsx
type DigitalProjectsBlockProps = { packs: DigitalPackSummary[]; bundle: DigitalPackSummary };

// ForSchoolsSection.tsx
type ForSchoolsSectionProps = { services: { href: string; title: string; description: string; color: DepartmentColor }[] };

// Testimonial.tsx
type TestimonialProps = { quote: React.ReactNode; attribution: string };

// NewsletterCTA.tsx — no props; client component owning its own form state + Zod validation.
```

### 6.5 `components/account/`

```ts
// AccountNav.tsx
type AccountNavProps = { role: "customer" | "student" | "teacher" | "school_admin" | "staff" | "admin" };
// Renders the sidebar link set appropriate to role (adds Classrooms for teacher/student).

// OrderRow.tsx
type OrderRowProps = { order: { id: string; orderNumber: string; createdAt: string; itemCount: number; status: OrderStatus; totalPkr: number } };

// DownloadRow.tsx
type DownloadRowProps = { grant: { productName: string; platform: string; purchasedAt: string; filesCount: number; downloadCount: number; maxDownloads: number } };
```

### 6.6 `components/admin/`

```ts
// AdminNav.tsx — no props; static sidebar for the role-gated /admin shell.

// DataTable.tsx
type DataTableProps<T> = {
  columns: { key: keyof T; label: string; render?: (row: T) => React.ReactNode }[];
  rows: T[];
  selectable?: boolean;
  onSelectionChange?: (ids: string[]) => void;
  pagination?: { page: number; pageSize: number; total: number; onPageChange: (p: number) => void };
};
// Generic table used across /admin/orders, /admin/products, /admin/customers, /admin/schools, /admin/inquiries.

// StatusPill.tsx
type StatusPillProps = { status: OrderStatus | InquiryStatus | "active" | "draft" | "archived" };
// Color-coded pill: pending=yellow, confirmed/paid=blue, dispatched=purple, delivered=green,
// cancelled/refunded=red, draft=gray.
```

### 6.7 `components/common/`

```ts
// Chip.tsx
type ChipProps = { variant?: "default"|"dark"|"orange"|"blue"|"red"|"purple"|"green"|"yellow"|"pink"; children: React.ReactNode };

// ArrowBubble.tsx
type ArrowBubbleProps = { className?: string }; // 44x44 circle, rotates -45deg on parent .group hover

// Marquee.tsx
type MarqueeProps = { items: string[]; className?: string };

// WavyUnderline.tsx
type WavyUnderlineProps = { children: React.ReactNode; color?: string }; // wraps a <span>, SVG background-image flourish

// LanguageToggle.tsx — no props; reads/writes the `next-intl` locale cookie, toggles dir="rtl".
```

> **Reconciliation note:** this session's build so far put the home-page sections under `components/features/home/` and shared primitives under `components/features/` (e.g. `Chip.tsx`, `Eyebrow.tsx`, `ArrowBubble.tsx`, `DepartmentCard.tsx`, `ProductCard.tsx`, `Marquee.tsx`) rather than this Part's `components/marketing/`, `components/shop/`, and `components/common/` split. Functionally equivalent, just different folder names. Pick one before Phase 2 — the folder rename itself is a 20-minute mechanical change, not worth doing twice.

---

## Part 7 — Database Schema (Postgres / Supabase)

This is the same schema already implemented in `BIZMI_BUILD_BRIEF.md` §7, reproduced here as the canonical reference, plus two tables this master prompt's page specs imply that weren't in the shorter brief: `testimonials` (used by 5.4 For Schools and 5.10 home) and `posts` (used by the optional 5.48/5.49 blog).

### 7.1 Users & profiles

```sql
create table profiles (
  id uuid primary key references auth.users(id),
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
```

### 7.2 Product catalog

```sql
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
```

### 7.3 Cart & orders

```sql
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
  guest_access_token uuid default gen_random_uuid(),  -- for magic-link order tracking
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
  internal_notes text,               -- staff-only, never exposed to the customer view
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
  unit_cost_pkr int,                 -- snapshot for admin margin reporting
  line_total_pkr int
);

create table order_status_log (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  from_status text,
  to_status text,
  actor_id uuid references profiles(id),  -- null if system-triggered
  note text,
  created_at timestamptz default now()
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
  max_downloads int default 100,
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
```

### 7.6 Services, school demos & testimonials

```sql
create table service_inquiries (
  id uuid primary key default gen_random_uuid(),
  service_type text,        -- 'demo' | 'curriculum' | 'lab-setup' | 'teacher-training' | 'general' | ...
  school_name text,
  contact_name text,
  contact_role text,
  contact_email text,
  contact_phone text,
  city text,
  student_count int,
  grade_levels text[],
  interests text[],         -- e.g. ['kits','curriculum','lab-setup']
  preferred_demo_at timestamptz,
  message text,
  status text default 'new', -- 'new' | 'contacted' | 'converted' | 'lost'
  assigned_to uuid references profiles(id),
  created_at timestamptz default now()
);

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  attribution text not null,   -- e.g. "Head of STEM, Beaconhouse Faisalabad"
  school_id uuid references schools(id),
  context text check (context in ('home','schools','course')) default 'home',
  is_published boolean default true,
  order_index int default 0,
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

-- Optional blog (Phase 2 / 5.48-5.49)
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
```

### 7.8 Row Level Security (RLS)

Enable RLS on every user-data table. Key policies (extend this list per-table as new tables are added — never ship a table without RLS):

```sql
alter table profiles enable row level security;
create policy "profiles_self_read" on profiles for select
  using (auth.uid() = id or exists (
    select 1 from profiles where id = auth.uid() and role in ('admin','staff')
  ));
create policy "profiles_self_update" on profiles for update
  using (auth.uid() = id);

alter table orders enable row level security;
create policy "orders_own_read" on orders for select
  using (user_id = auth.uid() or exists (
    select 1 from profiles where id = auth.uid() and role in ('admin','staff')
  ));

alter table digital_grants enable row level security;
create policy "grants_own_read" on digital_grants for select
  using (user_id = auth.uid());

alter table classrooms enable row level security;
create policy "classrooms_teacher_all" on classrooms for all
  using (teacher_id = auth.uid());
create policy "classrooms_student_read" on classrooms for select
  using (exists (
    select 1 from classroom_students
    where classroom_id = classrooms.id and student_id = auth.uid()
  ));

alter table products enable row level security;
create policy "products_public_read" on products for select
  using (is_active = true);

alter table wishlists enable row level security;
create policy "wishlists_own_all" on wishlists for all
  using (user_id = auth.uid());

alter table service_inquiries enable row level security;
create policy "inquiries_staff_read" on service_inquiries for select
  using (exists (select 1 from profiles where id = auth.uid() and role in ('admin','staff')));
-- inserts happen via a server action using the service-role client, so no public insert policy needed.
```

Generate TypeScript types after every migration: `npx supabase gen types typescript --project-id <ref> > types/database.types.ts`.

---

## Part 8 — API Routes & Server Actions

Prefer Server Actions over Route Handlers wherever the caller is a form inside this app — simpler, no separate fetch/serialization layer, and matches "RSC over client, simplicity over cleverness." Reserve Route Handlers for things that must be a URL: webhooks, file downloads, dynamically-generated images, and the search endpoint (used by both the `/search` page and the Nav's instant-search dropdown).

### 8.1 Route Handlers (`app/api/*`)

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/search` | GET `?q=` | public | Full-text product/digital/course search, used by `/search` and Nav instant search. Debounced client-side. |
| `/api/download/[grantId]/[fileId]` | GET | session or guest order token | Verifies the grant belongs to the caller, increments `download_count`, logs to `download_log`, watermarks PDFs on first download, returns a short-lived signed Supabase Storage URL (redirect or JSON `{url}`). |
| `/api/og` | GET `?title=&price=` | public | Dynamic OG image via `next/og` — used for product/digital/course share cards. |
| `/api/webhooks/payment` | POST | signature-verified | Stub for Phase 2 (Stripe/Telr/JazzCash). Not needed for MVP since payment is COD/bank-transfer/invoice. |
| `/auth/callback` | GET | — | Supabase Auth callback (email link / OAuth Phase 2). |

### 8.2 Server Actions (`lib/actions/*`, colocated `"use server"` functions)

| Action | Called from | Does |
|---|---|---|
| `createOrder(input)` | `/checkout` | Validates stock → creates `orders` + `order_items` → decrements inventory → creates `digital_grants` for any digital items → sends confirmation SMS + email → clears cart → returns `orderNumber`. |
| `applyDiscountCode(code, cartTotal)` | `/cart`, `/checkout` | Validates against `discount_codes` (active, date range, min order, use count) → returns computed discount. |
| `submitContactForm(data)` | `/contact` | Inserts `service_inquiries` (`service_type='general'`) → emails sales. |
| `submitServiceInquiry(data)` | `/schools/book-demo`, service subpages | Inserts `service_inquiries` (`service_type='demo'` or specific) → emails sales + Slack → emails confirmation to school. |
| `subscribeNewsletter(email)` | `NewsletterCTA` | Upserts `newsletter_subscribers`. |
| `toggleWishlist(productId)` | `ProductCard`, PDP | Auth-gated; inserts/deletes `wishlists` row. |
| `submitProductReview(productId, rating, title, body)` | PDP reviews tab | Auth-gated, requires verified purchase; inserts `product_reviews`. |
| `createClassroom(name, gradeLevel)` | `/teacher/classrooms` | Auth-gated (role=teacher); generates unique 6-char `join_code`. |
| `joinClassroom(code)` | `/account/join-classroom` | Auth-gated; inserts `classroom_students` if code valid. |
| `updateOrderStatus(orderId, status, note?)` | `/admin/orders/[id]` | Role-gated (admin/staff); updates `orders.status` + inserts `order_status_log`; triggers shipping-update email on `dispatched`/`delivered`. |
| `createOrUpdateProduct(input)` | `/admin/products/[id]`, `/new` | Role-gated; upserts `products` (+ `digital_files` for digital type). |
| `assignOrderCourier(orderId, courier, trackingNumber)` | `/admin/orders/[id]` | Role-gated; updates order + fires shipping-update email/SMS. |
| `verifyBankTransferReceipt(orderId, approve)` | `/admin/orders/[id]` | Role-gated; advances order to `paid` or flags for follow-up. |

**Note on the cart itself:** the cart is a client-side Zustand store (`lib/cart.ts`), not a server action — it persists to `localStorage` for guests and syncs to `carts`/`cart_items` only at checkout (or on sign-in, to merge a guest cart into the account). Don't round-trip every add-to-cart click through the server; that's the kind of unnecessary complexity the brief's guidance ("simpler over cleverer") warns against.

---

## Part 9 — Localization (`next-intl`)

Default locale `en`, alternate `ur` (RTL). Locale is detected via `middleware.ts` (cookie override > `Accept-Language` > default `en`) and toggled via `<LanguageToggle />`.

### 9.1 Message file shape (`messages/en.json`, mirrored in `messages/ur.json`)

```json
{
  "nav": {
    "shop": "Shop",
    "devBoards": "Dev boards",
    "digitalProjects": "Digital projects",
    "courses": "Courses",
    "forSchools": "For schools",
    "bookDemo": "Book a demo",
    "cart": "Cart",
    "search": "Search"
  },
  "hero": {
    "eyebrow": "Robotics · electronics · STEM",
    "headline": "Build your first {robot} this weekend",
    "subhead": "Kits, dev boards, sensors, and downloadable project packs for Pakistani schools, teachers, and curious kids at home.",
    "ctaPrimary": "Shop kits",
    "ctaSecondary": "Book a school demo"
  },
  "common": {
    "addToCart": "Add to cart",
    "buyNow": "Buy now",
    "outOfStock": "Out of stock",
    "inStock": "In stock",
    "free": "Free",
    "loading": "Loading…",
    "viewAll": "View all"
  },
  "footer": {
    "tagline": "Learn. Build. Create. Innovate.",
    "rights": "All rights reserved."
  }
}
```

Urdu mirrors every key 1:1 (`next-intl` will throw at build time on a missing key, which is the point — it catches untranslated strings before launch).

### 9.2 RTL rules

- Set `dir="rtl"` on `<html>` when locale is `ur`.
- Use Tailwind logical properties everywhere (`ms-4` not `ml-4`, `pe-6` not `pr-6`, `text-start` not `text-left`) so the same className works in both directions.
- Numerals, prices, and phone numbers stay LTR even inside RTL text — wrap them in `<span dir="ltr">`.
- Test the `Marquee` and `Hero` floating cards specifically in RTL — anything absolutely positioned with `left-`/`right-` needs converting to `start-`/`end-`.
- Product `name_ur` / `description_ur` fields are nullable — fall back to the English field if empty rather than rendering blank.

---

## Part 10 — SEO & Performance

### 10.1 Structured data (JSON-LD)

- **Organization** (root layout, site-wide): name, logo, url, sameAs (social links), contactPoint.
- **Product** (PDP): name, image, description, sku, brand, offers `{price, priceCurrency: "PKR", availability}`, aggregateRating if reviews exist.
- **BreadcrumbList** (every page with a breadcrumb: shop category/PDP, schools subpages, digital PDP).
- **FAQPage** (any page with an FAQ accordion: `/schools`, `/digital`, `/contact`).
- **Course** (course detail): name, description, provider, hasCourseInstance.

### 10.2 Metadata pattern

Every route exports `generateMetadata()` (dynamic routes) or a static `metadata` object: `title` (`"{Page} | Bizmi"`), `description`, `openGraph` (title/description/image via `/api/og`), `alternates.canonical`. Product/category/digital/course pages additionally set `alternates.languages` for `en`/`ur`.

### 10.3 Performance targets

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 90 (all page types) |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse SEO | 100 |
| LCP | < 2.5s on 4G |
| CLS | < 0.1 |
| Image delivery | `next/image` everywhere, `sizes` set correctly, AVIF/WebP via Vercel's image loader |

### 10.4 Caching / rendering strategy

- Home, category pages, PDPs, digital/course catalogs: **ISR**, revalidate hourly (`export const revalidate = 3600`) — inventory drift is tolerable for that long given COD fulfillment timelines.
- `/search`: dynamic, no cache (real-time query).
- `/account/*`, `/teacher/*`, `/admin/*`: dynamic, no cache (per-user data).
- Sitemap (`app/sitemap.ts`) includes all published products/digital/courses/categories, regenerated on the same hourly cadence. `robots.txt` disallows `/account`, `/teacher`, `/admin`, `/checkout`, `/cart`.

---

## Part 11 — Build Order (11 Phases)

Reflects both this master prompt's full scope **and** what's already been built this session — Phase 0 and part of Phase 1 are done; everything else below is what's left.

### Phase 0 — Setup ✅ done
Next.js (App Router, TS strict) + Tailwind v4 + shadcn/ui scaffolded, Bizmi design tokens wired (colors, Fraunces/Inter/JetBrains Mono), full route-group folder structure created, core deps installed (Framer Motion, Supabase JS/SSR, Zustand, RHF+Zod, next-intl, Resend, Sentry, PostHog, `@react-pdf/renderer`), repo pushed to `mrjaved121/bizmi`.
**Not yet done from this phase:** Supabase project not yet created/connected (no `.env.local` with real keys), no migration pushed, no Vercel deployment.

### Phase 1 — Marketing site (partial ✅)
**Done:** Home page (`/`), full component set (Nav, TopBar, Hero, SchoolsMarquee, BentoCategories, FeaturedDevBoards, SensorsGrid, DigitalProjectsBlock, ForSchoolsSection, Testimonial, NewsletterCTA, Footer), with a motion/polish pass (Framer Motion reveals, icon-based visuals, focus states).
**Remaining:** `/about`, `/contact`, `/schools` + 5 service subpages, `/schools/book-demo` (multi-step form), `/privacy`, `/terms`, `/returns`, `/not-found`, `/error`.

### Phase 2 — Catalog + product detail + search
`/shop`, `/shop/[category]`, `/shop/[category]/[slug]`, `/search`. Push the `categories`/`products`/`digital_files` migration first. Seed ~80 real products across Arduino/RPi/STM32/sensors per the taxonomy in the shorter brief.

### Phase 3 — Auth + cart + COD checkout
`/auth/*` (sign-in, sign-up, verify, forgot-password), `/cart`, `/checkout` + `/checkout/success`. `createOrder` server action, COD + bank-transfer payment paths, order confirmation email/SMS.

### Phase 4 — Digital products + delivery
`/digital`, `/digital/[slug]`, digital-only checkout path (skip shipping step), `digital_grants` + signed-URL download route, PDF watermarking, `DigitalDelivery` email.

### Phase 5 — Account area
`/account`, `/account/orders(+[id])`, `/account/downloads`, `/account/wishlist`, `/account/settings`, `/account/join-classroom`. (`/account/certificates` can wait for Phase 8/courses.)

### Phase 6 — Admin dashboard
`/admin` shell (role-gated) + `/admin/orders(+[id])`, `/admin/products(+new/[id])`, `/admin/digital`, `/admin/customers`, `/admin/schools`, `/admin/inquiries`.

### Phase 7 — Schools & classrooms
`/schools/book-demo` submission wired to `service_inquiries` + `/admin/inquiries`, `/teacher/*` (dashboard, classrooms, classroom detail, assignments), join-code flow.

### Phase 8 — Courses
`/courses`, `/courses/[slug]`, enrollment, `/account/certificates`.

### Phase 9 — Localization
`next-intl` wiring, translate all UI strings, RTL layout pass, `<LanguageToggle />`.

### Phase 10 — SEO, performance, analytics
Structured data, sitemap/robots, PostHog events, Sentry alerting thresholds, `/admin/analytics`.

### Phase 11 — Testing + launch polish
Full pass of Part 12's checklist, real content (photos, prices, copy), soft launch.

---

## Part 12 — Testing Checklist (pre-launch)

**Functional**
- [ ] Guest can add to cart, checkout via COD, and receive a confirmation email + SMS
- [ ] Bank transfer receipt upload works and appears in `/admin/orders/[id]`
- [ ] School invoice request path works end-to-end (PO number → admin sees it)
- [ ] Digital-only order skips the shipping step entirely
- [ ] Digital download link works, expires appropriately, and re-downloading from `/account/downloads` issues a fresh link
- [ ] PDF watermark actually stamps buyer email + order number
- [ ] Inventory decrements on order, and an out-of-stock item can't be added to cart
- [ ] Discount code validates min-order, date range, and max-uses correctly
- [ ] Wishlist requires auth and persists across sessions
- [ ] Teacher can create a classroom, student can join via code
- [ ] Admin can advance an order through every status and each transition fires the right email
- [ ] Search returns relevant results and tolerates typos (pg_trgm)

**Responsive**
- [ ] Every page tested at 375px, 768px, 1024px, 1440px
- [ ] Mobile nav (Sheet), filter sidebar (Sheet), and cart drawer all usable one-handed
- [ ] No horizontal scroll anywhere

**Accessibility**
- [ ] All interactive elements have visible focus states
- [ ] Forms have associated labels and inline error messages tied via `aria-describedby`
- [ ] Color contrast passes WCAG AA, including chip/badge text on soft backgrounds
- [ ] Images have meaningful `alt` text; decorative SVGs are `aria-hidden`

**Performance**
- [ ] Lighthouse ≥ 90 on home, a category page, and a PDP
- [ ] No layout shift from web font loading (Fraunces/Inter/JetBrains Mono all use `display: swap` + `variable`)
- [ ] Product images served via `next/image` with correct `sizes`

**Security**
- [ ] RLS enabled and tested on every table (try reading another user's orders/downloads while authenticated as someone else)
- [ ] Admin routes reject non-admin/staff roles at the middleware level, not just hidden in the UI
- [ ] Signed download URLs actually expire
- [ ] No service-role key ever shipped to the client bundle

**i18n**
- [ ] Every string in the Urdu locale — `next-intl` build fails on missing keys, confirm CI catches it
- [ ] RTL layout checked on Hero, Nav, Marquee, and any absolutely-positioned elements
- [ ] Prices/phone numbers stay LTR inside RTL text

**Email/SMS**
- [ ] Every transactional email (order confirmation, digital delivery, shipping updates, school inquiry confirmation, password reset) renders correctly in Gmail, Outlook, and a WhatsApp-embedded browser
- [ ] Resend domain verified (SPF/DKIM/DMARC) so mail doesn't land in spam
- [ ] SMS delivers to a real +92 number in testing

**Cross-browser**
- [ ] Chrome, Safari (incl. iOS), Firefox, Samsung Internet (common in PK Android market)

---

## Part 13 — Kickoff Message

Paste-ready for a fresh Claude Code session once this document is complete and both files (`BIZMI_MASTER_PROMPT.md`, `bizmi-v3.html`) are at the repo root:

> Read `BIZMI_MASTER_PROMPT.md` in full and use it as your source of truth over `BIZMI_BUILD_BRIEF.md` (the shorter, earlier brief) wherever the two differ — this document is more detailed and supersedes it. Home page (Phase 1, partial) is already built; check Part 12 for what's done and what's next, and continue in that order. For each page, reference its spec in Part 5, its components in Part 6, and its data needs in Parts 7–8. Match the visual style already established in the built home page (and `bizmi-v3.html` if present). Ask before making any decision the doc doesn't cover — in particular, resolve the `components/features/home/` vs. `components/marketing/` folder-naming difference (Part 6's reconciliation note) before Phase 2 so the structure doesn't fork further.

---

**End of master prompt.**

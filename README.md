# Astro T-Shirt

เว็บร้านเสื้อยืดดีไซน์พิเศษ — สร้างด้วย Astro 6 (SSG) พร้อม stack ครบสำหรับ SEO/GEO

## 🧱 Stack

| ชั้น | เครื่องมือ |
| :--- | :--- |
| Framework | **Astro 6** (`output: 'static'` — SSG) |
| Interactive islands | **@astrojs/react v5** (React 19) — ใช้เฉพาะ search/filter/form |
| Content | **Content Layer API** (Content Collections) + **MDX** |
| Styling | **Tailwind CSS v4** (ผ่าน `@tailwindcss/vite`) |
| UI | **Starwind UI** (`src/components/starwind/`) |
| รูปภาพ | **astro:assets** — optimize อัตโนมัติ (LCP/SEO) |
| SEO | **astro-seo** (meta + OG/Twitter) + **JSON-LD** (`src/components/SEO.astro`) |
| Sitemap/Robots | **@astrojs/sitemap** + **astro-robots-txt** |
| RSS | **@astrojs/rss** (`/rss.xml`) |

## 📁 โครงสร้างหลัก

```text
src/
├── assets/              # รูปต้นฉบับ (ผ่าน astro:assets)
├── components/
│   ├── starwind/        # Starwind UI components (เพิ่มด้วย CLI)
│   └── SEO.astro        # meta tags + JSON-LD
├── content/
│   ├── products/        # สินค้า (.md/.mdx)
│   └── blog/            # บทความ (.md/.mdx)
├── content.config.ts    # schema ของ collections (type-safe)
├── consts.ts            # ค่าคงที่ของไซต์ (ชื่อ/คำอธิบาย/social)
├── layouts/Layout.astro # โครงหลักทุกหน้า
├── pages/
│   ├── index.astro
│   ├── products/        # list + [...slug] detail
│   ├── blog/            # list + [...slug] detail
│   └── rss.xml.ts       # RSS feed
└── styles/
    ├── global.css       # entrypoint (import starwind.css)
    └── starwind.css      # Tailwind v4 + Starwind theme tokens
```

## ⚙️ ตั้งค่าก่อนใช้งานจริง

1. **`astro.config.mjs`** → เปลี่ยน `SITE_URL` เป็นโดเมนจริง (มีผลต่อ sitemap/robots/rss/canonical)
2. **`src/consts.ts`** → ปรับชื่อร้าน คำอธิบาย social
3. วางรูป OG เริ่มต้นไว้ที่ `public/og-default.png`

## 🧞 คำสั่ง

| คำสั่ง | การทำงาน |
| :--- | :--- |
| `npm run dev` | dev server ที่ `localhost:4321` |
| `npm run build` | build ไป `./dist/` |
| `npm run preview` | preview ผล build |
| `npm run astro check` | ตรวจ type ของ `.astro` |
| `npx starwind@latest add <ชื่อ>` | เพิ่ม Starwind component |

## 🎨 เพิ่ม Starwind component

```sh
npx starwind@latest add dialog dropdown tabs
```

ดูรายการทั้งหมดที่ <https://starwind.dev>

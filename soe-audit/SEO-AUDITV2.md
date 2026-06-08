# SEO Audit V2 — เจาะลึกรายหน้า + การเขียนบล็อก (เสื้อแท้ / ธน พลัส 153)

> **วันที่ออดิต:** 2026-06-08
> **ขอบเขต:** เจาะลึก **รายหน้า (per-page on-page / content)** ทุก route + **คุณภาพการเขียนบล็อก** ใน `src/content/blog/`
> **วิธีการ:** อ่าน source ทุก route + frontmatter/เนื้อหาบทความทั้ง 14 โพสต์ → grep รูปแบบลิงก์ (internal/competitor/external), `<h1>`, FAQ heading ซ้ำ → อ้าง `file:line` จริงทุกข้อ
> **อ้างอิงหลักการ:** skill `/seo` → `references/on-page-content.md` (title/meta/heading/keyword/internal link/E-E-A-T/helpful content/content decay/AI-citation structure) + กฎโปรเจกต์เอง `src/content/blog/CLAUDE.md` §1–§9
> **ความสัมพันธ์กับ V1 (`SEO-AUDIT.md`):** V1 ออดิตระดับ **ทั้งไซต์** (technical / structured-data / entity) และแก้ไปแล้วหลายข้อ — V2 **ไม่ rehash** ข้อที่ V1 ปิดแล้ว แต่ลงลึกสิ่งที่ V1 ไม่ได้เจาะ (on-page รายหน้า + การเขียน) และชี้จุดที่ "ข้อ V1 ที่ยังเปิด" (#6 separator, #8 Product schema, #11 internal link) โผล่ในแต่ละหน้า
> **สถานะ:** ✅ **แก้ครบทั้ง P1 และ P2 แล้ว (2026-06-08)** — P1: V2-1/V2-2/V2-3 · P2: V2-4 (title/desc taxonomy), V2-5 (pillar links ลง cluster), V2-6 (`updatedAt` startup-guide), V2-7 (ItemList name/image), V2-8 (Breadcrumb/CollectionPage/Blog schema), V2-11 (blog title) · **V2-9 ปิดไปแล้วใน V1 #6** (separator `|`) · **V2-10 = "อย่าทำ"** (ห้ามปั้น Review schema จาก testimonials นิรนาม) · ทุกข้อผ่าน `npx astro check` (0 errors) + `npm run build` (39 หน้า) ยืนยันใน `dist/**/index.html` จริง · **เหลือเฉพาะงานที่ "ตรวจไม่ได้จากในโค้ด"** (GSC/CrUX — ดูท้ายเอกสาร)

---

## สรุปผู้บริหาร (Executive Summary)

หลังจาก V1 ปิดบั๊กเชิงสถาปัตยกรรม (JSON-LD merge, logo 404, entity/brand) ฐาน SEO **แข็งแรงระดับเทคนิคแล้ว** — ทุกหน้ามี `<title>` นำคีย์เวิร์ด (money page), `<h1>` เดียว/หน้า, schema ต่อชนิดหน้า, FAQ data-driven

**จุดอ่อนที่เหลือเกือบทั้งหมดอยู่ที่ชั้น "on-page รายหน้า + การเขียนเนื้อหา + การเชื่อมลิงก์"** ซึ่งเป็นชั้นที่ skill `/seo` ระบุว่า *"relevance & content quality dominate ranking; internal linking คือ on-page lever ที่ leverage สูงสุดและคนใช้น้อยสุด"* — สามจุดที่กระทบรายได้ตรงที่สุด:

1. **บทความแทบไม่ลิงก์ขึ้น money page** — `/products` = **0 โพสต์**, `/services` = **1 โพสต์** ทั้งที่มี CTA "ทีมงาน Thana Plus 153" เป็น **plain text** อยู่ ~6 โพสต์ (ที่ที่ควรเป็น anchor ไป `/services`)
2. **บล็อกลิงก์ออกหา "คู่แข่งไทย"** — `tshirt-color-fade-...md` มีลิงก์ไป `somsritshirt.com` (×3), `thumbinthai.com`, `pmkpolomaker.com` = **ผิดกฎ `blog/CLAUDE.md` §6 โดยตรง** (ส่ง link equity + ส่งลูกค้าให้คู่แข่งฟรี)
3. **หน้า taxonomy (category/tag) บางและซ้ำซ้อน** — `category` กับ `tag` ชื่อเดียวกัน (เช่น "ธุรกิจ", "งานสกรีน") สร้างหน้า near-duplicate, tag หลายตัวมีโพสต์เดียว = thin + index bloat, และ title นำด้วย "หมวดหมู่:/แท็ก:"

| # | ปัญหา | หน้า/ไฟล์ | ระดับ | ผลกระทบ |
|---|-------|----------|:----:|---------|
| V2-1 | Internal link ขึ้น money page อ่อนมาก (`/products`=0, `/services`=1); CTA เป็น plain text | บล็อกเกือบทุกโพสต์ | ✅ P1 | กระจาย authority / conversion / AI citation |
| V2-2 | ลิงก์ออกหาคู่แข่งไทยใน "แหล่งอ้างอิง" (ผิด §6) | `tshirt-color-fade-...md:91,92,94,99,103` | ✅ P1 | ส่ง equity+ลูกค้าให้คู่แข่ง, E-E-A-T |
| V2-3 | `category`/`tag` ซ้อนกัน → หน้า near-duplicate + tag thin (1 โพสต์) = index bloat | `category/[category].astro`, `tag/[tag].astro` | ✅ P1 | Duplicate/thin content, crawl budget |
| V2-4 | Title หน้า taxonomy นำด้วย "หมวดหมู่:/แท็ก:" + description templated บาง | `category/[category].astro`, `tag/[tag].astro` | ✅ P2 | front-loading คีย์เวิร์ด / CTR |
| V2-5 | Pillar "ฉบับสมบูรณ์" ลิงก์ออก 0 (dead-end) + cannibalization กับ hands-on | `clothing-brand-startup-guide.md` vs `start-clothing-brand-hands-on.md` | ✅ P2 | Topic cluster / keyword cannibalization |
| V2-6 | ไม่มี `updatedAt` สักโพสต์ → ไม่มีสัญญาณ freshness; โพสต์ มี.ค.–เม.ย. ใกล้รอบ refresh | ทุกโพสต์ | ✅ P2 | Content decay / AI-citation freshness |
| V2-7 | `/products` ItemList JSON-LD มีแค่ `position`+`url` (ไม่มี name/image) | `products/index.astro` | ✅ P2 | Rich/structured signal ของ catalog |
| V2-8 | `/blog`, `/category`, `/tag`, `/products` ไม่มี `BreadcrumbList`/`CollectionPage` | หน้า listing (ข้าม tag = noindex) | ✅ P2 | Breadcrumb signal / site structure |
| V2-9 | `<title>` คั่นด้วยเว้นวรรคคู่ (= V1 #6) | `SEO.astro` | ✅ ปิดใน V1 | CTR / ความชัดของแบรนด์ใน SERP |
| V2-10 | Testimonials หน้า `/products` นิรนาม (decorative ★★★★★) — **ห้าม** แปลงเป็น Review schema | `products/index.astro:72-115` | ⚪ หมายเหตุ | ความเสี่ยง manual action ถ้าทำ schema ปลอม |

> **ลำดับลงมือ:** ✅ V2-2 → V2-1 → V2-3 (**P1**) → V2-7 → V2-4 → V2-11 → V2-8 → V2-5 → V2-6 (**P2**) — **ครบทั้ง P1+P2 แล้ว 2026-06-08** · เหลือเฉพาะงาน "ตรวจไม่ได้จากในโค้ด" (GSC/CrUX จริง) ด้านล่าง

> **ไฟล์ที่แก้ไปแล้ว (P1, 2026-06-08):** `src/pages/tag/[tag].astro` (V2-3 noindex) · `src/content/blog/CLAUDE.md` (V2-3 กติกา §3/§9) · `src/content/blog/tshirt-color-fade-screen-peel-standard-factory.md` (V2-2 ลบลิงก์คู่แข่ง + V2-1 CTA) · `clothing-brand-startup-guide.md` · `start-clothing-brand-hands-on.md` · `care-screen-printed-shirts.md` · `restaurant-cafe-apron-guide.md` · `tshirt-first-production-checklist.md` (V2-1 CTA → anchor)

> **ไฟล์ที่แก้ไปแล้ว (P2, 2026-06-08):** `src/pages/products/index.astro` (V2-7 ItemList name/image + V2-8 Breadcrumb) · `src/pages/blog/index.astro` (V2-11 title + V2-8 Blog/Breadcrumb) · `src/pages/category/[category].astro` (V2-4 title/desc + V2-8 CollectionPage/Breadcrumb) · `src/pages/tag/[tag].astro` (V2-4 title/desc) · `src/content/blog/clothing-brand-startup-guide.md` (V2-5 ลิงก์ลง cluster 4 จุด + V2-6 `updatedAt`)

---

# ส่วนที่ 1 — ออดิตรายหน้า (Per-Page)

> เกณฑ์ที่ตรวจต่อหน้า: **Intent match · `<title>` (คีย์เวิร์ดนำหน้า) · meta description · `<h1>` (ตรง title) · keyword ในเนื้อหา · internal link (เข้า/ออก) · structured data**

## 1.1 หน้าแรก `/` — `src/pages/index.astro`

| รายการ | สถานะ |
|--------|:-----:|
| Intent (transactional: "รับผลิตเสื้อ") | ✅ ตรง |
| `<title>` นำคีย์เวิร์ด ("โรงงานรับผลิตเสื้อครบวงจร…") `index.astro:51` | ✅ |
| `<h1>` (ใน `Hero`) | ✅ มี (V1 ยืนยัน 1 ต่อหน้า) |
| FAQ + Org/WebSite schema | ✅ (V1 แก้ merge แล้ว) |
| Internal link ลงบทความ/สินค้า | ✅ มี `BlogFeed`, `Collections` |

**ปัญหาเล็ก (P2):** meta description ของหน้าแรก (`index.astro:52`) นำด้วยชื่อนิติบุคคล *"บริษัท ธน พลัส 153 จำกัด …"* แต่ V1 #3 เลือก **"เสื้อแท้" เป็นชื่อแบรนด์หลัก** → เพื่อความสม่ำเสมอของ entity ควรนำด้วย "เสื้อแท้" แล้วค่อยตามด้วยชื่อนิติบุคคล (ไม่ใช่บั๊ก แต่ทำให้สัญญาณแบรนด์นิ่งขึ้น)
**วิธีแก้:** `description="เสื้อแท้ (บริษัท ธน พลัส 153 จำกัด) โรงงานรับผลิตเสื้อยืด โปโล…"`
**สรุป:** หน้านี้แข็งแรงสุดของไซต์ — แทบไม่ต้องแตะ

---

## 1.2 หน้าบริการ `/services` — `src/pages/services.astro` (money pillar)

| รายการ | สถานะ |
|--------|:-----:|
| Intent (commercial: "โรงงานผลิตเสื้อผ้า") | ✅ ตรง |
| `<title>` นำคีย์เวิร์ด `services.astro:124` | ✅ |
| Service + LocalBusiness + Breadcrumb + FAQ schema | ✅ ครบ (เด่นมาก) |
| LocalBusiness NAP + logo (astro:assets) | ✅ (V1 แก้แล้ว) |

**ข้อสังเกต (ไม่ใช่บั๊ก):**
- หน้านี้คือ **pillar ที่ควรรับลิงก์จากบทความมากที่สุด** แต่ปัจจุบันมีบทความลิงก์เข้ามาแค่ **1 โพสต์** (ดู V2-1) — pillar ที่ไม่มี cluster ชี้เข้า = เสีย leverage ที่ออกแบบมาดีแล้วทิ้ง
- FAQ rich result ถูก Google ปิด 7 พ.ค. 2026 (V1 #7) — markup ยังมีประโยชน์ต่อ AI parsing ไม่ต้องลบ แต่ **อย่าคาดหวัง accordion ดาวใน SERP**
**สรุป:** on-page ดีมาก งานที่เหลือคือ "ดึงลิงก์เข้า" จากบทความ (แก้ที่ฝั่งบล็อก ไม่ใช่หน้านี้)

---

## 1.3 หน้าผลงาน `/products` — `src/pages/products/index.astro`

| รายการ | สถานะ |
|--------|:-----:|
| `<title>`/`<h1>` นำคีย์เวิร์ดไทย ("ผลงานรับผลิตเสื้อ…") `index.astro:26,32` | ✅ (V1 #4 แก้แล้ว) |
| Intent (portfolio/commercial) | ✅ |
| ItemList schema | ⚠️ บาง |
| Internal link ออกไป `/services` หรือบทความ | ❌ ไม่มี |

> ✅ **แก้แล้ว (2026-06-08)** — เติม `name` (=`product.data.title`) + `image` (absolute URL จาก `product.data.image.src`) ราย item ใน ItemList · **ยืนยัน:** `dist/products/index.html` แต่ละ ListItem มี `name`+`url`+`image` ครบ (เช่น "Premium Cotton T-Shirt" + รูป `_astro/...png`)

**ปัญหา V2-7 (P2): `ItemList` มีแค่ `position` + `url`** (`products/index.astro:12-22`)
- **ทำไมสำคัญ:** ItemList ที่มีแต่ URL ให้สัญญาณน้อย — `structured-data` แนะนำให้ใส่ `name` (+`image`) ราย item เพื่อให้ search/LLM เข้าใจ catalog
- **วิธีแก้:**
  ```ts
  const itemListElement = products.map((product, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: product.data.title,
    url: new URL(`/products/${product.id}`, Astro.site).toString(),
    image: new URL(product.data.image.src, Astro.site).toString(),
  }));
  ```

**ปัญหา V2-10 (หมายเหตุ/คำเตือน): testimonials นิรนาม** (`products/index.astro:72-115`)
- ปัจจุบันเป็นข้อความ + ดาว ★★★★★ แบบ **decorative** ไม่มี schema → **ถูกต้องแล้ว** (รีวิวไม่มีตัวตนจริง ห้ามทำ markup)
- ⚠️ **ห้าม** เผลอเอา testimonials เหล่านี้ไปทำ `Review`/`aggregateRating` (ทั้งหน้านี้และหน้า Product) — รีวิวต้องมาจาก **ลูกค้าจริงที่ตรวจสอบได้** เท่านั้น ไม่งั้นผิดนโยบาย Google → manual action (ตรงกับ V1 #8)
- 💡 **โอกาส:** ถ้าเก็บรีวิวจริง (ชื่อจริง/วันที่/รูปงาน) มาแทน จะปลดล็อก Review rich result ได้ถูกกติกา

**ปัญหา (เชื่อมโยง V2-1): ไม่มีลิงก์ออก** จากหน้านี้ไป `/services` (ปิดการขาย) หรือบทความที่เกี่ยวข้อง — เพิ่ม CTA "ดูบริการรับผลิตครบวงจร" → `/services` ใต้ grid

---

## 1.4 หน้าสินค้า `/products/[slug]` — `src/pages/products/[...slug].astro`

| รายการ | สถานะ |
|--------|:-----:|
| `<title>`=`d.title`, `<h1>`=`d.title` ตรงกัน | ✅ |
| Product + Offer + FAQ schema | ✅ (โครงดี) |
| Internal link กลับ `/products` | ✅ มี (`[...slug].astro:59`) |
| Internal link ขึ้น `/services` หรือบทความผ้า/สกรีน | ❌ ไม่มี |

**ปัญหา (= V1 #8 ที่ยังเปิด, P2):** `Offer` ขาด `priceValidUntil`, `hasMerchantReturnPolicy`, `shippingDetails` และ Product ไม่มี `aggregateRating`/`review` — เป็น *warning* ของ Merchant listing ไม่ใช่ error (รายละเอียดอยู่ใน V1 แล้ว ไม่ repeat)
**ปัญหา (เชื่อม V2-1, P2):** หน้าสินค้าเป็น cluster เชิงพาณิชย์ที่ควรลิงก์ขึ้น `/services` และลิงก์ข้างไปบทความที่เกี่ยวข้อง (เช่น เสื้อยืด → `/blog/cotton-fabric-grades-explained`) — ปัจจุบันไม่มีเลย พิจารณาเพิ่มบล็อกเนื้อหา/CTA ในไฟล์ `.md` ของสินค้า หรือใน template

---

## 1.5 หน้ารวมบล็อก `/blog` — `src/pages/blog/index.astro`

| รายการ | สถานะ |
|--------|:-----:|
| `<h1>` (ใน `BlogHero.astro:25`) | ✅ มี |
| Internal link ลงบทความ/แท็ก/หมวดหมู่ | ✅ เยอะ (`BlogPopularTags`, `BlogGrid`, `BlogExplorerSection`) |
| schema | ⚠️ มีแค่ Org/WebSite default |

> ✅ **แก้แล้ว (2026-06-08)** — เพิ่ม JSON-LD ผ่าน prop `jsonLd`: `/blog` = `Blog` + `BreadcrumbList` · `/category/*` = `CollectionPage` + `BreadcrumbList` (หน้าแรก → บทความ → หมวดหมู่) · `/products` = `ItemList` + `BreadcrumbList` · *ข้าม `/tag` เพราะ noindex แล้ว (V2-3) → schema บนหน้าที่ไม่เข้าดัชนีไม่มีค่า* · ทุกชนิดอ้าง `publisher`/`isPartOf` ผ่าน `@id /#organization` · **ยืนยัน:** dist แต่ละหน้า render schema ครบ

**ปัญหา V2-8 (P2): ไม่มี `Blog`/`CollectionPage` + `BreadcrumbList`**
- **ทำไมสำคัญ:** หน้า hub ของบล็อกควรมี breadcrumb (หน้าแรก → บทความ) และ `Blog` schema เพื่อบอกโครงสร้าง — ช่วย site structure signal
- **วิธีแก้:** ส่ง `jsonLd` (BreadcrumbList + `{ "@type": "Blog" }`) เข้า `PageLayout` (เหมือน `/services` ทำกับ Breadcrumb)

> ✅ **แก้แล้ว (2026-06-08)** — เปลี่ยน `<title>` เป็น "บทความและความรู้เรื่องเสื้อผ้า งานสกรีน และการทำแบรนด์" (ตัด transactional "รับงานสกรีนเสื้อ" ออก) + ปรับ description ให้อ่านลื่น ไม่ stuff · **ยืนยัน:** `dist/blog/index.html` `<title>` ไม่มี "รับงานสกรีนเสื้อ" แล้ว

**ปัญหา V2-11 (P2): `<title>` แอบ stuff** — `"บทความและความรู้เรื่องเสื้อผ้า รับงานสกรีนเสื้อ"` (`blog/index.astro:11`)
- หน้านี้ intent เป็น **informational hub** แต่เอาคีย์เวิร์ด transactional ("รับงานสกรีนเสื้อ") มาต่อท้าย → อ่านขัดและเสี่ยง Google rewrite title
- **วิธีแก้:** ตัดส่วน transactional ออก ให้ title โฟกัสคลังความรู้ เช่น `"บทความและความรู้เรื่องเสื้อผ้า งานสกรีน และการทำแบรนด์"`

---

## 1.6 หน้าบทความ `/blog/[slug]` — `src/pages/blog/[...slug].astro`

| รายการ | สถานะ |
|--------|:-----:|
| `<title>`=`d.title`, BlogPosting + FAQ schema, publisher อ้าง `@id` | ✅ ดีมาก |
| `<h1>` = `ArticleHeader` (title), เนื้อหาเริ่ม `##` | ✅ ไม่มี `# H1` ซ้ำในเนื้อหา (grep ยืนยัน) |
| related posts + sidebar (internal link) | ✅ มี |

**Template ของหน้านี้ทำถูกหมด** — ปัญหาของบทความอยู่ที่ **ตัวเนื้อหา (frontmatter + body)** ดูส่วนที่ 2

---

## 1.7 หน้าหมวดหมู่ `/category/[category]` — `src/pages/category/[category].astro`

| รายการ | สถานะ |
|--------|:-----:|
| `<h1>` = "หมวดหมู่: {category}" `:32` | ✅ มี (แต่ดูปัญหา) |
| `<title>` = `หมวดหมู่: ${category}` `:25` | ⚠️ นำด้วย "หมวดหมู่:" |
| description = `รวมบทความเกี่ยวกับ ${category}` `:25` | ⚠️ templated/บาง |
| schema/breadcrumb | ❌ ไม่มี |

> ✅ **แก้แล้ว (2026-06-08)** — `/category`: `title={`\${category} — บทความและความรู้`}` (front-load ชื่อหมวด, คง "หมวดหมู่:" ใน `<h1>`), description unique + จำนวนโพสต์ · `/tag`: `title={`\${tag} — รวมบทความที่เกี่ยวข้อง`}` + desc unique (หน้า noindex แล้ว แต่ปรับให้ดีไว้) · **ยืนยัน:** `dist/category/ธุรกิจ/` `<title>` = "ธุรกิจ — บทความและความรู้ | เสื้อแท้"

**ปัญหา V2-4 (P2): title front-loading เสีย** — `on-page-content.md §1` ระบุ *"front-load the important words"* แต่ title ขึ้นต้นด้วย "หมวดหมู่:" ทำให้คีย์เวิร์ดจริง (เช่น "งานสกรีน") ถูกผลักไปหลัง separator
- **วิธีแก้:** `title={`${category} — บทความและความรู้`}` แล้วคง "หมวดหมู่:" ไว้ใน `<h1>`/บนหน้าได้
- **description:** เขียนให้ unique ต่อหมวด เช่น `description={`รวมบทความเรื่อง${category} ${posts.length} บทความ จากโรงงานรับผลิตเสื้อ เสื้อแท้`}`

**ปัญหา V2-3 (P1 — taxonomy ซ้อน, ดูรายละเอียดด้านล่าง):** หน้าหมวดหมู่หลายหน้ามี **โพสต์ชุดเดียวกับหน้า tag ชื่อเดียวกัน** (เช่น category "งานสกรีน" = tag "งานสกรีน") → near-duplicate

---

## 1.8 หน้าแท็ก `/tag/[tag]` — `src/pages/tag/[tag].astro`

| รายการ | สถานะ |
|--------|:-----:|
| `<h1>` = "แท็ก: {tag}" `:37` | ✅ มี |
| `<title>` = `แท็ก: ${tag}` `:30` | ⚠️ เหมือน category |
| description templated `:30` | ⚠️ บาง |

**ปัญหา V2-3 (🟠 P1): taxonomy ซ้อน + tag thin = duplicate/index bloat**

> ✅ **แก้แล้ว (2026-06-08) — เลือกแนวทางที่ 1 (noindex หน้า tag ทั้งหมด)** — `tag/[tag].astro` ส่ง `noindex={true}` เข้า `PageLayout` (→ `<meta name="robots" content="noindex, nofollow">`) + เพิ่มกติกาใน `blog/CLAUDE.md` §3 (ห้าม `tag` ชนชื่อ `category` + ระบุว่าหน้า tag เป็น noindex) และเช็กลิสต์ §9 · **ยืนยันใน dist:** `dist/tag/**` มี `noindex` ครบ **14/14 หน้า**, `dist/category/**` = **0** (หมวดหมู่ยัง index ตามเดิม) · tag ยังใช้ navigate บนเว็บได้ แต่ไม่เข้าดัชนี Google

ทุกค่า `tags` และทุกค่า `category` สร้างหน้า indexable อัตโนมัติ — เมื่อรวมข้อมูลจริงจาก 14 โพสต์:

- **ชื่อชนกัน:** `category` "ธุรกิจ" / "งานสกรีน" มี tag ชื่อ **เดียวกันเป๊ะ** → `/category/ธุรกิจ` กับ `/tag/ธุรกิจ` แสดง **โพสต์ชุดเดียวกัน** = หน้า near-duplicate 2 หน้า แข่งกันเอง
- **tag บาง:** tag อย่าง `ผ้ากันเปื้อน`, `DTF`, `คอตตอน`, `การดูแลรักษา`, `ยูนิฟอร์ม` มีโพสต์น้อย (1–2) → หน้า listing ที่แทบไม่มีคุณค่า (thin) จำนวนมาก
- **ทำไมสำคัญ:** `/seo` (CRAWL→INDEX) — thin/near-duplicate pages จำนวนมากกิน crawl budget และเจือจางสัญญาณคุณภาพระดับโดเมน (helpful-content เป็นสัญญาณ **site-wide**)

**วิธีแก้ (เลือกแนวทาง):**
1. **(แนะนำ) `noindex` หน้า tag ทั้งหมด, คงหน้า category ให้ index** — tag ยังใช้ navigate ได้บนหน้าเว็บ แต่ไม่เข้าดัชนี ตัดทั้ง duplicate + thin ทีเดียว
   ```astro
   // tag/[tag].astro — ส่งเข้า PageLayout
   noindex={true}
   ```
2. หรือ index เฉพาะ tag ที่มี ≥ 3 โพสต์ (กรองใน `getStaticPaths` ให้ `noindex` ตามจำนวน)
3. ตั้งกติกาใน `blog/CLAUDE.md`: ห้าม `tag` ซ้ำชื่อกับ `category` (กัน duplicate ตั้งแต่ต้นทาง)

---

## 1.9 หน้า 404 `/404` — `src/pages/404.astro`
✅ `noindex={true}` ถูกต้อง, มี `<h1>`, redirect 5 วิ — **ไม่มีปัญหา SEO** (อย่าแก้)

---

# ส่วนที่ 2 — ออดิตการเขียนบล็อก (`src/content/blog/`)

ตรวจ 14 โพสต์ (ไม่นับ `CLAUDE.md`) เทียบ `references/on-page-content.md` + กฎโปรเจกต์ `blog/CLAUDE.md`

## ✅ สิ่งที่บล็อกทำได้ "ถูกกติกา" อยู่แล้ว (อย่าเผลอแก้)
- **ไม่มี `# H1` ในเนื้อหาเลย** (grep ยืนยัน) เริ่ม `##` ทุกไฟล์ — heading hierarchy ถูก
- **ไม่มีโพสต์ไหนพิมพ์ "## คำถามที่พบบ่อย" เอง** — ปล่อยให้ระบบ render `Faq` + FAQPage JSON-LD จาก `faq` frontmatter (ตรง §7)
- **`category` สะกดนิ่ง 4 หมวด** (`ธุรกิจ`, `ความรู้เรื่องผ้า`, `งานสกรีน`, `เลือกสีและสไตล์`) — ไม่มี duplicate จากเว้นวรรค
- **`title` ไม่เป็น exact-match keyword เปล่า ๆ** — มีคำขยายต่อท้ายทุกอัน (ตรง §2 / กัน over-optimization)
- **answer-first ดี** — เช่น `start-clothing-brand-hands-on.md:24` และ `clothing-brand-startup-guide.md:23` ย่อหน้าแรกมีคีย์เวิร์ดหลัก (ตัวหนา) + ตอบทันที
- **บทความ authority สูง** — `ai-tshirt-design-...` และ `sustainable-...grs-oekotex` อ้างแหล่งระดับ U.S. Copyright Office / OEKO-TEX / Textile Exchange = E-E-A-T ดีมาก
- **cross-link บล็อก→บล็อกแน่น** — เกือบทุกโพสต์ลิงก์หาบทความพี่น้อง 2–3 จุด (topic cluster ใช้ได้จริง)

---

## 🟠 V2-1 (P1) — บทความแทบไม่ลิงก์ "ขึ้น" money page; CTA เป็น plain text

> ✅ **แก้แล้ว (2026-06-08)** — เปลี่ยน CTA plain text ที่เอ่ย "ทีมงาน Thana Plus 153" ให้เป็น anchor เชิงบรรยายขึ้น `/services` ใน **6 โพสต์** (anchor หลากหลายทุกโพสต์ เลี่ยง "คลิกที่นี่") + เพิ่ม in-body link `/products` ใน `tshirt-first-production-checklist.md` · **ยืนยัน:** in-source `](/services` = **7** (เดิม 1), `](/products` = **1** (เดิม 0); rendered `dist/blog/clothing-brand-startup-guide/index.html` มี `href="/services"` 3 จุด · *คงคำ "ทีมงาน Thana Plus 153" ใน body ไว้ตาม V1 #3 (เสริม entity) แค่หุ้มประโยคปรึกษาให้เป็น anchor*

**หลักฐาน (grep ทั้งโฟลเดอร์):**
- `](/products` → **0 ครั้ง** (ไม่มีบทความใดลิงก์ไปหน้าผลงาน/สินค้าเลย)
- `](/services` → **1 ครั้ง** เท่านั้น (`sustainable-recycled-...md:106`)
- ในทางกลับกัน บทความ ~6 โพสต์ปิดท้ายด้วย CTA ที่เอ่ย **"ทีมงาน Thana Plus 153"** แบบ **plain text ไม่มีลิงก์** เช่น:
  - `clothing-brand-startup-guide.md:77`
  - `start-clothing-brand-hands-on.md:96`
  - `care-screen-printed-shirts.md:66`
  - `restaurant-cafe-apron-guide.md:66`
  - `tshirt-first-production-checklist.md:80`
  - `tshirt-color-fade-screen-peel-standard-factory.md:87`

**ทำไมสำคัญ:** `on-page-content.md §6` — internal linking pillar–cluster คือ on-page lever ที่ leverage สูงสุด; cluster (บทความ) ต้องลิงก์ขึ้น pillar (`/services`) ด้วย **anchor เชิงบรรยายที่หลากหลาย** ภายใน ~200–300 คำแรกหรือที่ CTA จุดที่เอ่ยทีมงานคือจุดที่ "ตั้งใจปิดการขายอยู่แล้ว" แต่ทิ้ง anchor ทอง ๆ เป็นข้อความเฉย ๆ *(ผลเชิงปริมาณ ~+30% organic / AI citation มากขึ้น = vendor-reported (Zyppy/Ahrefs) ไม่ใช่ตัวเลขที่ Google การันตี)*

**วิธีแก้:** เปลี่ยน CTA plain text ให้เป็นลิงก์ไป `/services` ด้วย anchor หลากหลาย (เลี่ยง "คลิกที่นี่"):
- `…ปรึกษา[งานรับผลิตเสื้อครบวงจร](/services)กับทีมงาน เสื้อแท้ ได้เลย`
- `…ดู[บริการสกรีน DTG/DTF และตัดเย็บ](/services)ทั้งหมด`
- บทความสินค้า/ผ้า → ลิงก์ไป `/products` (ดูผลงานจริง) ด้วย
- กระจาย anchor อย่าซ้ำคำเดิมทุกโพสต์

---

## 🟠 V2-2 (P1) — ลิงก์ออกหา "คู่แข่งไทย" ใน "แหล่งอ้างอิง" (ผิด `blog/CLAUDE.md` §6)

> ✅ **แก้แล้ว (2026-06-08)** — ลบ 5 ลิงก์คู่แข่ง (`:91,92,94,99,103` = Thumb in Thai, สมศรีมีเสื้อ ×3, PMK) ออกจากลิสต์ "แหล่งอ้างอิง" เหลือ **8 ลิงก์** = `thanaplus` (ในเครือ) + แหล่ง authority/มาตรฐานต่างประเทศ (Screen Print Direct, Dr Tees, QIMA, Testex, OEKO-TEX ฯลฯ) · **ยืนยัน:** grep `somsritshirt|thumbinthai|pmkpolomaker` ใน `dist/blog/tshirt-color-fade.../` = **0**; grep ทั้งโฟลเดอร์ `blog/` ไม่พบ inline mention ค้าง (เหลือเฉพาะตัวอย่างในกฎ `blog/CLAUDE.md §6`)

**หลักฐาน:** `tshirt-color-fade-screen-peel-standard-factory.md` (section "## แหล่งอ้างอิง")
| บรรทัด | ลิงก์ | สถานะตาม §6 |
|:------:|------|-------------|
| `:91` | `thumbinthai.com` (Thumb in Thai) | ❌ คู่แข่ง — ตัดทิ้ง |
| `:92` | `somsritshirt.com` (สมศรีมีเสื้อ) | ❌ คู่แข่ง — ตัดทิ้ง |
| `:94` | `somsritshirt.com` (สมศรีมีเสื้อ) | ❌ คู่แข่ง — ตัดทิ้ง |
| `:99` | `somsritshirt.com` (สมศรีมีเสื้อ) | ❌ คู่แข่ง — ตัดทิ้ง |
| `:103` | `pmkpolomaker.com` (PMK) | ❌ คู่แข่ง — ตัดทิ้ง |
| `:93` | `thanaplus.com` | ✅ ในเครือ — เก็บไว้ |
| `:95–102` | Screen Print Direct, Dr Tees, QIMA, Testex, OEKO-TEX ฯลฯ | ✅ authority/ต่างประเทศ — เก็บไว้ |

**ทำไมสำคัญ:** กฎโปรเจกต์เองระบุชัดว่า `somsritshirt`, `thumbinthai`, `pmkpolomaker` คือคู่แข่งที่แย่งคีย์เวิร์ด/ลูกค้ากลุ่มเดียวกัน — การลิงก์ตาม(dofollow) = **ส่ง link equity + ส่งคนอ่านออกไปหาคู่แข่งฟรี ๆ** และลด trust ของหน้าตัวเอง

**วิธีแก้:** ลบ 5 ลิงก์คู่แข่ง (`:91,92,94,99,103`) ออกจากลิสต์ ใช้เฉพาะ authority/ต่างประเทศ + `thanaplus` ที่เหลือ ตรวจว่าไม่มี inline mention ค้างในเนื้อหา (เช่น "(อ้างอิงจากสมศรีมีเสื้อ)") — grep แล้ว **ไม่พบ inline mention** มีเฉพาะในลิสต์ท้าย ∴ ลบจากลิสต์อย่างเดียวพอ
**ป้องกันซ้ำ:** บทความนี้ถูกเขียนก่อนกฎ §6 จะนิ่ง — ควร sweep โพสต์เก่าทุกตัวด้วยกติกาเดียวกัน (โพสต์อื่นที่ grep แล้ว = สะอาด)

---

## 🟡 V2-5 (P2) — Pillar "ฉบับสมบูรณ์" เป็น dead-end + cannibalization

> ✅ **แก้แล้ว (2026-06-08) — เลือกแนวทางที่ 1 (ทำให้เป็น pillar จริง)** — เพิ่มลิงก์ "ลง" หา cluster 4 จุดใน `clothing-brand-startup-guide.md`: §2 → `cotton-fabric-grades-explained`, §3 → `dtf-digital-printing-explained`, §4 → `budget-5000-baht-own-brand-tshirt`, สรุป → `start-clothing-brand-hands-on` (เดิมลิงก์ออก 0 = dead-end) · ตอนนี้ pillar ↔ cluster เชื่อมสองทาง (hands-on ลิงก์ขึ้น pillar อยู่แล้ว) · *ไม่ rewrite/ขยายความลึกเนื้อหา = นอกขอบเขตรอบนี้* · **ยืนยัน:** startup-guide มีลิงก์ `](/blog/` ไป cluster 4 ลิงก์

**สองบทความซ้อน intent เดียวกัน** ("สร้างแบรนด์เสื้อผ้า สำหรับมือใหม่"):
| ไฟล์ | title | ลิงก์ออก | ความลึก |
|------|-------|:-------:|--------|
| `clothing-brand-startup-guide.md` | "คู่มือเริ่มต้นสร้างแบรนด์เสื้อผ้า ฉบับสมบูรณ์ สำหรับมือใหม่" | **0** (dead-end) | บาง (~5 หัวข้อสั้น) |
| `start-clothing-brand-hands-on.md` | "เริ่มสร้างแบรนด์เสื้อผ้าของตัวเอง ฉบับจับมือทำทีละสเต็ป" | 3 (cross-link ดี) | ลึกกว่า (6 สเต็ป) |

**สถานการณ์:** `hands-on` ลิงก์ **ขึ้น** ไป `startup-guide` (`:26`) แต่ `startup-guide` (ที่ตั้งตัวเป็น "ฉบับสมบูรณ์/pillar") **ไม่ลิงก์ออกไปไหนเลย** — ทั้งสองชิงคีย์เวิร์ด "สร้างแบรนด์เสื้อผ้า/มือใหม่" เดียวกัน (cannibalization)

**ทำไมสำคัญ:** `on-page-content.md §6` — pillar ต้องลิงก์ลงหา cluster และ cluster ลิงก์กลับ pillar; ตอนนี้ pillar เป็น node ปลายตัน Google อาจสับสนว่าหน้าไหนคือหน้าหลักของหัวข้อนี้

**วิธีแก้ (เลือก):**
1. **ทำ `startup-guide` ให้เป็น pillar จริง** — เพิ่มลิงก์ลงหา cluster ที่เกี่ยวข้องในแต่ละหัวข้อ (เลือกผ้า → `cotton-fabric-grades-explained`, สกรีน → `dtf-digital-printing-explained`, ต้นทุน → `budget-5000-baht-own-brand-tshirt`, ลงมือ → `start-clothing-brand-hands-on`) และเสริมความลึกให้สมกับ "ฉบับสมบูรณ์"
2. หรือ **แยก intent ให้ชัด** — ให้ `startup-guide` = "ภาพรวม/วางแผน" และ `hands-on` = "ลงมือทำ" แล้ว cross-link สองทาง (มี §26 ทางเดียวอยู่แล้ว เพิ่มทางกลับ)

---

## 🟡 V2-6 (P2) — ไม่มี `updatedAt` สักโพสต์ → ไม่มีสัญญาณ freshness

> ✅ **จัดการแล้ว (2026-06-08)** — เติม `updatedAt: 2026-06-08` **เฉพาะ** `clothing-brand-startup-guide.md` (โพสต์ที่แก้เนื้อหาจริงจังรอบนี้ — V2-5) → feed `dateModified` ใน BlogPosting JSON-LD · **เจตนาไม่เติม** โพสต์ P1 ที่แก้แค่ 1 anchor (เลี่ยง cosmetic-update ตามคำเตือน Google ในข้อนี้เอง) · "รอบ refresh ทุก 6 เดือน/ปี" ยังเป็น **process ระยะยาว** (คำแนะนำด้านล่างยังใช้ได้) · **ยืนยัน:** `dist/blog/clothing-brand-startup-guide/` มี `dateModified`

**หลักฐาน:** grep frontmatter ทั้ง 14 โพสต์ → **ไม่มีไฟล์ใดมี `updatedAt`** เลย; โพสต์เก่าสุด `start-clothing-brand-hands-on` (2026-03-12) และ `tshirt-first-production-checklist` (2026-03-25) อายุ ~2.5–3 เดือน

**ทำไมสำคัญ:** `on-page-content.md §9` — เนื้อหา evergreen ควร refresh อย่างน้อยปีละครั้ง, niche เคลื่อนไวทุก 3–6 เดือน; **AI-search freshness effect (Ahrefs):** คอนเทนต์ที่ไม่อัปเดต >1 ปี ถูก ChatGPT อ้างน้อยลง ~50% — `updatedAt` คือ field ที่ feed `dateModified` ใน BlogPosting JSON-LD โดยตรง (`blog/[...slug].astro:38`)

**วิธีแก้ (process ไม่ใช่บั๊ก):**
- ตั้งรอบ refresh โพสต์ "ธุรกิจ/เทรนด์" ทุก ~6 เดือน, "ความรู้เรื่องผ้า/สกรีน" (evergreen) ทุกปี
- เมื่อแก้เนื้อหา **จริง** ให้เติม `updatedAt` (อย่าแตะ `publishedAt`) — ตาม §1; **อย่า**แก้แค่วันที่โดยไม่แก้เนื้อหา (Google จับ cosmetic update ได้)

---

## หมายเหตุคุณภาพรายบทความ (ผ่านเกณฑ์ — ไม่มี action บังคับ)
- **ความยาว/ความลึก:** ส่วนใหญ่ลึกพอต่อ intent (มีตาราง, ขั้นตอน, FAQ) — ตรง §10 "structure for AI citation"; ไม่พบอาการ thin/filler (ยกเว้นหน้า taxonomy ในส่วนที่ 1)
- **`coverAlt`:** บรรยายภาพจริง ไม่ก๊อป title — ดี (เช่น `sustainable-...:9` ละเอียดมาก)
- **keyword ในเนื้อหา body:** สุ่มตรวจแล้วมีวลีคีย์เวิร์ดหลักในย่อหน้าแรก (ตรง §5)

---

# ส่วนที่ 3 — สรุป Action ตาม Priority

| Priority | ข้อ | งาน | ไฟล์เป้าหมาย |
|:--------:|-----|-----|-------------|
| ✅ P1 | V2-2 | ~~ลบ 5 ลิงก์คู่แข่งใน "แหล่งอ้างอิง"~~ **เสร็จ 2026-06-08** | `tshirt-color-fade-screen-peel-standard-factory.md` |
| ✅ P1 | V2-1 | ~~เปลี่ยน CTA plain text → anchor ไป `/services` (+`/products`) 6 โพสต์~~ **เสร็จ 2026-06-08** | 6 โพสต์ (ดู V2-1) |
| ✅ P1 | V2-3 | ~~`noindex` หน้า tag + กติกาห้าม tag ชนชื่อ category~~ **เสร็จ 2026-06-08** | `tag/[tag].astro`, `blog/CLAUDE.md` |
| ✅ P2 | V2-4 | ~~title/description หน้า category & tag (front-load, unique)~~ **เสร็จ** | `category/[category].astro`, `tag/[tag].astro` |
| ✅ P2 | V2-11 | ~~ลด stuffing ใน `<title>` หน้า `/blog`~~ **เสร็จ** | `blog/index.astro` |
| ✅ P2 | V2-5 | ~~ทำ `startup-guide` เป็น pillar (ลิงก์ลง cluster)~~ **เสร็จ** (แนวทาง 1) | `clothing-brand-startup-guide.md` |
| ✅ P2 | V2-7 | ~~เติม `name`+`image` ใน ItemList~~ **เสร็จ** | `products/index.astro` |
| ✅ P2 | V2-8 | ~~เพิ่ม BreadcrumbList/CollectionPage/Blog หน้า listing~~ **เสร็จ** (ข้าม tag=noindex) | `blog/index.astro`, `category`, `products/index.astro` |
| ✅ — | V2-9 | ~~`<title>` separator~~ **ปิดไปแล้วใน V1 #6** (` \| `) | `SEO.astro` |
| ✅ P2 | V2-6 | ~~ใช้ `updatedAt` เมื่อแก้จริง~~ **เสร็จ** (startup-guide); รอบ refresh = process ต่อเนื่อง | `clothing-brand-startup-guide.md` |
| ⚪ note | V2-10 | **อย่า** ทำ Review/aggregateRating จาก testimonials นิรนาม | `products/index.astro`, product schema |

---

## ⛔ ตรวจไม่ได้จากในโค้ด (ต้องดูข้อมูลจริง — ตามหลัก `/seo` "diagnose before prescribing")
- **Google Search Console** — บทความไหน index แล้ว, query ที่มี impression, โพสต์ที่ร่วงจาก top-5 ไป 8–20 (= สัญญาณ decay → trigger V2-6), หน้า tag/category ถูก index เกินจำเป็นไหม (= ยืนยัน V2-3)
- **คู่แข่งที่ rank จริงต่อคีย์เวิร์ด** — เทียบความลึก/intent ก่อนตัดสินว่าบทความไหนต้องเสริม (เช่น ทั้งสอง "สร้างแบรนด์" ใน V2-5)
- **Cannibalization จริง** — ดูใน GSC ว่ามี 2 URL สลับกันติดอันดับคีย์เวิร์ดเดียวกันหรือไม่ (ยืนยัน V2-5)
- **CrUX/PageSpeed field data** — INP/LCP/CLS p75 (โค้ดดูดีแต่ต้องวัดจากผู้ใช้จริง)

---

*ออดิต V2 นี้ลงลึก "รายหน้า + การเขียน" ต่อยอดจาก V1 (`SEO-AUDIT.md`) อิงหลักการ skill `/seo` (`references/on-page-content.md`) และกติกาโปรเจกต์ `src/content/blog/CLAUDE.md` — ทุกการกล่าวอ้างอ้าง `file:line` จริง และแยกชัดระหว่างข้อเท็จจริงที่ Google ยืนยัน กับตัวเลข vendor-reported*

# SEO Audit — เสื้อแท้ / ธน พลัส 153

> **วันที่ออดิต:** 2026-06-08
> **ขอบเขต:** ทั้งโปรเจกต์ (Astro 6 SSG storefront) — technical SEO, structured data, on-page, entity/brand, content
> **วิธีการ:** อ่าน source → `npm run build` (สำเร็จ, 39 หน้า) → grep rendered `dist/**/index.html` เพื่อยืนยันผลลัพธ์จริง ไม่เดาจาก source อย่างเดียว
> **อ้างอิงหลักการ:** skill `/seo` (CRAWL → RENDER → INDEX → RANK → CITED) — แก้ตัวบล็อก index/structured-data ก่อน แล้วค่อย content/links
> **สถานะ:** ✅ แก้ครบทุกข้อที่ลงมือได้ (อัปเดต 2026-06-08) — **P0 #1 #2 · P1 #3 #4 #5 · P2 #6 #8 #10 #11 · #9 ยืนยันแล้ว** · เหลือเฉพาะ **#7** (FAQ rich result — รับทราบ ไม่ต้องแก้ตามนโยบาย Google) · ทุกข้อผ่าน `npx astro check` (0 errors) + `npm run build` และยืนยันใน `dist/**/*.html` ที่ build จริงแล้ว

---

## สรุปผู้บริหาร (Executive Summary)

โครงสร้าง SEO พื้นฐานของเว็บ **แข็งแรงเกินค่าเฉลี่ยมาก** — มี SEO component กลาง, canonical อัตโนมัติ, sitemap แบบ priority รายหน้า, robots.txt, RSS, JSON-LD ต่อชนิดหน้า, ใช้ `astro:assets` ทุกที่, มี `<h1>` เดียวต่อหน้าครบทุก 39 หน้า, lazy-load GA, preconnect analytics ครบ

แต่มี **บั๊กเชิงสถาปัตยกรรม 2 จุดที่หักล้างงาน structured-data เกือบทั้งหมด** และ **ปัญหา entity/แบรนด์ที่ไม่นิ่ง** ซึ่งกระทบทั้ง E-E-A-T, Local SEO และการถูกอ้างอิงใน AI search โดยตรง

| # | ปัญหา | ระดับ | สถานะ | ผลกระทบ |
|---|-------|:----:|:----:|---------|
| 1 | `jsonLd` รายหน้า **แทนที่** (ไม่ใช่รวม) Organization+WebSite กลาง → หน้าแรก + money page **ไม่มี** entity schema เลย | 🔴 P0 | ✅ | Entity/GEO/Knowledge Graph |
| 2 | โลโก้ใน structured data ชี้ไฟล์ที่ไม่มีจริง — `/favicon.svg` และ `/favicon.png` ตอบ 404 | 🔴 P0 | ✅ | Structured data ใช้ไม่ได้ |
| 3 | ชื่อแบรนด์ไม่นิ่ง — "เสื้อแท้" / "ธน พลัส 153" / "Thana Plus 153" ปนกันทั้งไซต์ | 🟠 P1 | ✅ | Entity confusion, NAP, E-E-A-T |
| 4 | หน้า `/products` พุ่งเป้าคำอังกฤษ ("Our Portfolio") ฝัง keyword ไทยไว้หลัง | 🟠 P1 | ✅ | On-page keyword targeting |
| 5 | Organization/WebSite schema ขาด `sameAs` / `contactPoint` (ไม่มีสัญญาณ entity) | 🟠 P1 | ✅ | GEO/Knowledge Graph |
| 6 | คั่น `<title>` ด้วยเว้นวรรค 2 ตัว ไม่มี separator | 🟡 P2 | ✅ | CTR / ความชัดของแบรนด์ใน SERP |
| 7 | พึ่ง FAQPage rich results ที่ Google ยกเลิกไปแล้ว (7 พ.ค. 2026) | 🟡 P2 | ➖ รับทราบ | ตั้งความคาดหวังผิด |
| 8 | Product schema บาง — ขาด field ที่ Merchant listing แนะนำ + ไม่มี review/rating | 🟡 P2 | ✅ บางส่วน | Rich result (สินค้า) |
| 9 | ต้องยืนยันว่า `SITE_URL` ชี้โดเมน production จริง | 🟡 P2 | ✅ | Canonical/sitemap/OG ทั้งไซต์ |
| 10 | OG image ไม่มี `alt` / `width` / `height` | 🟡 P2 | ✅ | CTR ตอนแชร์ |
| 11 | Internal linking แบบ pillar–cluster ยังไม่เชื่อม money page เต็มที่ | 🟡 P2 | ✅ | การกระจาย authority |

> **ลำดับลงมือ:** ~~แก้ #1 และ #2 ก่อน (รากเดียวกัน, ไฟล์เดียว `SEO.astro`) จากนั้น #3 #4 #5~~ — ✅ ทำครบแล้ว (2 รอบ) เหลือเก็บ P2 (#6 #8 #10 #11)

> **ไฟล์ที่แก้ไปแล้ว (2026-06-08):** `src/components/SEO.astro` · `src/components/RelatedServices.astro` (ใหม่) · `src/pages/services.astro` · `src/pages/blog/[...slug].astro` · `src/pages/products/index.astro` · `src/pages/products/[...slug].astro` · `src/components/Navbar.astro` · `src/consts.ts` · `public/og-default.png` (บีบ 1.5MB→131KB) · (`.env` ตั้ง `SITE_URL` แล้ว)

---

## 🔴 P0 — ตัวบล็อก (แก้ก่อน)

### 1. `jsonLd` รายหน้า "แทนที่" Organization+WebSite กลาง — หน้าแรกและ money page ไม่มี entity schema

> ✅ **แก้แล้ว (2026-06-08)** — `SEO.astro` เปลี่ยน `jsonLd ?? defaultJsonLd` → `[...defaultJsonLd, ...pageLd]` (รวม ไม่ใช่แทนที่) + ใส่ `@id: /#organization` ให้ Organization · `blog/[...slug].astro` เปลี่ยน `publisher` เป็น `{ "@id": ".../#organization" }` (กัน node ซ้ำ) · **ยืนยัน:** `grep "@type":"WebSite"` ใน dist เจอ **38/38 หน้า** (เดิม 19) รวมหน้าแรก/services/products/บทความ

**ปัญหา**
`src/components/SEO.astro:63`
```astro
const structuredData = jsonLd ?? defaultJsonLd;
```
ตรรกะ `??` หมายความว่า **ถ้าหน้าไหนส่ง `jsonLd` มา → `defaultJsonLd` (Organization + WebSite) จะไม่ถูก render เลย** หน้าที่ส่ง `jsonLd` ก็คือหน้าสำคัญทั้งหมด: หน้าแรก (ส่ง FAQ), `/services` (Service+Breadcrumb+FAQ), `/products` (ItemList), หน้าสินค้า (Product), บทความบล็อก (BlogPosting)

ผลคือ Organization + WebSite schema ไปโผล่เฉพาะ **19 หน้าที่ค่าต่ำที่สุด** (tag/category/blog index) ส่วนหน้าที่ควรนิยาม entity มากที่สุด (หน้าแรก + money page) กลับ **ไม่มีเลย**

**ทำไมสำคัญ**
Organization + WebSite คือ schema ที่ "นิยามตัวตนแบรนด์" ให้ search engine และ LLM crawler — เป็นฐานของ Knowledge Graph และการถูกอ้างอิงใน AI Overviews/ChatGPT (ดู skill: *"be cited not just ranked, entity/brand presence"*) การที่หน้าแรกไม่มี Organization คือการทิ้งสัญญาณ entity ที่แรงที่สุดของทั้งไซต์

**หลักฐาน (จาก dist ที่ build จริง)**
```
grep '"@type":"WebSite"' dist/**/index.html
→ เจอเพียง 19 ไฟล์: tag/* (14), category/* (4), blog/index
→ ไม่เจอใน: index.html (หน้าแรก), services/, products/, products/*, blog/*
```

**วิธีแก้** — ให้ Organization+WebSite render **ทุกหน้าเสมอ** แล้ว "ต่อท้าย" ด้วย jsonLd รายหน้า (รวม ไม่ใช่แทนที่)
```astro
// src/components/SEO.astro — เปลี่ยนบรรทัด 63-64
const pageLd = jsonLd
  ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd])
  : [];
// Organization+WebSite ออกทุกหน้า + schema เฉพาะหน้า (ถ้ามี) ต่อท้าย
const ldArray = [...defaultJsonLd, ...pageLd];
```
**ข้อแนะนำเสริม (กัน node ซ้ำ):** ใส่ `@id` ให้ Organization (เช่น `"@id": new URL('/#organization', Astro.site)`) แล้วใน BlogPosting `publisher` / Product `brand` ให้อ้างด้วย `{ "@id": ".../#organization" }` แทนการประกาศ Organization ซ้ำ — Google จะ merge เป็น entity เดียว สะอาดกว่า

**ความสำคัญ:** 🔴 P0 — root cause เดียวกับ #2 แก้ทีเดียวจบทั้งคู่

---

### 2. โลโก้ใน structured data ชี้ไฟล์ที่ไม่มีจริง (404)

> ✅ **แก้แล้ว (2026-06-08)** — import `@/assets/logo.png` ผ่าน `astro:assets` แล้วใช้ `.src` (path ที่ hash จริง) ทั้งใน `SEO.astro` (Organization `logo`) และ `services.astro` (LocalBusiness `image`) · เลือก `logo.png` (โลโก้สี่เหลี่ยมจัตุรัส พื้นโปร่ง) ตามโบนัสของ audit แทน favicon · **ยืนยัน:** ไม่เหลือ string `/favicon.svg` `/favicon.png` ใน dist JSON-LD (= 0), โลโก้ชี้ `/_astro/logo.<hash>.png`

**ปัญหา**
- `src/components/SEO.astro:43` — Organization `logo` ชี้ `/favicon.svg`
  ```astro
  logo: new URL('/favicon.svg', Astro.site).toString(),
  ```
- `src/pages/services.astro:74` — LocalBusiness `image` ชี้ `/favicon.png`
  ```astro
  image: new URL('/favicon.png', Astro.site).toString(),
  ```
ทั้งสองไฟล์ **ไม่มีอยู่จริงที่ root ของเว็บ** — favicon จริงอยู่ที่ `src/assets/favicon.png` ซึ่ง Astro hash เป็น `/_astro/favicon.xxxx.png` ส่วน `public/` มีแค่ `og-default.png` ไฟล์เดียว

**ทำไมสำคัญ**
`logo`/`image` ที่ 404 ทำให้ Rich Results Test/Schema validator ตีว่า invalid และ Google มองข้ามรูปโลโก้ของแบรนด์ (กระทบการแสดงโลโก้ใน Knowledge Panel / ผลการค้นหา)

**หลักฐาน**
```
Test-Path dist/favicon.svg → False
ไฟล์ใน dist root: 404.html, blog-previews.json, index.html, og-default.png,
                  robots.txt, rss.xml, sitemap-*.xml   ← ไม่มี favicon.svg/.png
grep '/favicon.png' dist/services/index.html → เจอ (URL ที่ 404 ถูกฝังใน JSON-LD จริง)
```
หมายเหตุ: `src/pages/blog/[...slug].astro:40` ทำ **ถูกแล้ว** — `import favicon from '@/assets/favicon.png'` แล้วใช้ `favicon.src` (ได้ path ที่ hash จริง) ใช้วิธีเดียวกันนี้กับอีกสองจุด

**วิธีแก้** — import ผ่าน `astro:assets` แล้วใช้ `.src` (ให้สอดคล้องกับ blog)
```astro
// src/components/SEO.astro (frontmatter)
import favicon from '@/assets/favicon.png';
// ...
logo: new URL(favicon.src, Astro.site).toString(),
```
```astro
// src/pages/services.astro (frontmatter)
import logoImg from '@/assets/logo.png';     // โลโก้จริง เหมาะกับ LocalBusiness image มากกว่า favicon
// ...
image: new URL(logoImg.src, Astro.site).toString(),
```
**ทางเลือก:** ถ้าอยากใช้ URL คงที่ (`/favicon.svg`) ให้วางไฟล์จริงไว้ที่ `public/favicon.svg` — ปัจจุบันยังไม่มี
**โบนัส:** schema `logo`/`image` ที่ดีควรเป็นภาพ **สี่เหลี่ยมจัตุรัส ≥112×112px** (favicon เล็กไป) — แนะนำใช้ `logo.png` หรือทำไฟล์โลโก้เฉพาะ

**ความสำคัญ:** 🔴 P0

---

## 🟠 P1 — สำคัญสูง

### 3. ชื่อแบรนด์ไม่นิ่งทั้งไซต์ (entity confusion / NAP)

> ✅ **แก้แล้ว (2026-06-08)** — คง `name: 'เสื้อแท้'` เป็นชื่อหลัก แล้วผูกชื่อทั้งหมดเป็น entity เดียวผ่าน schema: เพิ่ม `legalName: 'บริษัท ธน พลัส 153 จำกัด'` + `alternateName: ['ธน พลัส 153','Thana Plus 153']` ใน Organization (`SEO.astro`) และ LocalBusiness (`services.astro`) · แก้ `Navbar.astro` `alt="Thana Plus"` → `"เสื้อแท้ ธน พลัส 153"` · แปล testimonials ใน `/products` เป็นไทย (`"Thana Plus"` → `"เสื้อแท้"`) · *เนื้อหา body/บทความที่ใช้ "ธน พลัส 153" คงไว้ — ถูกต้องและเสริม entity*

**ปัญหา** มีชื่อแบรนด์อย่างน้อย 4 แบบปนกัน:
| ที่ | ชื่อที่ใช้ |
|-----|-----------|
| `src/consts.ts` `SITE.name`, `<title>` ทุกหน้า, Organization schema | **เสื้อแท้** |
| `src/pages/index.astro` FAQ, บทความ (เช่น `premium-tshirt.md:29`) | **ธน พลัส 153 / บริษัท ธน พลัส 153 จำกัด / Thana Plus 153** |
| `src/components/Navbar.astro:18-20` | โลโก้ alt=**"Thana Plus"** + ข้อความ=**"เสื้อแท้"** |
| `products/index.astro` testimonials | **Thana Plus** (รีวิวภาษาอังกฤษ) |

**ทำไมสำคัญ**
Google สร้าง entity จากความสอดคล้องของชื่อ + NAP (Name/Address/Phone) ทั่วเว็บ ชื่อที่กระจัดกระจายทำให้ระบบไม่มั่นใจว่าหน้าเหล่านี้เป็นแบรนด์เดียวกัน — กระทบ Knowledge Graph, Local SEO และ Trust (แกนกลางของ E-E-A-T) โดยตรง สำหรับ AI search การมีชื่อ entity ที่ชัดและซ้ำสม่ำเสมอคือปัจจัยถูกอ้างอิง

**วิธีแก้**
1. เลือก **ชื่อ canonical หนึ่งชื่อ** (แนะนำใช้ชื่อนิติบุคคลจริงเป็นหลัก เช่น *"ธน พลัส 153"* และให้ "เสื้อแท้" เป็นชื่อแบรนด์/ร้าน) แล้วใช้ให้ตรงกันทุกที่: `<title>` brand, Organization/LocalBusiness `name`, โลโก้ alt, testimonials, เนื้อหา
2. ใส่ทั้งสองชื่ออย่างเป็นทางการใน schema เพื่อให้ Google เชื่อมเป็น entity เดียว:
   ```astro
   // SEO.astro — Organization
   name: 'เสื้อแท้',
   legalName: 'บริษัท ธน พลัส 153 จำกัด',
   alternateName: ['ธน พลัส 153', 'Thana Plus 153'],
   ```
3. ให้ Navbar `alt` ตรงกับชื่อที่แสดง (เลี่ยง alt="Thana Plus" คู่กับข้อความ "เสื้อแท้")
4. พิจารณาแปล testimonials ใน `products/index.astro` เป็นไทย (เว็บ locale `th_TH` แต่รีวิวเป็นอังกฤษล้วน ดูไม่สอดคล้องกลุ่มเป้าหมาย)

**ความสำคัญ:** 🟠 P1

---

### 4. หน้า `/products` พุ่งเป้าคำอังกฤษ — ฝัง keyword ไทยไว้หลัง

> ✅ **แก้แล้ว (2026-06-08)** — `products/index.astro`: `title="ผลงานรับผลิตเสื้อ ตัวอย่างงานสกรีนและตัดเย็บ"` (นำด้วยคีย์เวิร์ดไทย), `<h1>` นำด้วย "ผลงานรับผลิตเสื้อ" คง "Our Portfolio" เป็น subtitle, `description` นำด้วยคีย์เวิร์ด + แบรนด์ · **ยืนยัน:** `dist/products/index.html` `<title>`/`<h1>` ขึ้นต้นด้วย "ผลงานรับผลิตเสื้อ"

**ปัญหา**
`src/pages/products/index.astro:26,32`
```astro
title="Our Portfolio - ผลงานของเรา"      // → <title> เริ่มด้วย "Our Portfolio"
<h1>Our Portfolio</h1>                    // H1 เป็นอังกฤษล้วน
```
rendered: `<title>Our Portfolio - ผลงานของเรา  เสื้อแท้</title>`

**ทำไมสำคัญ**
ตาม `CLAUDE.md` ของโปรเจกต์เอง: *"Money/landing pages must lead the `title` prop with the page's primary target keyword"* หน้านี้คือ catalog/ผลงาน ซึ่งเป็นทางเข้าหลัก แต่กลับนำด้วย "Our Portfolio" (คนไทยแทบไม่ค้น) keyword ไทยอย่าง "ผลงานผลิตเสื้อ / รับผลิตเสื้อ" ถูกผลักไปท้าย และ `<h1>` ที่ไม่ตรง `<title>` ยังเสี่ยงให้ Google rewrite title เอง

**วิธีแก้**
```astro
// products/index.astro
title="ผลงานรับผลิตเสื้อ ตัวอย่างงานสกรีนและตัดเย็บ"
description="รวมผลงานรับผลิตเสื้อยืด โปโล และงานสกรีนจาก เสื้อแท้ (ธน พลัส 153) ..."
// แล้วเปลี่ยน H1 ให้ตรงกัน + คงคำอังกฤษเป็น subtitle ได้
<h1>ผลงานรับผลิตเสื้อ <span class="...">Our Portfolio</span></h1>
```
ใส่ keyword หลักใน `<title>`, `<h1>`, และ `description` ให้ตรงกัน แล้วยืนยันใน **`dist/products/index.html`** ที่ build แล้ว (ไม่ใช่ดู source)

**ความสำคัญ:** 🟠 P1

---

### 5. Organization/WebSite ขาดสัญญาณ entity (`sameAs`, `contactPoint`)

> ✅ **แก้แล้ว (2026-06-08)** — `SEO.astro`: Organization เพิ่ม `sameAs: [SITE.contact.lineLink]` (LINE) + `contactPoint` (sales/TH/th) · WebSite เพิ่ม `inLanguage: 'th-TH'` + `publisher: { "@id": ".../#organization" }` · ลบ twitter `@astrotshirt` ที่เป็น placeholder ออก (`consts.ts` `social` + field `site` ใน `SEO.astro`) · **ยืนยัน:** dist มี sameAs/contactPoint/inLanguage และ `twitter:site`/`astrotshirt` = 0 · *ยังเพิ่ม Facebook/IG ใน `sameAs` ได้เมื่อมี URL จริง*

**ปัญหา**
Organization schema ใน `SEO.astro:37-61` มี name/url/logo/telephone/email/address แต่ **ไม่มี `sameAs`** (ลิงก์โปรไฟล์โซเชียล) และไม่มี `contactPoint` ทั้งที่ `SITE.contact` มี LINE (`@thanaplus`) และเบอร์อยู่แล้ว WebSite ก็ไม่มี `publisher`/`inLanguage`

**ทำไมสำคัญ**
`sameAs` คือสัญญาณ entity ที่แรงที่สุดอันหนึ่งสำหรับ Knowledge Graph และ GEO — มันบอก Google ว่าแบรนด์นี้ = เพจ Facebook/LINE/IG เดียวกัน ช่วยรวม authority ข้ามแพลตฟอร์ม (สัญญาณ Google ยืนยัน; ผลต่อ AI citation = vendor-reported)

**วิธีแก้**
```astro
// SEO.astro — เพิ่มใน Organization object
sameAs: [
  'https://line.me/R/ti/p/%40thanaplus',
  // 'https://www.facebook.com/...',   // ใส่เพจจริง
  // 'https://www.instagram.com/...',
],
contactPoint: {
  '@type': 'ContactPoint',
  telephone: SITE.contact.phone,
  contactType: 'sales',
  areaServed: 'TH',
  availableLanguage: ['th'],
},
// WebSite — เพิ่ม
inLanguage: 'th-TH',
```
> หมายเหตุ: `twitter.site = '@astrotshirt'` ใน `consts.ts` ดูเป็น placeholder — ยืนยันว่ามี account จริงไหม ถ้าไม่มีให้ลบออกหรือแก้ให้ตรงของจริง

**ความสำคัญ:** 🟠 P1

---

## 🟡 P2 — ปรับปรุง / เก็บรายละเอียด

### 6. `<title>` คั่นด้วยเว้นวรรค 2 ตัว ไม่มี separator

> ✅ **แก้แล้ว (2026-06-08)** — `SEO.astro` เปลี่ยนเป็น `` `${title} | ${SITE.name}` `` · **ยืนยัน:** dist เช่น `<title>โรงงานผลิตเสื้อผ้า ... ออกแบบฟรี | เสื้อแท้</title>`

`SEO.astro:29` — `` `${title}  ${SITE.name}` `` → rendered `...ออกแบบฟรี  เสื้อแท้` ควรใช้ separator ชัด ๆ เพื่อแยกหัวข้อกับแบรนด์ใน SERP
```astro
const pageTitle = title ? `${title} | ${SITE.name}` : SITE.title;
// หรือใช้ — (em dash) ให้เข้ากับสไตล์ SITE.title เดิม
```
**ความสำคัญ:** 🟡 P2 (CTR/ความสวยงาม)

### 7. พึ่ง FAQPage rich results ที่เลิกใช้แล้ว
โปรเจกต์ลงทุน FAQPage JSON-LD เยอะมาก (หน้าแรก/services/สินค้า/บทความ ผ่าน `buildFaqJsonLd`) — โครงสร้าง **ถูกต้องสมบูรณ์** แต่ต้องรู้ว่า **Google ปิด FAQ rich results ตั้งแต่ 7 พ.ค. 2026** (วันนี้ 8 มิ.ย. 2026 = เลยมาแล้ว) ดังนั้น **จะไม่ได้ accordion ดาว ๆ ใน SERP อีกต่อไป**
- ✅ **ไม่ต้องลบ** — markup ยังช่วย AI/LLM แยกแยะคำถาม-คำตอบได้ (คนละเรื่องกับ rich result)
- ⚠️ **อย่าลงทุนเพิ่ม** เพื่อหวัง rich result และอย่าโฆษณาผลลัพธ์นี้กับลูกค้า
**ความสำคัญ:** 🟡 P2 (ตั้งความคาดหวังให้ถูก)

### 8. Product schema บาง — ขาด field ที่ Merchant listing แนะนำ

> ✅ **แก้บางส่วน (2026-06-08)** — เพิ่ม `priceValidUntil: '2026-12-31'` ใน `Offer` (`products/[...slug].astro`) · **ไม่ทำ:** `shippingDetails`/`hasMerchantReturnPolicy` (เว็บไม่มี checkout + ไม่มีข้อมูลนโยบายจริง) และ `aggregateRating`/`review` (ห้ามปั้น — testimonials บนหน้าเป็น placeholder) · ทำเมื่อมีข้อมูลจริง

`products/[...slug].astro:34-43` — `Offer` มี price/currency/availability/condition แต่ขาด `priceValidUntil`, `shippingDetails`, `hasMerchantReturnPolicy` และทั้ง Product ไม่มี `aggregateRating`/`review` (ทั้งที่หน้า portfolio มี testimonials อยู่แล้ว — ย้ายมาเป็น `Review` ได้)
```astro
offers: {
  '@type': 'Offer',
  // ...ของเดิม
  priceValidUntil: '2026-12-31',
  // hasMerchantReturnPolicy / shippingDetails ตามนโยบายจริง
},
```
> ระวัง: `aggregateRating`/`review` ต้องมาจากรีวิว **ของจริงบนหน้านั้น** เท่านั้น (ห้ามปั้น) ไม่งั้นผิดนโยบายและโดน manual action
**ความสำคัญ:** 🟡 P2 (เป็น warning ไม่ใช่ error; optional)

### 9. ยืนยัน `SITE_URL` = โดเมน production จริง

> ✅ **ยืนยันแล้ว (2026-06-08)** — เจ้าของยืนยันว่า `xn--o3c1bj3b4bj8cd.com` คือโดเมนจริง และ `.env` ตั้ง `SITE_URL="https://xn--o3c1bj3b4bj8cd.com/"` แล้ว · **ยืนยัน:** canonical หน้าแรก = `https://xn--o3c1bj3b4bj8cd.com/`, `robots.txt`/sitemap ใน dist ใช้โดเมนนี้ → **ไม่ต้องแก้โค้ด**

`astro.config.mjs:14` default = `https://xn--o3c1bj3b4bj8cd.com/` (punycode ของโดเมนไทย) — ค่านี้คุม **canonical / sitemap / robots / OG ทั้งไซต์** ถ้าโดเมนจริงต่างจากนี้ → canonical ทุกหน้าผิดทันที (จะกลายเป็น P0)
- ✅ ตรวจว่า `.env` ตั้ง `SITE_URL` เป็นโดเมน production จริงตอน build deploy
- หลักฐาน: `dist/robots.txt` และ sitemap ตอนนี้ฝัง `xn--o3c1bj3b4bj8cd.com` — ต้องเป็นโดเมนเดียวกับที่ใช้งานจริง
**ความสำคัญ:** 🟡 P2 (เป็น verification ไม่ใช่บั๊กที่เห็นชัด — แต่ critical ถ้าตั้งผิด)

### 10. OG image ไม่มี `alt` / ขนาด

> ✅ **แก้แล้ว (2026-06-08)** — `SEO.astro` เพิ่ม `openGraph.image.alt` (+`twitter.imageAlt`) ทุกหน้า และ `width:1200`/`height:630`/`type:image/png` เฉพาะรูป default · บีบ `public/og-default.png` 1731×909/**1.5MB → 1200×630/131KB** ด้วย sharp (สำรองต้นฉบับไว้) · **ยืนยัน:** dist หน้าแรกมี og:image:alt/width/height + twitter:image:alt; หน้าสินค้ามี alt แต่ไม่ฝัง width 1200 (รูปคนละขนาด)

`SEO.astro:73-84` ส่ง OG image แต่ไม่ระบุ `image.alt`, `width`, `height` — เพิ่มได้ใน `openGraph.image` ของ `astro-seo` ช่วย accessibility ของการ์ดแชร์ + กันการ crop แปลก ๆ (`og-default.png` ขนาด ~1.5MB ใหญ่ไป แนะนำบีบให้ ~1200×630 < 300KB)
**ความสำคัญ:** 🟡 P2

### 11. Internal linking pillar–cluster ยังไม่เชื่อม money page เต็มที่

> ✅ **แก้แล้ว (2026-06-08)** — สร้าง component กลาง `RelatedServices.astro` (zero-JS) ใช้ท้ายบทความบล็อกทุกหน้า + ท้ายหน้าสินค้า ลิงก์ "ขึ้น" ไป `/services`, `/services#screen`, `/products` ด้วย anchor เชิงบรรยาย (เลี่ยง "คลิกที่นี่") + ปุ่มปรึกษา LINE · **ยืนยัน:** dist บทความ/หน้าสินค้า render บล็อก "บริการที่เกี่ยวข้อง" · *เลือก template approach — ไม่แก้เนื้อ .md รายบทความ; in-body contextual link ทำเพิ่มภายหลังได้*

`/services` คือ money pillar แต่บทความบล็อก/หน้าสินค้ายังไม่ลิงก์ "ขึ้น" ไป `/services` ด้วย anchor เชิงบรรยายอย่างสม่ำเสมอ (Navbar มี dropdown ลิงก์ลึกดีแล้ว ✅ แต่ contextual in-body link ทรงพลังกว่า footer/nav)
- เพิ่มลิงก์ในเนื้อบทความ → `/services` ด้วย anchor หลากหลาย เช่น "รับผลิตเสื้อครบวงจร", "งานสกรีน DTG/DTF" (เลี่ยง "คลิกที่นี่")
- ให้แต่ละ cluster (บทความ) ลิงก์กลับ pillar ใน ~200–300 คำแรก
> ผลลัพธ์ ~+30% organic / อ้างอิง AI มากขึ้น = **vendor-reported (Zyppy/Ahrefs)** ไม่ใช่ตัวเลขที่ Google การันตี
**ความสำคัญ:** 🟡 P2 (leverage สูง, ความเสี่ยงต่ำ)

---

## ✅ สิ่งที่ทำได้ดีอยู่แล้ว (อย่าเผลอแก้)

- **SEO รวมศูนย์ถูกต้อง** — ทุกหน้าผ่าน `Layout → SEO.astro` ไม่มี `<meta>` กระจัดกระจาย, canonical + OG image เป็น absolute จาก `Astro.site` อัตโนมัติ
- **`<h1>` เดียวต่อหน้าครบทุก 39 หน้า** (ยืนยันด้วย grep) — heading hierarchy แกนหลักแข็งแรง
- **Title ของ money page หลักทำถูกตามกฎตัวเอง** — `/` และ `/services` นำด้วย keyword ไทย ("โรงงานรับผลิตเสื้อครบวงจร", "โรงงานผลิตเสื้อผ้า")
- **Sitemap ละเอียด** — ปรับ `priority`/`changefreq` รายหน้า, กรอง `/blog-previews.json`, draft ถูกกรองออกจาก getStaticPaths/RSS/listing
- **รูปภาพ** — ใช้ `astro:assets` `<Image>` ทุกที่, hero มี `loading=eager` + `fetchpriority=high` + `widths`/`sizes` (ดีต่อ LCP/CLS), แปลง WebP/AVIF อัตโนมัติ
- **Performance ของ third-party** — GA lazy-load จนผู้ใช้ interact/idle, preconnect analytics (ลด TBT/INP)
- **404 ตั้ง `noindex` ถูกต้อง**, robots กัน query string (`/*?`) กัน crawl budget/duplicate
- **Data-driven schema** — FAQ/Service สร้างจาก data ชุดเดียวกับที่แสดงบนหน้า (กัน schema drift) — สถาปัตยกรรมดีมาก

---

## ⛔ ตรวจไม่ได้จากในโค้ด (ต้องดูข้อมูลจริง)

หลักการ skill `/seo`: *"diagnose before prescribing — pull the actual data"* รายการนี้ออดิตจาก code/build เท่านั้น ยังต้องเปิดข้อมูลจริงเพิ่ม:
- **Google Search Console** — หน้าไหน index แล้ว/ถูกตัด, query ที่มี impression, หน้าที่ร่วงจาก top-5 ไป 8–20 (สัญญาณ content decay → refresh)
- **PageSpeed/CrUX field data** — INP (≤200ms), LCP (≤2.5s), CLS (≤0.1) ที่ p75 จากผู้ใช้จริง (โค้ดดูดีแต่ต้องวัด field)
- **โดเมนจริง** ตามข้อ #9
- **บัญชีโซเชียลจริง** สำหรับ `sameAs` (#5) และ Twitter handle (#5)

---

## ลำดับลงมือแนะนำ (ทำตามนี้)

1. ✅ **`SEO.astro`** — merge JSON-LD (#1), logo เป็น **`logo.png`** ผ่าน astro:assets (#2 — เลือก logo.png แทน `favicon.src`), เพิ่ม `legalName`/`alternateName` (#3) + `sameAs`/`contactPoint`/`inLanguage`/`publisher` (#5) · *separator (#6) ยังไม่ทำ = P2*
2. ✅ **`services.astro`** — LocalBusiness `image` → `logo.png` (#2) + `legalName`/`alternateName`/`sameAs` (#3)
3. ✅ **`products/index.astro`** — title/H1 นำด้วย keyword ไทย + แปล testimonials เป็นไทย (#4)
4. ✅ **ชื่อแบรนด์** — คง "เสื้อแท้" เป็นหลัก ผูก `legalName`/`alternateName` ใน schema + แก้ `Navbar` alt (#3) · *ไม่แตะ body/บทความ*
5. ✅ **เก็บ P2** — title separator (#6), Product schema +`priceValidUntil` (#8 บางส่วน), OG image alt/dims + บีบ og-default 1.5MB→131KB (#10), internal links `RelatedServices` (#11)
6. ✅ **ยืนยันใน `dist/**/*.html` ที่ build แล้ว** (ทำครบทุกข้อข้างต้น) — ก่อน deploy จริงควรรันผ่าน Google Rich Results Test อีกชั้น

---

*ออดิตนี้อิงหลักการจาก skill `/seo` (2025/2026 primary sources) — แยกชัดเจนระหว่างข้อเท็จจริงที่ Google ยืนยัน กับตัวเลข vendor-reported ทุกจุดที่กล่าวอ้าง*

# กฎการเขียนบทความบล็อก (`src/content/blog/`)

ไฟล์นี้คือคู่มือสำหรับ Claude Code และผู้เขียน เวลาสร้าง/แก้บทความใน `src/content/blog/`
ทุกบทความคือไฟล์ `.md` / `.mdx` ไฟล์เดียว — เพิ่มไฟล์ = เพิ่มบทความ ไม่ต้องแตะโค้ด
หน้าเพจ, หมวดหมู่, แท็ก, RSS และ SEO ถูกสร้างอัตโนมัติจาก frontmatter

> ดูตัวอย่างจริงที่ `clothing-brand-startup-guide.md` — ลอกโครงสร้างนั้นได้เลย

---

## 1. Frontmatter — บังคับครบทุกครั้ง

Schema อยู่ที่ `src/content.config.ts` (คอลเลกชัน `blog`) Zod จะ fail build ถ้าผิด

```yaml
---
title: "คู่มือเริ่มต้นสร้างแบรนด์เสื้อผ้า ฉบับสมบูรณ์"   # บังคับ — ดู §2
description: "คู่มือที่จะพาคุณไปทีละขั้นตอน ตั้งแต่ไอเดียจนถึงวันที่ขายได้จริง"  # บังคับ — ดู §2
author: "ทีมงาน Thana Plus 153"          # default: "ทีมงาน"
publishedAt: 2026-06-03                    # บังคับ — รูปแบบ YYYY-MM-DD
updatedAt: 2026-06-10                      # ออปชัน — ใส่เมื่อแก้เนื้อหาจริง (อัปเดต dateModified ใน JSON-LD)
category: "ธุรกิจ"                          # default: "Uncategorized" — ดู §3
tags: ["ธุรกิจ", "สร้างแบรนด์", "มือใหม่"]  # default: [] — ดู §3
cover: "@/assets/blogs/คู่มือเริ่มต้น.png" # ออปชัน แต่ "ควรมีเสมอ" — ดู §4
coverAlt: "ขั้นตอนการผลิตและสร้างแบรนด์เสื้อผ้าตั้งแต่ออกแบบจนถึงสกรีน"  # บังคับเมื่อมี cover
draft: false                               # default: false — true = ซ่อนจาก listing + RSS
---
```

กฎเหล็ก:
- **ห้ามทิ้ง `description` ว่างหรือมั่ว** — มันคือ meta description + OG + JSON-LD ทุกที่
- `publishedAt` / `updatedAt` ใช้ `z.coerce.date()` → เขียน `YYYY-MM-DD` พอ
- เปลี่ยนเนื้อหาหลังเผยแพร่ → เพิ่ม `updatedAt` (อย่าแก้ `publishedAt`)
- งานที่ยังเขียนไม่เสร็จ → `draft: true` กันหลุดขึ้นจริงและ RSS

---

## 2. `title` + `description` = ตัวชี้ขาด SEO

นี่คือสิ่งที่ผู้ใช้เห็นบน Google และ AI Overviews ก่อนคลิก เขียนให้คน ไม่ใช่เขียนยัดคีย์เวิร์ด

- `title`: ~50–60 ตัวอักษร ตรงประเด็น มีคีย์เวิร์ดหลักแต่อ่านลื่น
- `description`: ~120–155 ตัวอักษร สรุปคุณค่าบทความ ชวนคลิก หนึ่งประโยคจบ
- ห้าม `title`/`description` ซ้ำกับบทความอื่น — ต้องไม่ซ้ำทั้งไซต์
- `title` ในไฟล์ไม่ต้องต่อท้ายชื่อแบรนด์ — `Layout`/`SEO.astro` จัดการ template ให้แล้ว

---

## 3. `category` กับ `tags` — สร้างหน้าอัตโนมัติ จึงต้องสะกดให้นิ่ง

- ทุกค่า `category` สร้างหน้า `/category/<ชื่อ>` อัตโนมัติ (`src/pages/category/[category].astro`)
- ทุกค่า `tags` สร้างหน้า `/tag/<ชื่อ>` อัตโนมัติ (`src/pages/tag/[tag].astro`)
- ∴ **สะกดให้ตรงเป๊ะทุกบทความ** "ธุรกิจ" กับ "ธุรกิจ " (มีเว้นวรรค) = คนละหน้า = SEO แตก
- ก่อนตั้ง category/tag ใหม่ ให้เช็กบทความเดิมก่อนว่ามีคำนี้อยู่แล้วไหม แล้วใช้ซ้ำ
- หนึ่งบทความ = หนึ่ง `category` เดียว; `tags` ใส่ 3–5 คำกำลังดี อย่าสาดเยอะ
- คิดแบบ topic cluster: หลายบทความใน category เดียวกันที่ลิงก์หากัน = สร้าง authority

---

## 4. รูปปก (`cover`) — astro:assets เท่านั้น

- ต้องชี้ไปที่ไฟล์ใน `src/assets/` ผ่าน alias เช่น `@/assets/blogs/ชื่อไฟล์.png`
  Zod ใช้ helper `image()` → ได้ optimize เป็น WebP/AVIF + กัน CLS อัตโนมัติ
- **ห้าม** ใส่ URL ภายนอกหรือ path ใน `public/` — จะไม่ถูก optimize และพังต่อ LCP/SEO
- `coverAlt` ต้องบรรยายภาพจริง ไม่ใช่ก๊อป `title` มาวาง (alt ซ้ำ ๆ = เสียเปล่า)
- `cover` กลายเป็น OG image + `image` ใน Article JSON-LD โดยตรง → บทความควรมี cover เสมอ
- ขนาดแนะนำ ~1200×630 (อัตราส่วน OG) ตั้งชื่อไฟล์ให้สื่อความหมาย

---

## 5. โครงเนื้อหา Markdown

หน้าบทความเรนเดอร์ `<Content />` ในกล่อง `.prose` (`src/pages/blog/[...slug].astro`) —
เขียน Markdown ปกติ ระบบจัดสไตล์ให้

- **ห้ามใส่ `# H1` ในเนื้อหา** — `title` คือ H1 อยู่แล้ว (`ArticleHeader`) เริ่มหัวข้อที่ `## H2`
- โครงลำดับชั้นถูกต้อง: `##` → `###` ห้ามข้ามระดับ ช่วยทั้ง a11y และ SEO
- **ย่อหน้าแรกตอบคำถามทันที (answer-first)** — สรุปคำตอบ/คุณค่าในประโยคแรก ๆ
  เพื่อให้ AI Overviews/GEO หยิบไปอ้างได้ อย่าเกริ่นยาว
- ใช้ตาราง, bullet, `1.` ลำดับเลข, และ `>` blockquote เพื่อให้สแกนอ่านง่าย (ดูในไฟล์ตัวอย่าง)
- ปิดท้ายด้วยสรุป + CTA สั้น ๆ (เช่น ชวนปรึกษาทีมงาน)
- เนื้อหาเป็น "ภาษาไทย" ตามทั้งโปรเจกต์ เขียนให้ลึกและครอบคลุมหัวข้อจริง — ความลึกชนะคีย์เวิร์ด
- ลิงก์ภายในไปบทความ/หน้าสินค้าที่เกี่ยวข้อง (internal linking สร้าง topical authority)
- รูปในเนื้อหา: ถ้าต้องแทรกรูป ให้ตั้งไฟล์เป็น `.mdx` แล้ว `import { Image } from 'astro:assets'`
  — ห้าม `<img>` ดิบ (กระทบ LCP/SEO)

---

## 6. SEO ทำงานอัตโนมัติแค่ไหน (อย่าทำเอง)

ตั้งค่า frontmatter ให้ถูกแล้ว ที่เหลือ pipeline จัดให้ — **ห้ามเขียน `<meta>`/`<script>` เองในบทความ**

หน้า `blog/[...slug].astro` ทำให้แล้วทุกบทความ:
- ส่ง `title`, `description`, `cover` (เป็น OG image absolute URL), `type="article"` เข้า `Layout`
- สร้าง `BlogPosting` JSON-LD: headline, description, image, author, publisher,
  `datePublished` (จาก `publishedAt`), `dateModified` (จาก `updatedAt` ถ้ามี), `mainEntityOfPage`
- canonical + OG image derive จาก `Astro.site` ให้เอง

หน้าที่ของผู้เขียน = ป้อนข้อมูลที่ "ตรงกับเนื้อหาจริง" (no schema drift):
> ค่าใน JSON-LD ทุกตัวต้องปรากฏบนหน้าจริง อย่าให้ author/วันที่/หัวข้อใน meta
> ขัดกับเนื้อหาที่เห็น — Google penalize เรื่อง schema drift

ดูลึกได้ที่ skill `astro-seo` (`/seo`) และ `.claude/skills/astro-seo/reference/json-ld.md`

---

## 7. เช็กลิสต์ก่อนถือว่าเสร็จ

- [ ] `title` + `description` ครบ ไม่ซ้ำใคร ความยาวพอดี
- [ ] `publishedAt` ใส่แล้ว (และ `updatedAt` ถ้าเป็นการแก้)
- [ ] `category` + `tags` สะกดตรงกับที่ใช้อยู่เดิม (ไม่สร้าง duplicate)
- [ ] `cover` ชี้ `@/assets/...` + `coverAlt` บรรยายภาพจริง
- [ ] เนื้อหาเริ่มที่ `##` (ไม่มี `#`), ย่อหน้าแรกตอบคำถามทันที
- [ ] มี internal link ไปบทความ/สินค้าที่เกี่ยวข้อง
- [ ] ถ้ายังไม่พร้อมเผยแพร่ → `draft: true`
- [ ] `npx astro check` ผ่าน (frontmatter ตรง schema)

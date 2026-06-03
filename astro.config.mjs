// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import tailwindcss from '@tailwindcss/vite';

// TODO: เปลี่ยนเป็นโดเมนจริงของเว็บ (มีผลต่อ sitemap / robots / rss / canonical URL)
const SITE_URL = 'https://example.com';

// https://astro.build/config
export default defineConfig({
	// ใช้ static output (SSG) เป็นหลัก ตาม core stack
  output: 'static',
  site: SITE_URL,

  integrations: [
    // React island เฉพาะส่วน interactive (search/filter/form) เท่านั้น
    react(),
    // MDX สำหรับเนื้อหา content collections
    mdx(),
    // SEO: sitemap.xml อัตโนมัติ
    sitemap(),
    // SEO: robots.txt อัตโนมัติ (อ้างอิง sitemap ให้ด้วย)
    robotsTxt(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
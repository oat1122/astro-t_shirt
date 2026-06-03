// ค่าคงที่กลางของเว็บ — แก้ที่เดียว ใช้ได้ทั้งไซต์ (SEO, RSS, JSON-LD)
export const SITE = {
  name: 'Astro T-Shirt',
  title: 'Astro T-Shirt — เสื้อยืดดีไซน์พิเศษ',
  description: 'ร้านเสื้อยืดดีไซน์พิเศษ คุณภาพพรีเมียม สั่งง่าย ส่งไว',
  // ภาษาเริ่มต้นของไซต์
  lang: 'th',
  locale: 'th_TH',
  // รูป Open Graph เริ่มต้น (วางไฟล์จริงไว้ที่ public/og-default.png)
  defaultOgImage: '/og-default.png',
  // ข้อมูลองค์กรสำหรับ JSON-LD
  author: 'Astro T-Shirt',
  social: {
    twitter: '@astrotshirt',
  },
} as const;

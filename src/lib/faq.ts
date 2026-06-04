// Helper สร้าง FAQPage JSON-LD จากข้อมูล frontmatter (data-driven กัน schema drift)
// ใช้ shape เดียวกับ field `faq` ใน src/content.config.ts (question/answer เป็น string)

// หนึ่งคำถาม–คำตอบ — ตรงกับ schema ใน content.config.ts
export interface FaqItem {
  question: string;
  answer: string;
}

// คืน null ถ้าไม่มี/ว่าง เพื่อไม่ให้มี <script ld+json> ว่างหลุดออกมา
// ไม่งั้นคืน object FAQPage > mainEntity[] > Question > acceptedAnswer > Answer
export function buildFaqJsonLd(
  items?: FaqItem[],
): Record<string, unknown> | null {
  if (!items || items.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  };
}

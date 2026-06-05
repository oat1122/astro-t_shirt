# JSON-LD builders for Astro

All of these are plain objects you pass to the centralized SEO component via the `jsonLd` prop
(`<Layout jsonLd={...}>` → `SEO.astro` serializes them into static `<script type="application/ld+json">`).
Pass a single object or an array. Rendered at build = always crawler-visible.

**Golden rule — no schema drift.** Every value here (price, rating, answer text, hours) must also be
visible on the page. Inventing data in JSON-LD that the page doesn't show risks a manual penalty.

## Organization (default, site-wide)

Already emitted by default in `SEO.astro` when no `jsonLd` is passed. Enrich it:

```ts
const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: Astro.site?.toString(),
  logo: new URL('/favicon.svg', Astro.site).toString(),
  sameAs: [
    'https://www.facebook.com/yourpage',
    'https://www.instagram.com/yourhandle',
    'https://line.me/ti/p/@yourid',
  ],
};
```

## LocalBusiness (the local-SEO / map-pack winner)

Use on the contact/about page for a physical shop. Pick the most specific `@type`
(`ClothingStore`, `Store`, or `LocalBusiness`).

```ts
const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: SITE.name,
  image: new URL('/og-default.png', Astro.site).toString(),
  url: Astro.site?.toString(),
  telephone: '+66-XX-XXX-XXXX',
  priceRange: '฿฿',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'เลขที่ ... ถนน ...',
    addressLocality: 'ดุสิต',
    addressRegion: 'กรุงเทพมหานคร',
    postalCode: '10300',
    addressCountry: 'TH',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 13.77,
    longitude: 100.52,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
};
```

## Product (product detail pages)

Build from the product entry. Only include `offers`/`AggregateRating` if those values are on the page.

```ts
const product = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: entry.data.title,
  description: entry.data.description,
  image: new URL(ogImage, Astro.site).toString(), // resolved astro:assets src
  sku: entry.id,
  brand: { '@type': 'Brand', name: SITE.name },
  offers: {
    '@type': 'Offer',
    price: entry.data.price,            // THB, must match displayed price
    priceCurrency: 'THB',
    availability: entry.data.inStock
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
    url: canonical,
  },
};
```

## BreadcrumbList (pair with Product / nested pages)

```ts
const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: Astro.site?.toString() },
    { '@type': 'ListItem', position: 2, name: 'สินค้า', item: new URL('/products', Astro.site).toString() },
    { '@type': 'ListItem', position: 3, name: entry.data.title, item: canonical },
  ],
};
// pass both: jsonLd={[product, breadcrumb]}
```

## FAQPage (high-ROI rich result)

Build from an array so the JSON-LD and the visible accordion render from the *same* source — kills drift.

```ts
const faqs = [
  { q: 'สั่งขั้นต่ำกี่ตัว?', a: 'สั่งขั้นต่ำ 10 ตัวต่อแบบ ...' },
  { q: 'ใช้เวลาผลิตกี่วัน?', a: 'ปกติ 5–7 วันทำการ ...' },
  // aim for 15–30 — feeds both rich results and AI Overviews
];

const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};
```
Then render `{faqs.map(...)}` as the visible accordion from the same `faqs` array.

## Article (blog posts)

```ts
const article = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: entry.data.title,
  description: entry.data.description,
  image: entry.data.cover ? new URL(coverSrc, Astro.site).toString() : undefined,
  datePublished: entry.data.publishedAt.toISOString(),
  dateModified: (entry.data.updatedAt ?? entry.data.publishedAt).toISOString(),
  author: { '@type': 'Person', name: entry.data.author },
  publisher: {
    '@type': 'Organization',
    name: SITE.name,
    logo: { '@type': 'ImageObject', url: new URL('/favicon.svg', Astro.site).toString() },
  },
};
```

## WebSite (+ optional Sitelinks Searchbox)

```ts
const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.name,
  url: Astro.site?.toString(),
  // include ONLY if a real /search?q= endpoint exists:
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: new URL('/search?q={q}', Astro.site).toString() },
    'query-input': 'required name=q',
  },
};
```

## Validate

- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org validator: https://validator.schema.org/
- Inspect built HTML (`npm run build && npm run preview`) — confirm the `<script type="application/ld+json">` is present in the *static* source, not added by JS.

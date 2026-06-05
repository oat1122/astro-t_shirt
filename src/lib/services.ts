// แหล่งข้อมูลบริการชุดเดียวของหน้า /services (data-driven กัน schema drift)
// ใช้ทั้งใน ServiceGrid (การ์ดที่ "เห็นบนหน้า") และ services.astro (hasOfferCatalog
// ใน Service JSON-LD) เพื่อให้ structured data ตรงกับเนื้อหาเสมอ
//
// หมายเหตุ: `icon` ต้องเป็นชื่อที่มีจริงใน src/components/Icon.astro (ICONS)
// `as const` ช่วยคง literal type ให้ตรวจสอบกับ keyof ICONS ได้ตอน type-check

export const SERVICES = [
  {
    icon: 'building-factory-2',
    title: 'รับผลิตเสื้อครบวงจร',
    description: 'OEM/ODM ครบจบในที่เดียว ตั้งแต่เลือกผ้า ตัดเย็บ สกรีน QC ไปจนถึงแพ็คและจัดส่ง',
    points: ['ยอดสั่งผลิตยืดหยุ่น', 'ควบคุมคุณภาพทุกขั้นตอน', 'รองรับงานจำนวนมาก'],
    printing: false,
    key: null,
  },
  {
    icon: 'scissors',
    title: 'ตัดเย็บตามแบบ',
    description: 'ขึ้นแพทเทิร์นและตัดเย็บตามดีไซน์ เลือกทรง คอ แขน และเนื้อผ้าได้อย่างอิสระ',
    points: ['เลือกเนื้อผ้าได้หลากหลาย', 'มีงานปักตามแบบ', 'ทำตัวอย่างก่อนผลิตจริง'],
    printing: false,
    key: null,
  },
  {
    icon: 'palette',
    title: 'งานสกรีน ซิลค์สกรีน',
    description: 'สกรีนบล็อกสีสด ทนทาน คุ้มค่าเมื่อผลิตจำนวนมาก เหมาะกับลายไม่กี่สี',
    points: ['สีสดคงทน', 'ต้นทุนต่อตัวต่ำเมื่อสั่งเยอะ', 'สกรีนฟรี 1 จุด เมื่อครบ 100 ตัว'],
    printing: true,
    key: 'silk',
  },
  {
    icon: 'printer',
    title: 'งานพิมพ์ดิจิทัล DTG / DTF',
    description: 'พิมพ์ลายได้ไม่จำกัดสี เก็บรายละเอียดคมชัด ไม่ต้องเสียค่าทำบล็อกสกรีน',
    points: ['เหมาะกับลายซับซ้อน/ภาพถ่าย', 'สั่งจำนวนน้อยก็ผลิตได้', 'ไล่เฉดสีได้เนียน'],
    printing: true,
    key: 'dtg',
  },
  {
    icon: 'droplet',
    title: 'งานพิมพ์ Sublimation',
    description: 'สีซึมเข้าเนื้อผ้า ระบายอากาศดี ไม่ลอกไม่แตก เหมาะกับเสื้อกีฬาและยูนิฟอร์ม',
    points: ['พิมพ์เต็มตัวแบบ all-over ได้', 'น้ำหนักเบา ใส่สบาย', 'สีไม่ตกแม้ซักบ่อย'],
    printing: true,
    key: 'sublimation',
  },
  {
    icon: 'pencil',
    title: 'ออกแบบฟรี (Design Free)',
    description: 'ทีมดีไซน์ช่วยขึ้นแบบและจัดวางลายให้ฟรี พร้อมให้คำปรึกษาในทุกขั้นตอน',
    points: ['ปรับแก้แบบจนพอใจ', 'แนะนำเทคนิคที่เหมาะกับงาน', 'ดูตัวอย่างก่อนตัดสินใจ'],
    printing: false,
    key: null,
  },
] as const;

export type Service = (typeof SERVICES)[number];

// สิทธิพิเศษ 4 ด้าน
export const PRIVILEGES = [
  {
    key: 'design',
    title: 'Design Free',
    description: 'บริการช่วยออกแบบ',
  },
  {
    key: 'screen',
    title: 'Screen Free',
    description: 'สกรีนฟรี จำนวน 1 จุด',
  },
  {
    key: 'shipping',
    title: 'Shipping Free',
    description: 'บริการจัดส่งฟรี',
  },
  {
    key: 'consult',
    title: 'Consult Free',
    description: 'ให้คำปรึกษาฟรี',
  },
] as const;

// จุดเด่น/ทำไมต้องเลือกเรา
export const WHY_CHOOSE_US = [
  {
    icon: 'trophy',
    title: 'มาตรฐาน QPC (Quality, Price, Control)',
    desc: 'ควบคุมคุณภาพทุกขั้นตอน (Quality) ราคาคุ้มค่าสมเหตุสมผล (Price) และสามารถควบคุมระยะเวลาการผลิตให้ตรงตามกำหนด (Control)',
  },
  {
    icon: 'building-factory-2',
    title: 'กำลังผลิตสูง รองรับทุกสเกล',
    desc: 'มีโรงงานผลิตและเครื่องจักรที่ทันสมัยของตัวเอง รองรับการผลิตจำนวนมาก พร้อมทีมช่างตัดเย็บผู้เชี่ยวชาญ',
  },
  {
    icon: 'heart-handshake',
    title: 'ประสบการณ์ยาวนานกว่า 10 ปี',
    desc: 'ได้รับความไว้วางใจจากแบรนด์เสื้อผ้าและองค์กรชั้นนำมากมาย การันตีด้วยผลงานจริง',
  },
] as const;

// เซิร์ฟเวอร์สำหรับ deploy บน Plesk (Node.js / Passenger)
// โปรเจกต์นี้เป็น Astro static (SSG) — แค่เสิร์ฟไฟล์ใน dist/ ที่ build ออกมา
// ก่อน deploy ต้องรัน `npm run build` ให้ได้โฟลเดอร์ dist/ ก่อน
// ใช้ ESM ตาม "type": "module" ใน package.json
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = parseInt(process.env.PORT, 10) || 3000;
const distDir = path.join(__dirname, "dist");

const app = express();

// เสิร์ฟไฟล์ static จาก dist/ (Astro สร้างเป็น /path/index.html ให้อยู่แล้ว)
app.use(
  express.static(distDir, {
    extensions: ["html"],
  }),
);

// ไม่เจอ route ไหน → คืนหน้า 404 ของ Astro
app.use((req, res) => {
  res.status(404).sendFile(path.join(distDir, "404.html"), (err) => {
    if (err) res.status(404).send("Not Found");
  });
});

app.listen(port, () => {
  console.log(`> Ready on http://localhost:${port}`);
});

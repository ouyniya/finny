/*
วิธีนี้เก็บข้อมูลใน Memory ของ Process นั้น ถ้า Vercel หรือ Server มีหลาย Instance, หรือมีการ Scale Auto, แต่ละ Instance จะมีข้อมูลของตัวเอง แยกกัน ไม่เหมาะกับระบบ Production ขนาดใหญ่

ถ้าอยากทำ Production จริง ควรใช้ Redis, Upstash, หรือ External Service สำหรับเก็บ State
*/

const limiter = new Map<string, { count: number; time: number }>();

const RATE_LIMIT = 10;
const TIME_WINDOW = 60 * 1000; // 1 min

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = limiter.get(ip);

  if (record && now - record.time < TIME_WINDOW) {
    if (record.count >= RATE_LIMIT) {
      return false;
    } else {
      record.count += 1;
      return true;
    }
  } else {
    limiter.set(ip, { count: 1, time: now });
    return true;
  }
}

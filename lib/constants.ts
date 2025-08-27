import { FormData } from "@/types/retire";

export const initialMarketDataInputs = [
  {
    id: "asset-1",
    name: "เงินฝากและตราสารหนี้ระยะสั้น",
    expectedReturn: 0.0098,
    volatility: 0.0017,
  },
  {
    id: "asset-2",
    name: "ตราสารหนี้ภาครัฐ",
    expectedReturn: 0.0136,
    volatility: 0.0098,
  },
  {
    id: "asset-3",
    name: "หุ้นกู้",
    expectedReturn: 0.0175,
    volatility: 0.0104,
  },
  { id: "asset-4", name: "หุ้น", expectedReturn: 0.0459, volatility: 0.1475 },
  {
    id: "asset-5",
    name: "การลงทุนทางเลือก",
    expectedReturn: 0.0054,
    volatility: 0.1453,
  },
];

export const RISK_FREE_RATE = 0.015;
export const MAX_EXPECTED_RETURN = 100;
export const MIN_VOLATILITY = 0.01;
export const INVESTMENT_AMOUNT = 100000;
export const INVESTMENT_HORIZON = 5;
export const SIMULATION_ROUND = 1000000;
export const OPTIMIZATION_ROUND = 10;

export const INITIAL_COLORS = [
  "#0088FE",
  "#00C49F",
  "#8873d8",
  "#bb94ef",
  "#8884D8",
  "#82CA9D",
];

export const GAMES = [
  {
    title: "เกมส์จัดพอร์ต",
    content: "คำนวณและหาพอร์ตลงทุนที่เหมาะสม",
    link: "/game/portfolio",
    url: "/images/game/investicon.jpg",
  },
  {
    title: "เกมส์วางแผนเกษียณ",
    content: "สร้างอนาคตที่มั่นคงด้วยการวางแผนที่ดี",
    link: "/game/retire",
    url: "/images/game/retireicon.jpg",
  },
  {
    title: "เกมส์ Partial Swing Pricing",
    content: "เข้าใจกลไกของ Partial Swing Pricing",
    link: "/game/swing-pricing",
    url: "/images/game/swing-pricing.jpg",
  },
];

export const INITIAL_RETIREMENT_DATA: FormData = {
  age: 30,
  salary: 30000,
  saving: 15000,
  retireAge: 60,
  lifestyle: "medium",
  portfolio: {
    stock: 60,
    bond: 30,
    cash: 10,
  },
};

export const definition = [
  {
    word: `Swing Factor คืออะไร`,
    definition: `คือค่าที่บริษัทจัดการกองทุนกำหนด ควรเท่ากับต้นทุนการทำธุรกรรมที่กองทุนต้องจ่าย เช่น ค่าคอมมิชชั่น Bid-Ask Spread, Market Impact โดยทั่วไปไม่เกิน 2–3% ของ NAV และขึ้นอยู่กับสภาพตลาดและสินทรัพย์ในพอร์ต เป็นต้น (เช่น กองทุนที่ลงทุนในสินทรัพย์สภาพคล่องต่ำอาจมี swing factor สูงกว่า)`,
  },
  {
    word: `First Mover Advantage`,
    definition: `เกิดขึ้นเมื่อมีการขายคืนจำนวนมาก ผู้ที่ขายคืนก่อนจะได้รับ NAV ที่สูงกว่า ซึ่งไม่สะท้อนถึงต้นทุนการขายสินทรัพย์ที่เกิดขึ้นภายหลัง ทำให้ผู้ลงทุนที่เหลือต้องรับภาระ`,
  },
  {
    word: `Dilution (การเจือจาง)`,
    definition: `มูลค่าหน่วยลงทุนของกองทุนลดลงเนื่องจากต้นทุนการทำธุรกรรมจากการเข้า-ออกของเงินลงทุน ส่งผลกระทบต่อผู้ลงทุนเดิมที่ยังถือหน่วยลงทุนอยู่`,
  },
  {
    word: `Swing Threshold`,
    definition: `เป็นระดับกระแสเงินลงทุนสุทธิ (เช่น % ของมูลค่ากองทุน) ที่ถ้าเกินกว่านี้แล้ว Swing Pricing จะถูกกระตุ้นให้ทำงาน (สำหรับ Partial Swing Pricing)`,
  },
  {
    word: `อัตราต้นทุนการทำธุรกรรม (Transaction Cost Rate)`,
    definition: `ใช้ในการประมาณการ Swing Factor ในที่นี้คือเปอร์เซ็นต์ของมูลค่าเงินที่ทำธุรกรรมที่จะกลายเป็นต้นทุน (รวมค่าคอมมิชชั่น, Bid-Ask Spread, Market Impact)`,
  },
];

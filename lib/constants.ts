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
    title: "test2",
    content:
      "คำนวณและหาพอร์ตลงทุนที่เหมาะสมตามหลัก Modern Portfolio Theory (MPT)",
    link: "/game/portfolio",
    url: "/images/game/investicon.jpg",
  },
  {
    title: "test2cvb",
    content:
      "คำนวณและหาพอร์ตลงทุนที่เหมาะสมตามหลัก Modern Portfolio Theory (MPT)",
    link: "/game/portfolio",
    url: "/images/game/investicon.jpg",
  },
];

export const INITIAL_RETIREMENT_DATA:FormData = {
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

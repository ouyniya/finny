import { prisma } from "@/lib/prisma";
import axios from "axios";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimiter";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") || "";

  // rate limit
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  const rateLimitResult = checkRateLimit(ip);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: `🌸 แง้ว... มีการเข้ามาบ่อยเกินไปน้า! ขอพักอีก ${rateLimitResult.remainingTime} วินาที นะคะ 🐾`,
      },
      { status: 429 }
    );
  }

  // fetch data
  try {
    const data = await prisma.fundDetail.findFirst({
      where: {
        projAbbrName: name,
      },
    });

    if (!data) {
      NextResponse.json(
        {
          error:
            "⚙️ Oops! ระบบมีข้อผิดพลาดเล็กน้อยค่ะ ผู้ใช้งานสามารถรายงานข้อผิดพลาดนี้ให้ admin ทราบได้ที่ email ของเรานะคะ  🛠️",
        },
        { status: 500 }
      );
    }

    // find project id of the fund
    const projIdRes = await axios.post(
      "https://api.sec.or.th/FundFactsheet/fund",
      {
        name: name,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "Ocp-Apim-Subscription-Key": process.env.SEC_API_KEY,
        },
      }
    );

    if (!projIdRes?.data[0]?.proj_id) {
      return NextResponse.json(
        {
          error:
            "🐣 แง... ระบบหากองทุนนี้ไม่เจอเลยค่ะ อาจจะสะกดผิดหรือไม่มีในระบบ ลองดูอีกทีนะคะ 💡",
        },
        { status: 404 }
      );
    }

    // fetch performance
    const projId = projIdRes?.data[0]?.proj_id;

    // find project id of the fund
    const performanceRes = await axios.get(
      `https://api.sec.or.th/FundFactsheet/fund/${projId}/performance`,
      {
        headers: {
          "Cache-Control": "no-cache",
          "Ocp-Apim-Subscription-Key": process.env.SEC_API_KEY,
        },
      }
    );

    if (performanceRes?.data?.length <= 0) {
      return NextResponse.json(
        {
          error:
            "☁️ ขออภัยค่ะ ระบบไม่พบข้อมูลกองทุนที่ระบุไว้ รบกวนตรวจสอบอีกครั้งนะคะ",
        },
        { status: 404 }
      );
    }

    // find Fund Factsheet

    const fundFactSheetRes = await axios.get(
      `https://api.sec.or.th/FundFactsheet/fund/${projId}/URLs`,
      {
        headers: {
          "Cache-Control": "no-cache",
          "Ocp-Apim-Subscription-Key": process.env.SEC_API_KEY,
        },
      }
    );

    if (!fundFactSheetRes?.data) {
      return NextResponse.json(
        {
          error:
            "☁️ ขออภัยค่ะ ระบบไม่พบข้อมูลกองทุนที่ระบุไว้ รบกวนตรวจสอบอีกครั้งนะคะ",
        },
        { status: 404 }
      );
    }

    const result = {
      data,
      performance: performanceRes?.data,
      fundFactSheet: fundFactSheetRes?.data,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          "⚙️ Oops! ระบบมีข้อผิดพลาดเล็กน้อยค่ะ ผู้ใช้งานสามารถรายงานข้อผิดพลาดนี้ให้ admin ทราบได้ที่ email ของเรานะคะ  🛠️",
      },
      { status: 500 }
    );
  }
}

/* ----------------- for test only ----------------- */
/*
const fundFactSheetRes = {
  data: {
    last_upd_date: "2025-07-04T08:10:00.54",
    url_halfyear_report: "-",
    url_annual_report: "-",
    url_factsheet: "-",
  },
};

const performanceRes = {
  data: [
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "1 year",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: "24.66",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "10 years",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: null,
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "3 months",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: "33.73",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "3 years",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: "25.89",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "5 years",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: "28.99",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "6 months",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: "28.65",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "inception date",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: "28.92",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "year to date",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: "29.51",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "1 year",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "14.7",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "10 years",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "14.91",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "3 months",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "23.07",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "3 years",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "14.21",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "5 years",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "14.24",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "6 months",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "17.75",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "inception date",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "14.28",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "year to date",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "18.83",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "1 year",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: "4.52",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "10 years",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: "3.97",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "3 months",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: "-0.52",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "3 years",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: "4.48",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "5 years",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: "6.59",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "6 months",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: "-1.98",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "inception date",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: null,
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "year to date",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: "0.65",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "1 year",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "14.25",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "10 years",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "0",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "3 months",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "2.15",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "3 years",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "12.57",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "5 years",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "5.48",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "6 months",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "1.61",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "inception date",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "6.69",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "year to date",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "3.41",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "1 year",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "9.18",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "10 years",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "8.2",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "3 months",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "1.54",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "3 years",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "9.12",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "5 years",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "11.66",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "6 months",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "1.26",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "inception date",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "12.39",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-ASSF",
      reference_period: "year to date",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "3.73",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "1 year",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: "24.66",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "10 years",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: null,
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "3 months",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: "33.73",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "3 years",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: "25.9",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "5 years",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: "28.99",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "6 months",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: "28.65",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "inception date",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: "30.18",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "year to date",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: "29.51",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "1 year",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "14.7",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "10 years",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "14.91",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "3 months",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "23.07",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "3 years",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "14.21",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "5 years",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "14.24",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "6 months",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "17.75",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "inception date",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "17.58",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "year to date",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "18.83",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "1 year",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: "4.52",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "10 years",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: "3.97",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "3 months",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: "-0.52",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "3 years",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: "4.48",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "5 years",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: "6.59",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "6 months",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: "-1.98",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "inception date",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: null,
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "year to date",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: "0.65",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "1 year",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "14.24",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "10 years",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "0",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "3 months",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "2.15",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "3 years",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "12.63",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "5 years",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "5.5",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "6 months",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "1.61",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "inception date",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "7.9",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "year to date",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "3.41",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "1 year",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "9.18",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "10 years",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "8.2",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "3 months",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "1.54",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "3 years",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "9.12",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "5 years",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "11.66",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "6 months",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "1.26",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "inception date",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "8.62",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-IA",
      reference_period: "year to date",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "3.73",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "1 year",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: "24.66",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "10 years",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: null,
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "3 months",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: "33.73",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "3 years",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: "25.89",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "5 years",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: "28.98",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "6 months",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: "28.65",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "inception date",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: "25.85",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "year to date",
      performance_type_desc: "ความผันผวนของกองทุนรวม",
      performance_val: "29.51",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "1 year",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "14.7",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "10 years",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "14.91",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "3 months",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "23.07",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "3 years",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "14.21",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "5 years",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "14.24",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "6 months",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "17.75",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "inception date",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "14.84",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "year to date",
      performance_type_desc: "ความผันผวนของตัวชี้วัด",
      performance_val: "18.83",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "1 year",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: "4.52",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "10 years",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: "3.97",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "3 months",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: "-0.52",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "3 years",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: "4.48",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "5 years",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: "6.59",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "6 months",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: "-1.98",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "inception date",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: null,
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "year to date",
      performance_type_desc: "ค่าเฉลี่ยในกลุ่มเดียวกัน",
      performance_val: "0.65",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "1 year",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "14.25",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "10 years",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "0",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "3 months",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "2.15",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "3 years",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "12.57",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "5 years",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "5.51",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "6 months",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "1.61",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "inception date",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "12.65",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "year to date",
      performance_type_desc: "ผลตอบแทนกองทุนรวม",
      performance_val: "3.41",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "1 year",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "9.18",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "10 years",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "8.2",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "3 months",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "1.54",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "3 years",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "9.12",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "5 years",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "11.66",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "6 months",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "1.26",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "inception date",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "9.8",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
    {
      last_upd_date: "2025-07-02T06:47:30.35",
      class_abbr_name: "ONE-UGG-RA",
      reference_period: "year to date",
      performance_type_desc: "ผลตอบแทนตัวชี้วัด",
      performance_val: "3.73",
      as_of_date: "2025-07-01 00:00:00.0000000",
    },
  ],
};
*/

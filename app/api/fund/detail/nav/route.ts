import axios from "axios";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimiter";
import moment from "moment";

interface AMCInfo {
  unique_id: string;
  sell_price: number;
  buy_price: number;
  sell_swap_price: number;
  buy_swap_price: number;
  remark_th: string;
  remark_en: string;
}

interface NAVData {
  last_upd_date: string;
  nav_date: string;
  class_abbr_name: string;
  net_asset: number;
  last_val: number;
  previous_val: number;
  amc_info: AMCInfo[];
}

interface NAVObject {
  dateValue: string;
  NAV: NAVData;
}

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

    const projId = projIdRes?.data[0]?.proj_id;

    // Fetch NAV
    const endDate = moment().format("YYYY-MM-DD");
    const beginDate = moment().subtract(3, "months").format("YYYY-MM-DD");

    const arrayDate: string[] = [];
    const NAVRes: NAVObject[] = [];

    const current = moment(beginDate);
    const last = moment(endDate);

    while (current.isSameOrBefore(last, "day")) {
      arrayDate.push(current.format("YYYY-MM-DD"));
      current.add(1, "day");
    }

    for (const dateValue of arrayDate) {
      try {
        const NAV = await axios.get(
          `https://api.sec.or.th/FundDailyInfo/${projId}/dailynav/${dateValue}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "Ocp-Apim-Subscription-Key": process.env.SEC_API_DAILY_KEY,
            },
          }
        );

        NAVRes.push({
          dateValue,
          NAV: NAV.data,
        });
      } catch (error) {
        console.error(`Error fetching NAV for ${dateValue}`, error);
      }
    }

    const result = {
      NAV: NAVRes,
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

// const NAVRes = [
//   {
//     dateValue: "2025-04-04",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-04-05",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-04-06",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-04-07",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-04-08",
//     NAV: [
//       {
//         nav_date: "2025-04-08",
//         unique_id: "C0000000460",
//         class_abbr_name: "1",
//         net_asset: 76043304,
//         last_val: 9.9143,
//         previous_val: 0,
//         sell_price: 9.9144,
//         buy_price: 9.9143,
//         sell_swap_price: 9.9143,
//         buy_swap_price: 9.9144,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-04-10T16:08:44.31",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-04-09",
//     NAV: [
//       {
//         nav_date: "2025-04-09",
//         unique_id: "C0000000460",
//         class_abbr_name: "1",
//         net_asset: 76491984,
//         last_val: 9.9979,
//         previous_val: 0,
//         sell_price: 9.998,
//         buy_price: 9.9979,
//         sell_swap_price: 9.9979,
//         buy_swap_price: 9.998,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-04-11T16:08:54.233",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-04-10",
//     NAV: [
//       {
//         nav_date: "2025-04-10",
//         unique_id: "C0000000460",
//         class_abbr_name: "1",
//         net_asset: 76448608,
//         last_val: 9.9906,
//         previous_val: 0,
//         sell_price: 9.9907,
//         buy_price: 9.9906,
//         sell_swap_price: 9.9906,
//         buy_swap_price: 9.9907,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-04-16T16:08:50.08",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-04-11",
//     NAV: [
//       {
//         nav_date: "2025-04-11",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 76640544,
//         last_val: 10.0092,
//         previous_val: 0,
//         sell_price: 10.0093,
//         buy_price: 10.0092,
//         sell_swap_price: 10.0092,
//         buy_swap_price: 10.0093,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-04-17T16:07:48.35",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-04-12",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-04-13",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-04-14",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-04-15",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-04-16",
//     NAV: [
//       {
//         nav_date: "2025-04-16",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 76833528,
//         last_val: 10.0345,
//         previous_val: 0,
//         sell_price: 10.0346,
//         buy_price: 10.0345,
//         sell_swap_price: 10.0345,
//         buy_swap_price: 10.0346,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-04-18T16:04:40.137",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-04-17",
//     NAV: [
//       {
//         nav_date: "2025-04-17",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 76931832,
//         last_val: 10.0462,
//         previous_val: 0,
//         sell_price: 10.0463,
//         buy_price: 10.0462,
//         sell_swap_price: 10.0462,
//         buy_swap_price: 10.0463,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-04-23T16:08:55.16",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-04-18",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-04-19",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-04-20",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-04-21",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-04-22",
//     NAV: [
//       {
//         nav_date: "2025-04-22",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 77038904,
//         last_val: 10.0573,
//         previous_val: 0,
//         sell_price: 10.0574,
//         buy_price: 10.0573,
//         sell_swap_price: 10.0573,
//         buy_swap_price: 10.0574,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-04-24T16:06:00.797",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-04-23",
//     NAV: [
//       {
//         nav_date: "2025-04-23",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 77083120,
//         last_val: 10.0673,
//         previous_val: 0,
//         sell_price: 10.0674,
//         buy_price: 10.0673,
//         sell_swap_price: 10.0673,
//         buy_swap_price: 10.0674,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-04-25T16:05:17.99",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-04-24",
//     NAV: [
//       {
//         nav_date: "2025-04-24",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 77855584,
//         last_val: 10.0841,
//         previous_val: 0,
//         sell_price: 10.0842,
//         buy_price: 10.0841,
//         sell_swap_price: 10.0841,
//         buy_swap_price: 10.0842,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-04-28T16:03:57.983",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-04-25",
//     NAV: [
//       {
//         nav_date: "2025-04-25",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 77891656,
//         last_val: 10.0887,
//         previous_val: 0,
//         sell_price: 10.0888,
//         buy_price: 10.0887,
//         sell_swap_price: 10.0887,
//         buy_swap_price: 10.0888,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-04-29T16:05:14.04",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-04-26",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-04-27",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-04-28",
//     NAV: [
//       {
//         nav_date: "2025-04-28",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 77961992,
//         last_val: 10.0978,
//         previous_val: 0,
//         sell_price: 10.0979,
//         buy_price: 10.0978,
//         sell_swap_price: 10.0978,
//         buy_swap_price: 10.0979,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-04-30T16:08:40.993",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-04-29",
//     NAV: [
//       {
//         nav_date: "2025-04-29",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 77976960,
//         last_val: 10.0986,
//         previous_val: 0,
//         sell_price: 10.0987,
//         buy_price: 10.0986,
//         sell_swap_price: 10.0986,
//         buy_swap_price: 10.0987,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-05-02T21:13:16.583",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-04-30",
//     NAV: [
//       {
//         nav_date: "2025-04-30",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 78107504,
//         last_val: 10.1049,
//         previous_val: 0,
//         sell_price: 10.105,
//         buy_price: 10.1049,
//         sell_swap_price: 10.1049,
//         buy_swap_price: 10.105,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-05-07T16:07:35.96",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-05-01",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-05-02",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-05-03",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-05-04",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-05-05",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-05-06",
//     NAV: [
//       {
//         nav_date: "2025-05-06",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 78232336,
//         last_val: 10.121,
//         previous_val: 0,
//         sell_price: 10.1211,
//         buy_price: 10.121,
//         sell_swap_price: 10.121,
//         buy_swap_price: 10.1211,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-05-08T16:10:26.68",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-05-07",
//     NAV: [
//       {
//         nav_date: "2025-05-07",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 78497576,
//         last_val: 10.1329,
//         previous_val: 0,
//         sell_price: 10.133,
//         buy_price: 10.1329,
//         sell_swap_price: 10.1329,
//         buy_swap_price: 10.133,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-05-09T16:06:23.477",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-05-08",
//     NAV: [
//       {
//         nav_date: "2025-05-08",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 78496016,
//         last_val: 10.1343,
//         previous_val: 0,
//         sell_price: 10.1344,
//         buy_price: 10.1343,
//         sell_swap_price: 10.1343,
//         buy_swap_price: 10.1344,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-05-14T16:04:15.25",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-05-09",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-05-10",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-05-11",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-05-12",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-05-13",
//     NAV: [
//       {
//         nav_date: "2025-05-13",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 78800456,
//         last_val: 10.1748,
//         previous_val: 0,
//         sell_price: 10.1749,
//         buy_price: 10.1748,
//         sell_swap_price: 10.1748,
//         buy_swap_price: 10.1749,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-05-15T21:09:05.917",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-05-14",
//     NAV: [
//       {
//         nav_date: "2025-05-14",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 78502232,
//         last_val: 10.167,
//         previous_val: 0,
//         sell_price: 10.1671,
//         buy_price: 10.167,
//         sell_swap_price: 10.167,
//         buy_swap_price: 10.1671,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-05-16T16:10:55.48",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-05-15",
//     NAV: [
//       {
//         nav_date: "2025-05-15",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 78385600,
//         last_val: 10.1707,
//         previous_val: 0,
//         sell_price: 10.1708,
//         buy_price: 10.1707,
//         sell_swap_price: 10.1707,
//         buy_swap_price: 10.1708,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-05-19T16:05:28.08",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-05-16",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-05-17",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-05-18",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-05-19",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-05-20",
//     NAV: [
//       {
//         nav_date: "2025-05-20",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 78574672,
//         last_val: 10.192,
//         previous_val: 0,
//         sell_price: 10.1921,
//         buy_price: 10.192,
//         sell_swap_price: 10.192,
//         buy_swap_price: 10.1921,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-05-22T16:09:30.187",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-05-21",
//     NAV: [
//       {
//         nav_date: "2025-05-21",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 78378520,
//         last_val: 10.1772,
//         previous_val: 0,
//         sell_price: 10.1773,
//         buy_price: 10.1772,
//         sell_swap_price: 10.1772,
//         buy_swap_price: 10.1773,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-05-23T16:08:33.787",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-05-22",
//     NAV: [
//       {
//         nav_date: "2025-05-22",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 78588392,
//         last_val: 10.1705,
//         previous_val: 0,
//         sell_price: 10.1706,
//         buy_price: 10.1705,
//         sell_swap_price: 10.1705,
//         buy_swap_price: 10.1706,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-05-26T16:04:13.487",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-05-23",
//     NAV: [
//       {
//         nav_date: "2025-05-23",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 78574184,
//         last_val: 10.175,
//         previous_val: 0,
//         sell_price: 10.1751,
//         buy_price: 10.175,
//         sell_swap_price: 10.175,
//         buy_swap_price: 10.1751,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-05-28T16:05:22.107",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-05-24",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-05-25",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-05-26",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-05-27",
//     NAV: [
//       {
//         nav_date: "2025-05-27",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 78781776,
//         last_val: 10.2013,
//         previous_val: 0,
//         sell_price: 10.2014,
//         buy_price: 10.2013,
//         sell_swap_price: 10.2013,
//         buy_swap_price: 10.2014,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-05-29T16:08:32.95",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-05-28",
//     NAV: [
//       {
//         nav_date: "2025-05-28",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 78740456,
//         last_val: 10.1952,
//         previous_val: 0,
//         sell_price: 10.1953,
//         buy_price: 10.1952,
//         sell_swap_price: 10.1952,
//         buy_swap_price: 10.1953,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-06-04T16:08:05.783",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-05-29",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-05-30",
//     NAV: [
//       {
//         nav_date: "2025-05-30",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 78813104,
//         last_val: 10.2042,
//         previous_val: 0,
//         sell_price: 10.2043,
//         buy_price: 10.2042,
//         sell_swap_price: 10.2042,
//         buy_swap_price: 10.2043,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-06-05T08:11:05.193",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-05-31",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-06-01",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-06-02",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-06-03",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-06-04",
//     NAV: [
//       {
//         nav_date: "2025-06-04",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 79201264,
//         last_val: 10.254,
//         previous_val: 0,
//         sell_price: 10.2541,
//         buy_price: 10.254,
//         sell_swap_price: 10.254,
//         buy_swap_price: 10.2541,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-06-06T16:05:33.333",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-06-05",
//     NAV: [
//       {
//         nav_date: "2025-06-05",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 79308200,
//         last_val: 10.2603,
//         previous_val: 0,
//         sell_price: 10.2604,
//         buy_price: 10.2603,
//         sell_swap_price: 10.2603,
//         buy_swap_price: 10.2604,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-06-09T16:05:28.413",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-06-06",
//     NAV: [
//       {
//         nav_date: "2025-06-06",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 79022672,
//         last_val: 10.2636,
//         previous_val: 0,
//         sell_price: 10.2637,
//         buy_price: 10.2636,
//         sell_swap_price: 10.2636,
//         buy_swap_price: 10.2637,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-06-11T16:06:28.49",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-06-07",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-06-08",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-06-09",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-06-10",
//     NAV: [
//       {
//         nav_date: "2025-06-10",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 78954024,
//         last_val: 10.274,
//         previous_val: 0,
//         sell_price: 10.2741,
//         buy_price: 10.274,
//         sell_swap_price: 10.274,
//         buy_swap_price: 10.2741,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-06-12T16:03:13.61",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-06-11",
//     NAV: [
//       {
//         nav_date: "2025-06-11",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 78937528,
//         last_val: 10.2757,
//         previous_val: 0,
//         sell_price: 10.2758,
//         buy_price: 10.2757,
//         sell_swap_price: 10.2757,
//         buy_swap_price: 10.2758,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-06-13T16:09:15.553",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-06-12",
//     NAV: [
//       {
//         nav_date: "2025-06-12",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 79019232,
//         last_val: 10.2862,
//         previous_val: 0,
//         sell_price: 10.2863,
//         buy_price: 10.2862,
//         sell_swap_price: 10.2862,
//         buy_swap_price: 10.2863,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-06-16T16:06:39.94",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-06-13",
//     NAV: [
//       {
//         nav_date: "2025-06-13",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 78912128,
//         last_val: 10.2695,
//         previous_val: 0,
//         sell_price: 10.2696,
//         buy_price: 10.2695,
//         sell_swap_price: 10.2695,
//         buy_swap_price: 10.2696,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-06-17T16:05:01.333",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-06-14",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-06-15",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-06-16",
//     NAV: [
//       {
//         nav_date: "2025-06-16",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 79026424,
//         last_val: 10.2844,
//         previous_val: 0,
//         sell_price: 10.2845,
//         buy_price: 10.2844,
//         sell_swap_price: 10.2844,
//         buy_swap_price: 10.2845,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-06-18T16:04:38.923",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-06-17",
//     NAV: [
//       {
//         nav_date: "2025-06-17",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 78926552,
//         last_val: 10.271,
//         previous_val: 0,
//         sell_price: 10.2711,
//         buy_price: 10.271,
//         sell_swap_price: 10.271,
//         buy_swap_price: 10.2711,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-06-19T16:04:44.08",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-06-18",
//     NAV: [
//       {
//         nav_date: "2025-06-18",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 78891832,
//         last_val: 10.2665,
//         previous_val: 0,
//         sell_price: 10.2666,
//         buy_price: 10.2665,
//         sell_swap_price: 10.2665,
//         buy_swap_price: 10.2666,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-06-23T16:05:10.553",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-06-19",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-06-20",
//     NAV: [
//       {
//         nav_date: "2025-06-20",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 78377896,
//         last_val: 10.263,
//         previous_val: 0,
//         sell_price: 10.2631,
//         buy_price: 10.263,
//         sell_swap_price: 10.263,
//         buy_swap_price: 10.2631,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-06-25T16:05:37.003",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-06-21",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-06-22",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-06-23",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-06-24",
//     NAV: [
//       {
//         nav_date: "2025-06-24",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 78509432,
//         last_val: 10.2837,
//         previous_val: 0,
//         sell_price: 10.2838,
//         buy_price: 10.2837,
//         sell_swap_price: 10.2837,
//         buy_swap_price: 10.2838,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-06-26T16:04:31.517",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-06-25",
//     NAV: [
//       {
//         nav_date: "2025-06-25",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 79124016,
//         last_val: 10.2866,
//         previous_val: 0,
//         sell_price: 10.2867,
//         buy_price: 10.2866,
//         sell_swap_price: 10.2866,
//         buy_swap_price: 10.2867,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-06-27T16:05:12.01",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-06-26",
//     NAV: [
//       {
//         nav_date: "2025-06-26",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 79326000,
//         last_val: 10.3124,
//         previous_val: 0,
//         sell_price: 10.3125,
//         buy_price: 10.3124,
//         sell_swap_price: 10.3124,
//         buy_swap_price: 10.3125,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-06-30T16:06:12.987",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-06-27",
//     NAV: [
//       {
//         nav_date: "2025-06-27",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 79326760,
//         last_val: 10.3122,
//         previous_val: 0,
//         sell_price: 10.3123,
//         buy_price: 10.3122,
//         sell_swap_price: 10.3122,
//         buy_swap_price: 10.3123,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-07-01T16:06:31.6",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-06-28",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-06-29",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-06-30",
//     NAV: [
//       {
//         nav_date: "2025-06-30",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 79419088,
//         last_val: 10.3239,
//         previous_val: 0,
//         sell_price: 10.324,
//         buy_price: 10.3239,
//         sell_swap_price: 10.3239,
//         buy_swap_price: 10.324,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-07-03T16:09:09.247",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-07-01",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-07-02",
//     NAV: [
//       {
//         nav_date: "2025-07-02",
//         unique_id: "C0000000460",
//         class_abbr_name: "-",
//         net_asset: 79483288,
//         last_val: 10.3327,
//         previous_val: 0,
//         sell_price: 10.3328,
//         buy_price: 10.3327,
//         sell_swap_price: 10.3327,
//         buy_swap_price: 10.3328,
//         remark_th: " ",
//         remark_en: " ",
//         last_upd_date: "2025-07-04T08:13:01.553",
//       },
//     ],
//   },
//   {
//     dateValue: "2025-07-03",
//     NAV: "",
//   },
//   {
//     dateValue: "2025-07-04",
//     NAV: "",
//   },
// ];

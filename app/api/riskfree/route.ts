import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET() {
  const url = "https://www.thaibma.or.th/EN/Market/Index/ShortTermIndex.aspx";

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const rows = await page.$$eval(".k-table-tbody tr", (trs) =>
      trs.map((tr) =>
        Array.from(tr.querySelectorAll("td")).map((td) => td.innerText.trim())
      )
    );

    await browser.close();

    if (rows.length === 0) {
      return NextResponse.json({ error: "No data found after page render" });
    }

    return NextResponse.json({ rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// {
//     "rows": [
//         [
//             "Short-term Government Bond Index",
//             "144.912186",
//             "0.00",
//             "144.912186",
//             "0.00",
//             "144.912186",
//             "0.00",
//             "1.421385",
//             "1.423091",
//             "0.297883",
//             "0.313635",
//             "0.301117"
//         ]
//     ]
// }

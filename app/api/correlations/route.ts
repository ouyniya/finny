import yahooFinance from "yahoo-finance2";
import moment from "moment";
import { NextResponse } from "next/server";

function correlation(x: number[], y: number[]): number {
  const n = x.length;
  if (n === 0) return 0;

  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let denX = 0;
  let denY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  return num / Math.sqrt(denX * denY);
}

async function fetchDailyReturnsWithDate(symbol: string, startDate: string) {
  const result = await yahooFinance.historical(symbol, { period1: startDate });

  const adjClose = result
    .filter((d) => d.adjClose !== null)
    .map((d) => ({
      date: d.date as unknown as string,
      adjClose: d.adjClose as number,
    }));

  const dailyReturn: { date: string; value: number }[] = [];
  for (let i = 1; i < adjClose.length; i++) {
    const r = Math.log(adjClose[i].adjClose / adjClose[i - 1].adjClose);
    dailyReturn.push({ date: adjClose[i].date, value: r });
  }

  return dailyReturn;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const assetsParam = searchParams.get("assets");
  const dateValue = searchParams.get("dateValue");

  if (!assetsParam || !dateValue) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const assets = assetsParam.split(",").map((a) => a.trim());
  const startDate = moment(dateValue)
    .subtract(10, "days")
    .format("YYYY-MM-DD");

  try {
    const allResults = await Promise.all(
      assets.map(async (symbol) => ({
        symbol,
        dailyReturn: await fetchDailyReturnsWithDate(symbol, startDate),
      }))
    );

    const toDayString = (date: string | Date) =>
      new Date(date).toISOString().slice(0, 10);

    const dateSets = allResults.map(
      (r) => new Set(r.dailyReturn.map((d) => toDayString(d.date)))
    );

    const commonDates = [
      ...dateSets.reduce((a, b) => new Set([...a].filter((d) => b.has(d)))),
    ];

    const aligned = allResults.map((r) =>
      commonDates.map(
        (date) => r.dailyReturn.find((d) => toDayString(d.date) === date)!.value
      )
    );

    const correlations: Record<string, Record<string, number>> = {};
    for (let i = 0; i < assets.length; i++) {
      correlations[assets[i]] = {};
      for (let j = 0; j < assets.length; j++) {
        correlations[assets[i]][assets[j]] = correlation(
          aligned[i],
          aligned[j]
        );
      }
    }

    return NextResponse.json({ assets, correlations });
  } catch (err) {
    console.error("Correlation API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import yahooFinance from "yahoo-finance2";
import moment from "moment";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const index = searchParams.get("index");
  const dateValue = searchParams.get("dateValue");

  if (!index || !dateValue) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const dayValue = moment(dateValue).subtract(365 * 10, "days").format("YYYY-MM-DD");
  // const dayValue = moment(dateValue).subtract(10, "days").format("YYYY-MM-DD");

  const queryOptions = { period1: dayValue };

  try {
    const result = await yahooFinance.historical(index, queryOptions);

    if (!result || result.length < 2) {
      throw new Error("Not enough data from API");
    }

    // เก็บ Adj Close
    const adjClose: number[] = result
      .filter((d) => d.adjClose !== null)
      .map((d) => d.adjClose as number);

    // คำนวณ daily return
    const dailyReturn: number[] = [];
    for (let i = 1; i < adjClose.length; i++) {
      const r = Math.log(adjClose[i] / adjClose[i - 1]);
      dailyReturn.push(r);
    }
    // mean daily return
    const meanDaily =
      dailyReturn.reduce((acc, val) => acc + val, 0) / dailyReturn.length;

    // annualized expected return
    const mean = meanDaily * 252;

    // variance of daily returns
    const variance =
      dailyReturn.reduce((acc, val) => acc + (val - meanDaily) ** 2, 0) /
      (dailyReturn.length - 1);

    // annualized volatility
    const std = Math.sqrt(variance) * Math.sqrt(252);

    return NextResponse.json({
      index,
      expectedReturn: mean,
      volatility: std,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

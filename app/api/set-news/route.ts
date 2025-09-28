import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const url =
      "https://query2.finance.yahoo.com/v1/finance/search?q=SET%20Index";
    const { data } = await axios.get(url);

    return new Response(JSON.stringify(data.quotes));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

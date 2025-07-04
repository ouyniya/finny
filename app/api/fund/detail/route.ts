import { prisma } from "@/lib/prisma";
import axios from "axios";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimiter";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") || "";

  // rate limit
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ message: "Too many requests" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  // fetch data
  try {
    const data = await prisma.fundDetail.findFirst({
      where: {
        projAbbrName: name,
      },
    });

    if (!data) {
      NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
      return NextResponse.json({ error: "Project ID not found" }, { status: 500 });
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
     return NextResponse.json({ error: "Performance data not found" }, { status: 500 });
    }

    const result = {
      data,
      performance: performanceRes?.data,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

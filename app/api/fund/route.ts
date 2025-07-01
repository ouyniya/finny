import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fundCompareGroup = searchParams.get("fundCompareGroup");

  if (!fundCompareGroup) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const result = await prisma.funds.aggregate({
      _count: {
        fundCompareGroup: true,
      },
      orderBy: {
        fundCompareGroup: "asc",
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

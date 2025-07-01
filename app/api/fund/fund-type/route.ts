import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

  try {
    const result = await prisma.funds.groupBy({
      by: ['fundCompareGroup'],
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

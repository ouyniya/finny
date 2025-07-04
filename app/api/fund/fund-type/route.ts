import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

  try {
    const result = await prisma.fundDetail.groupBy({
      by: ['fundCompare'],
      _count: {
        fundCompare: true,
      },
      orderBy: {
        fundCompare: "asc",
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

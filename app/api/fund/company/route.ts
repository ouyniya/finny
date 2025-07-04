import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  
  try {
    const result = await prisma.fundDetail.groupBy({
      by: ['compThaiName'],
      _count: {
        compThaiName: true,
      },
      orderBy: {
        compThaiName: "asc",
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

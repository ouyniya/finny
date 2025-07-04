import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimiter";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fundCompare = searchParams.get("fundCompare") || "";
  const projAbbrName = searchParams.get("name") || "";
  const company = searchParams.get("company") || "";
  const dividend = searchParams.get("dividend") || "";
  const mutualInvType = searchParams.get("mutualInvType") || "";

  const page = searchParams.get("page") || "1";

  const take = 10;
  const skip = take * (+page - 1) || 0;

  const filters = {
    projAbbrName: projAbbrName.toUpperCase(),
    fundCompare,
    company: company,
    dividend: dividend,
    mutualInvType: mutualInvType,
  };

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

  try {
    const [data, total] = await Promise.all([
      prisma.fundDetail.findMany({
        where: {
          ...(filters.projAbbrName && {
            projAbbrName: {
              contains: filters.projAbbrName,
            },
          }),
          ...(filters.fundCompare && {
            fundCompare: filters.fundCompare,
          }),
          ...(filters.company && {
            compThaiName: filters.company,
          }),
          ...(filters.dividend && {
            dividendPolicy: filters.dividend,
          }),
          ...(filters.mutualInvType && {
            mutualInvType: filters.mutualInvType,
          }),
        },
        skip: +skip,
        take: take,
      }),
      prisma.fundDetail.count({
        where: {
          ...(filters.projAbbrName && {
            projAbbrName: {
              contains: filters.projAbbrName,
            },
          }),
          ...(filters.fundCompare && {
            fundCompare: filters.fundCompare,
          }),
          ...(filters.company && {
            compThaiName: filters.company,
          }),
          ...(filters.dividend && {
            dividendPolicy: filters.dividend,
          }),
          ...(filters.mutualInvType && {
            mutualInvType: filters.mutualInvType,
          }),
        },
      }),
    ]);

    const result = {
      data,
      total,
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

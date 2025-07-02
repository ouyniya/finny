import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fundCompareGroup = searchParams.get("fundCompareGroup") || "";
  const projAbbrName = searchParams.get("name") || "";
  const companyId = searchParams.get("company") || "";
  const page = searchParams.get("page") || "1";

  const take = 10;
  const skip = take * (+page - 1) || 0;

  const filters = {
    projAbbrName: projAbbrName.toUpperCase(),
    fundCompareGroup,
    companyId: companyId ? Number(companyId) : undefined,
  };

  try {
    const [data, total] = await Promise.all([
      prisma.funds.findMany({
        where: {
          ...(filters.projAbbrName && {
            projAbbrName: {
              contains: filters.projAbbrName,
            },
          }),
          ...(filters.fundCompareGroup && {
            fundCompareGroup: filters.fundCompareGroup,
          }),
          ...(filters.companyId !== undefined && {
            companyId: filters.companyId,
          }),
        },
        skip: +skip,
        take: take,
      }),
      prisma.funds.count({
        where: {
          ...(filters.projAbbrName && {
            projAbbrName: {
              contains: filters.projAbbrName,
            },
          }),
          ...(filters.fundCompareGroup && {
            fundCompareGroup: filters.fundCompareGroup,
          }),
          ...(filters.companyId !== undefined && {
            companyId: filters.companyId,
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

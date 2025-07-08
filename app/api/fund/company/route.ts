/**
 * @swagger
 * /api/fund/company:
 *   get:
 *     summary: Get company details
 *     description: Retrieve details for a specific company.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   compThaiName:
 *                     type: string
 *                   _count:
 *                     type: object
 *                     properties:
 *                       compThaiName:
 *                         type: integer
 */
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

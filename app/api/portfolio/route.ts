import { PortfolioOptimizer } from "@/components/game/PortfolioAllocation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userProfile, investmentAmount } = body;

    const optimizer = new PortfolioOptimizer();
    const optimizedPortfolio = optimizer.optimizePortfolio(
      userProfile,
      investmentAmount
    );

    return NextResponse.json({
      success: true,
      portfolio: optimizedPortfolio,
      recommendations: [
        "Review allocation quarterly",
        "Rebalance when asset weights drift more than 5%",
        "Consider tax-loss harvesting opportunities",
      ],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Portfolio optimization failed" },
      { status: 500 }
    );
  }
}

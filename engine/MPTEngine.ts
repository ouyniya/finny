import { OPTIMIZATION_ROUND, SIMULATION_ROUND } from "@/lib/constants";
import {
  AssetInput,
  CorrelationInput,
  OptimizationResult,
} from "@/types/portfolio";
import { toast } from "react-toastify";

// --- Modern Portfolio Theory Engine ---
export class MPTEngine {
  private riskFreeRate: number;
  private correlations: CorrelationInput[];

  constructor(riskFreeRate: number, correlations: CorrelationInput[]) {
    this.riskFreeRate = riskFreeRate;
    this.correlations = correlations;
  }

  calculateExpectedReturn(weights: number[], expectedReturns: number[]) {
    return weights.reduce(
      (sum, weight, i) => sum + weight * expectedReturns[i],
      0
    );
  }

  calculatePortfolioVariance(
    weights: number[],
    covarianceMatrix: number[][]
  ): number {
    let variance = 0;
    for (let i = 0; i < weights.length; i++) {
      for (let j = 0; j < weights.length; j++) {
        variance += weights[i] * weights[j] * covarianceMatrix[i][j];
      }
    }
    return variance;
  }

  calculateSharpeRatio(portfolioReturn: number, portfolioVolatility: number) {
    const minVolatility = 0.0001; // ตั้งค่าขั้นต่ำให้ความผันผวน
    if (portfolioVolatility < minVolatility) return 0;
    return (portfolioReturn - this.riskFreeRate) / portfolioVolatility;
  }

  generateRandomWeights(numAssets: number): number[] {
    const weights = Array(numAssets)
      .fill(0)
      .map(() => Math.random());
    const sum = weights.reduce((acc, weight) => acc + weight, 0);
    return weights.map((weight) => weight / sum);
  }

  buildCorrelationMatrix(assets: AssetInput[]): number[][] {
    const n = assets.length;
    const matrix = Array(n)
      .fill(0)
      .map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          matrix[i][j] = 1; // Correlation of an asset with itself is 1
        } else {
          // Find the user-defined correlation
          const correlation = this.correlations.find(
            (corr) =>
              (corr.asset1Id === assets[i].id &&
                corr.asset2Id === assets[j].id) ||
              (corr.asset1Id === assets[j].id && corr.asset2Id === assets[i].id)
          );
          matrix[i][j] = correlation ? correlation.value : 0; // Default to 0 if not found
        }
      }
    }
    return matrix;
  }

  optimizePortfolio(
    assets: AssetInput[],
    numIterations: number = 10000
  ): {
    bestPortfolio: OptimizationResult | null;
    frontier: {
      expectedReturn: number;
      volatility: number;
      sharpeRatio: number;
    }[];
  } {
    if (assets.length === 0) return { bestPortfolio: null, frontier: [] };

    const expectedReturns = assets.map((a) => a.expectedReturn);
    const volatilities = assets.map((a) => a.volatility);
    const correlationMatrix = this.buildCorrelationMatrix(assets);

    // Build covariance matrix
    const covarianceMatrix = Array(assets.length)
      .fill(0)
      .map(() => Array(assets.length).fill(0));
    for (let i = 0; i < assets.length; i++) {
      for (let j = 0; j < assets.length; j++) {
        covarianceMatrix[i][j] =
          correlationMatrix[i][j] * volatilities[i] * volatilities[j];
      }
    }

    let bestPortfolio: OptimizationResult | null = null;
    let bestSharpe = -Infinity;

    const fullFrontier: {
      expectedReturn: number;
      volatility: number;
      sharpeRatio: number;
    }[] = [];

    for (let i = 0; i < numIterations; i++) {
      const weights = this.generateRandomWeights(assets.length);
      const expectedReturn = this.calculateExpectedReturn(
        weights,
        expectedReturns
      );
      const variance = this.calculatePortfolioVariance(
        weights,
        covarianceMatrix
      );
      const volatility = Math.sqrt(variance);
      const sharpeRatio = this.calculateSharpeRatio(expectedReturn, volatility);

      // เก็บข้อมูลไว้สำหรับกราฟ Efficient Frontier
      fullFrontier.push({ expectedReturn, volatility, sharpeRatio });

      // หา Best Sharpe
      if (sharpeRatio > bestSharpe) {
        bestSharpe = sharpeRatio;
        bestPortfolio = {
          weights,
          expectedReturn,
          volatility,
          sharpeRatio,
          assets: assets.map((asset, index) => ({
            id: asset.id,
            name: asset.name,
            weight: weights[index],
            expectedReturn: asset.expectedReturn,
            volatility: asset.volatility,
          })),
        };
      }
    }

    // check Sharpe ratio
    if (!bestPortfolio?.sharpeRatio || bestPortfolio?.sharpeRatio > 100) {
      toast("Sharpe Ratio สูงผิดปกติ");
    }

    const frontier: {
      expectedReturn: number;
      volatility: number;
      sharpeRatio: number;
    }[] = fullFrontier.sort(() => 0.5 - Math.random()).slice(0, 5000);

    return { bestPortfolio, frontier };
  }

  /**
   * รัน optimizePortfolio หลาย ๆ รอบและหาค่าเฉลี่ยของน้ำหนักสินทรัพย์ที่ได้จาก bestPortfolio
   * เพื่อให้ได้ผลลัพธ์ที่เสถียรยิ่งขึ้น
   * @param assets ข้อมูลสินทรัพย์
   * @param numOptimizationRuns จำนวนครั้งที่จะรัน optimizePortfolio (เช่น 5, 10)
   * @param numIterationsPerRun จำนวน Iterations ต่อการรันแต่ละครั้งของ optimizePortfolio
   * @returns bestPortfolio ที่ใช้น้ำหนักเฉลี่ย, expectedReturn เฉลี่ย, volatility เฉลี่ย, sharpeRatio เฉลี่ย
   */

  runMultipleOptimizationsAndAverage(
    assets: AssetInput[],
    numOptimizationRuns: number = OPTIMIZATION_ROUND,
    numIterationsPerRun: number = SIMULATION_ROUND
  ): OptimizationResult | null {
    if (assets.length === 0) return null;

    const allBestPortfolios: OptimizationResult[] = [];

    // 1. รัน optimizePortfolio ตามจำนวนรอบที่กำหนด
    for (let i = 0; i < numOptimizationRuns; i++) {
      const result = this.optimizePortfolio(assets, numIterationsPerRun);
      if (result.bestPortfolio) {
        allBestPortfolios.push(result.bestPortfolio);
      }
    }

    if (allBestPortfolios.length === 0) {
      return null;
    }

    // 2. หาค่าเฉลี่ยของน้ำหนักสินทรัพย์
    const numAssets = assets.length;
    const averagedWeights = Array(numAssets).fill(0) as number[];
    let totalExpectedReturn = 0;
    let totalVolatility = 0;
    let totalSharpeRatio = 0;

    for (const portfolio of allBestPortfolios) {
      portfolio.weights.forEach((weight, index) => {
        averagedWeights[index] += weight;
      });
      totalExpectedReturn += portfolio.expectedReturn;
      totalVolatility += portfolio.volatility;
      totalSharpeRatio += portfolio.sharpeRatio;
    }

    // หารด้วยจำนวนรอบที่รันสำเร็จ
    const actualRuns = allBestPortfolios.length;
    const finalAveragedWeights = averagedWeights.map(
      (weight) => weight / actualRuns
    );
    const finalExpectedReturn = totalExpectedReturn / actualRuns;
    const finalVolatility = totalVolatility / actualRuns;
    const finalSharpeRatio = totalSharpeRatio / actualRuns;

    // 3. สร้าง OptimizationResult ที่เป็นค่าเฉลี่ย
    const finalAssetsAllocation = assets.map((asset, index) => ({
      id: asset.id,
      name: asset.name,
      weight: finalAveragedWeights[index],
      expectedReturn: asset.expectedReturn, // ใช้ค่าเดิมของ asset
      volatility: asset.volatility, // ใช้ค่าเดิมของ asset
    }));

    return {
      weights: finalAveragedWeights,
      expectedReturn: finalExpectedReturn,
      volatility: finalVolatility,
      sharpeRatio: finalSharpeRatio,
      assets: finalAssetsAllocation,
    };
  }
}

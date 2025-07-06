import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Activity,
  Target,
  CheckCircle,
  ChevronRight,
  Coins,
  RotateCcw,
  X,
  ChartLine,
  TrendingDown,
  BadgePercent,
  Gem,
} from "lucide-react";
import Header from "../main/Header";
import { AnimatedGradientText } from "../magicui/animated-gradient-text";
import { Particles } from "../magicui/particles";
import { cn } from "@/lib/utils";
import EfficientFrontierCanvas from "@/app/(main)/(routes)/game/portfolio/EfficientFrontierCanvas";

// --- Type Definitions ---
interface OptimizationResult {
  weights: number[];
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  assets: {
    id: string;
    name: string;
    weight: number;
    expectedReturn: number;
    volatility: number;
  }[];
}

interface UserProfile {
  investmentAmount: number;
  investmentHorizon: number;
}

interface AssetInput {
  id: string;
  name: string;
  expectedReturn: number;
  volatility: number;
}

type Payload = {
  dataKey: string;
  name: string;
  value: string | number;
  color: string;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    name: string;
    value: string | number;
    color: string;
  }>;
  label?: string;
};

interface CorrelationInput {
  asset1Id: string;
  asset2Id: string;
  value: number;
}

interface FrontierPoint {
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
}

// --- Modern Portfolio Theory Engine ---
class MPTEngine {
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
    if (portfolioVolatility === 0) return 0; // Avoid division by zero
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

    const frontier: {
      expectedReturn: number;
      volatility: number;
      sharpeRatio: number;
    }[] = fullFrontier.sort(() => 0.5 - Math.random()).slice(0, 5000);

    return { bestPortfolio, frontier };
  }
}

// --- Portfolio Display Component ---
const PortfolioDisplay: React.FC<{
  portfolio: OptimizationResult;
  efficientFrontier: {
    expectedReturn: number;
    volatility: number;
    sharpeRatio: number;
  }[];
  userProfile: UserProfile;
  riskFreeRate: number;
  onRestart: () => void;
}> = ({
  portfolio,
  efficientFrontier,
  userProfile,
  riskFreeRate = 0.02,
  onRestart,
}) => {
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  const pieData = portfolio.assets.map((asset) => ({
    name: asset.name,
    value: asset.weight * 100,
    amount: asset.weight * userProfile.investmentAmount,
    color: COLORS[portfolio.assets.indexOf(asset) % COLORS.length],
  }));

  // Mock performance data for illustration
  const performanceData = [
    {
      year: 0,
      portfolio: userProfile.investmentAmount,
      benchmark: userProfile.investmentAmount,
    },
  ];

  for (let i = 1; i <= userProfile.investmentHorizon; i++) {
    performanceData.push({
      year: i,
      portfolio:
        userProfile.investmentAmount *
        Math.pow(1 + portfolio.expectedReturn, i),
      benchmark: userProfile.investmentAmount * Math.pow(1 + riskFreeRate, i), // A simpler benchmark for illustration
    });
  }

  const CustomTooltipPerformance: React.FC<CustomTooltipProps> = ({
    active,
    payload,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-primary-foreground border  rounded-md shadow-lg text-sm">
          {payload.map((entry: Payload) => (
            <p key={entry.dataKey} style={{ color: entry.color }}>
              {`${
                entry.name === "portfolio" ? "พอร์ตของคุณ" : "เงินฝาก"
              }: ฿${Number(entry.value).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomTooltipPieChart: React.FC<CustomTooltipProps> = ({
    active,
    payload,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-primary-foreground border  rounded-md shadow-lg text-sm">
          {payload.map((entry: Payload) => (
            <p key={entry.dataKey} style={{ color: entry.color }}>
              {`${entry.name}: ${
                typeof entry.value === "number"
                  ? `${entry.value.toFixed(1)}%`
                  : `${entry.value}%`
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-primary-foreground rounded-xl shadow-lg font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-primary mb-2 mt-4">
            สรุปพอร์ตลงทุนที่เหมาะสม
          </h1>
          <p className="text-lg text-primary/50">
            คุณสนใจลงทุนเป็นจํานวน ฿
            <span className="font-semibold text-indigo-500">
              {userProfile.investmentAmount?.toLocaleString()}
            </span>{" "}
            และมีกรอบเวลาการลงทุน{" "}
            <span className="font-semibold text-indigo-500">
              {userProfile.investmentHorizon} ปี
            </span>
          </p>
        </div>

        {/* button ลองใหม่อีกครั้ง  */}
        <div
          onClick={onRestart}
          className="max-w-max group relative mt-8 mx-0 flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8e7cc31f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8e7cc33f] hover:cursor-pointer"
        >
          <span
            className={cn(
              "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[oklch(68.5% 0.169 237.323)]/50 via-[#48ace5]/50 to-[oklch(68.5% 0.169 237.323)]/50 bg-[length:300%_100%] p-[1px]"
            )}
            style={{
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "destination-out",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "subtract",
              WebkitClipPath: "padding-box",
            }}
          />

          <AnimatedGradientText
            className="flex items-center font-medium"
            colorFrom="#39a8ff"
            colorTo="#a67bf5"
          >
            ลองใหม่อีกครั้ง
          </AnimatedGradientText>
          <RotateCcw className="ml-1 size-4 stroke-prima transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 text-indigo-400 opacity-50" />
        </div>
      </div>

      {/* Efficient Frontier Chart */}
      <EfficientFrontierCanvas
        efficientFrontier={efficientFrontier}
        bestPortfolio={portfolio}
      />

      {/* Summary Cards */}
      <div className="mt-24 mb-12">
        <Header
          top="Best Portfolio"
          header="พอร์ตที่ดีที่สุดของคุณ"
          content="รายละเอียดพอร์ตที่ดีที่สุด"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-xl shadow-md flex items-center space-x-4">
          <DollarSign className="text-blue-800 h-8 w-8" />
          <div>
            <p className="text-primary text-sm">จํานวนเงินที่ลงทุน</p>
            <p className="text-xl font-bold text-primary">
              ฿{userProfile.investmentAmount?.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-teal-700 p-6 rounded-xl shadow-md flex items-center space-x-4">
          <TrendingUp className="text-teal-800 h-8 w-8" />
          <div>
            <p className="text-primary text-sm">ผลตอบแทนคาดหวัง</p>
            <p className="text-xl font-bold text-primary">
              {(portfolio.expectedReturn * 100).toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-6 rounded-xl shadow-md flex items-center space-x-4">
          <Activity className="text-yellow-800 h-8 w-8" />
          <div>
            <p className="text-primary text-sm">ระดับความผันผวน</p>
            <p className="text-xl font-bold text-primary">
              {(portfolio.volatility * 100).toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-xl shadow-md flex items-center space-x-4">
          <Target className="text-purple-800 h-8 w-8" />
          <div>
            <p className="text-primary text-sm">Sharpe Ratio</p>
            <p className="text-xl font-bold text-primary">
              {portfolio.sharpeRatio.toFixed(3)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Asset Allocation Pie Chart */}
        <div className="bg-primary-foreground p-6 rounded-xl shadow-md border ">
          <h2 className="text-xl text-primary mb-4 text-center">
            การจัดพอร์ตลงทุน
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltipPieChart />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Chart */}
        <div className="bg-primary-foreground p-6 rounded-xl shadow-md border">
          <h2 className="text-xl text-primary mb-4 text-center">
            ผลตอบแทนของคุณ
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={performanceData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
              <XAxis
                dataKey="year"
                label={{
                  value: "",
                  position: "bottom",
                  offset: -5,
                  fill: "#718096",
                }}
                className="text-sm text-primary"
              />
              <YAxis
                tickFormatter={(value) => {
                  if (Math.abs(value) >= 1000000) {
                    return `${(value / 1000000).toFixed(1)}M`;
                  } else if (Math.abs(value) >= 1000) {
                    return `${(value / 1000).toFixed(0)}k`;
                  } else if (value === 0) {
                    return "0";
                  }
                  return value.toLocaleString();
                }}
                className="text-sm text-primary"
              />
              <Tooltip content={<CustomTooltipPerformance />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="portfolio"
                name="พอร์ตของคุณ"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="benchmark"
                name="เงินฝาก"
                stroke="#82ca9d"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset Details */}
      <div className="bg-primary-foreground p-6 rounded-xl shadow-md border  mb-10">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">
          สัดส่วนการลงทุนในพอร์ตของคุณ
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-primary-foreground rounded-lg overflow-hidden">
            <thead className="bg-primary-foreground border-b ">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-primary">
                  <div className="flex gap-1 items-center">
                    <p>สินทรัพย์</p>
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-primary">
                  <div className="flex gap-1 items-center">
                    <BadgePercent size={16} className="text-indigo-500" />
                    <p>สัดส่วน</p>
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-primary">
                  <div className="flex gap-1 justify-end items-center">
                    <ChartLine size={16} className="text-yellow-500" />
                    <p>จํานวนเงิน</p>
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-primary">
                  <div className="flex gap-1 items-center">
                    <ChartLine size={16} className="text-teal-500" />
                    <p>ผลตอบแทนคาดหวัง</p>
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-primary">
                  <div className="flex gap-1 items-center">
                    <TrendingDown size={16} className="text-red-500" />
                    <p>ค่าความผันผวน</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {portfolio.assets.map((asset, index) => (
                <tr
                  key={asset.id}
                  className={cn(
                    index % 2 === 0
                      ? "bg-primary-foreground"
                      : "bg-primary-foreground",
                    "border-b  last:border-b-0"
                  )}
                >
                  <td className="py-3 px-4 text-sm text-primary/80">
                    <div className="flex items-center">
                      <Coins className="h-5 w-5 text-indigo-500 mr-2" />
                      {asset.name}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-primary/80">
                    {(asset.weight * 100).toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-primary/80">
                    ฿
                    {(
                      asset.weight * userProfile.investmentAmount
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-primary/80">
                    {(asset.expectedReturn * 100).toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-primary/80">
                    {(asset.volatility * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-primary-foreground p-6 rounded-xl shadow-md border ">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">
          ทริคสําหรับนักลงทุน
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary-foreground p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-3">
              <CheckCircle className="h-6 w-6 text-indigo-500 mr-3" />
              <h3 className="text-lg font-semibold text-indigo-500">
                เช็กพอร์ตบ้างน้า
              </h3>
            </div>
            <p className="text-primary/80 text-sm">
              ลองส่องพอร์ตทุกๆ 3 เดือน ถ้าน้ําหนักแต่ละสินทรัพย์คลาดไปเกิน 5%
              ก็ปรับให้เหมือนเดิมนะ
            </p>
          </div>

          <div className="bg-primary-foreground p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-3">
              <CheckCircle className="h-6 w-6 text-teal-500 mr-3" />
              <h3 className="text-lg font-semibold text-teal-500">
                ทยอยลงทุนแบบคูลๆ
              </h3>
            </div>
            <p className="text-primary/80 text-sm">
              ถ้าไม่มั่นใจจังหวะตลาด ลองทยอยลงทุนภายใน 3-6 เดือน
              จะได้ลดความเสี่ยงเรื่องจังหวะผิดพลาดนะ
            </p>
          </div>

          <div className="bg-primary-foreground p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-3">
              <CheckCircle className="h-6 w-6 text-yellow-500 mr-3" />
              <h3 className="text-lg font-semibold text-yellow-500">
                วางแผนภาษีให้เป๊ะ
              </h3>
            </div>
            <p className="text-primary/80 text-sm">
              ถ้ามีโอกาส ก็ลองดูเรื่องขายเพื่อลดภาษี หรือถือยาวเกิน 1 ปี
              จะช่วยเรื่องภาษีได้ดีเลยน้า
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function ThaiPortfolioOptimizer() {
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [portfolioResult, setPortfolioResult] =
    useState<OptimizationResult | null>(null);
  const [frontierData, setFrontierData] = useState<FrontierPoint[] | null>(
    null
  );
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // Default market data for initial input
  const [marketDataInputs, setMarketDataInputs] = useState<AssetInput[]>([
    {
      id: "asset-1",
      name: "เงินฝากและตราสารหนี้ระยะสั้น",
      expectedReturn: 0.08,
      volatility: 0.18,
    },
    {
      id: "asset-2",
      name: "ตราสารหนี้ภาครัฐ",
      expectedReturn: 0.1,
      volatility: 0.22,
    },
    { id: "asset-3", name: "หุ้นกู้", expectedReturn: 0.025, volatility: 0.04 },
    { id: "asset-4", name: "หุ้น", expectedReturn: 0.035, volatility: 0.06 },
    {
      id: "asset-5",
      name: "การลงทุนทางเลือก",
      expectedReturn: 0.09,
      volatility: 0.16,
    },
  ]);

  const [correlations, setCorrelations] = useState<CorrelationInput[]>([]);

  // Default risk-free rate
  const [riskFreeRate, setRiskFreeRate] = useState(0.02);

  // User profile inputs
  const [investmentAmount, setInvestmentAmount] = useState<number>(100000);
  const [investmentHorizon, setInvestmentHorizon] = useState<number>(5);

  const handleAddAsset = () => {
    setMarketDataInputs((prevAssets) => {
      const newAsset = {
        id: `asset-${prevAssets.length + 1}`,
        name: "",
        expectedReturn: 0,
        volatility: 0,
      };

      // Add new correlations for the new asset with existing assets
      setCorrelations((prevCorrelations) => {
        const newCorrelations = [...prevCorrelations];
        prevAssets.forEach((existingAsset) => {
          newCorrelations.push({
            asset1Id: newAsset.id,
            asset2Id: existingAsset.id,
            value: 0, // Default correlation
          });
        });
        return newCorrelations;
      });

      return [...prevAssets, newAsset];
    });
  };

  const handleRemoveAsset = (id: string) => {
    setMarketDataInputs((prevAssets) =>
      prevAssets.filter((asset) => asset.id !== id)
    );
    setCorrelations((prevCorrelations) =>
      prevCorrelations.filter(
        (corr) => corr.asset1Id !== id && corr.asset2Id !== id
      )
    );
  };

  const handleAssetInputChange = (
    id: string,
    field: keyof AssetInput,
    value: string
  ) => {
    setMarketDataInputs(
      marketDataInputs.map((asset) =>
        asset.id === id
          ? {
              ...asset,
              [field]:
                field === "name"
                  ? value
                  : parseFloat(value) /
                      (field === "expectedReturn" || field === "volatility"
                        ? 100
                        : 1) || 0,
            }
          : asset
      )
    );
  };

  const handleCorrelationChange = (
    asset1Id: string,
    asset2Id: string,
    value: string
  ) => {
    setCorrelations((prevCorrelations) => {
      const existingCorrelationIndex = prevCorrelations.findIndex(
        (corr) =>
          (corr.asset1Id === asset1Id && corr.asset2Id === asset2Id) ||
          (corr.asset1Id === asset2Id && corr.asset2Id === asset1Id)
      );

      const newValue = parseFloat(value) || 0;

      if (existingCorrelationIndex !== -1) {
        // Update existing correlation
        return prevCorrelations.map((corr, index) =>
          index === existingCorrelationIndex
            ? { ...corr, value: newValue }
            : corr
        );
      } else {
        // Add new correlation
        return [...prevCorrelations, { asset1Id, asset2Id, value: newValue }];
      }
    });
  };

  const getCorrelationValue = (asset1Id: string, asset2Id: string): number => {
    const correlation = correlations.find(
      (corr) =>
        (corr.asset1Id === asset1Id && corr.asset2Id === asset2Id) ||
        (corr.asset1Id === asset2Id && corr.asset2Id === asset1Id)
    );
    return correlation ? correlation.value : 0;
  };

  function GoToTopButton() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const handleCalculatePortfolio = async () => {
    setLoading(true);

    if (marketDataInputs.length === 0) {
      return;
    }

    // Validate inputs
    const isValid =
      marketDataInputs.every(
        (asset) =>
          asset.name && asset.expectedReturn >= 0 && asset.volatility >= 0
      ) &&
      investmentAmount > 0 &&
      investmentHorizon > 0;

    if (!isValid) {
      alert(
        "โปรดกรอกข้อมูลให้ครบถ้วนและถูกต้องสำหรับสินทรัพย์ทั้งหมด, จำนวนเงินลงทุน และกรอบเวลาการลงทุน"
      );
      setLoading(false);
      return;
    }

    const mptEngine = new MPTEngine(riskFreeRate, correlations);
    const { bestPortfolio, frontier } = mptEngine.optimizePortfolio(
      marketDataInputs,
      1000000
    );
    // increase for better results

    setPortfolioResult(bestPortfolio);
    setFrontierData(frontier);
    setUserProfile({ investmentAmount, investmentHorizon });
    setLoading(false);
    setShowPortfolio(true);

    // go to top
    GoToTopButton();
  };

  const handleRestart = () => {
    setShowPortfolio(false);
    setPortfolioResult(null);
    setFrontierData(null);
    setUserProfile(null);
    // Optionally reset all inputs to default or clear them
    setMarketDataInputs([
      {
        id: "asset-1",
        name: "เงินฝากและตราสารหนี้ระยะสั้น",
        expectedReturn: 0.08,
        volatility: 0.18,
      },
      {
        id: "asset-2",
        name: "ตราสารหนี้ภาครัฐ",
        expectedReturn: 0.1,
        volatility: 0.22,
      },
      {
        id: "asset-3",
        name: "หุ้นกู้",
        expectedReturn: 0.025,
        volatility: 0.04,
      },
      { id: "asset-4", name: "หุ้น", expectedReturn: 0.035, volatility: 0.06 },
      {
        id: "asset-5",
        name: "การลงทุนทางเลือก",
        expectedReturn: 0.09,
        volatility: 0.16,
      },
    ]);
    setCorrelations([]);
    setRiskFreeRate(0.02);
    setInvestmentAmount(100000);
    setInvestmentHorizon(5);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-foreground p-4">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mb-4"></div>
          <p className="text-lg text-primary/50">กำลังคำนวณพอร์ตของคุณ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-foreground/50 backdrop-blur-lg p-4 sm:p-6 lg:p-8 font-inter rounded-2xl">
      {!showPortfolio ? (
        <div className="container mx-auto p-4 md:p-8 bg-primary-foreground rounded-xl font-inter relative -z-10 overflow-hidden">
          <div className="max-w-4xl mx-auto rounded-xl p-6 sm:p-8 lg:p-10 -z-10 overflow-hidden">
            <div className="absolute -top-5 left-0 overflow-hidden h-[400px] w-full -z-1">
              <Particles />
            </div>
            <div className="absolute -top-5 left-0 w-full opacity-40 h-[280px] -z-5"></div>

            <div className="absolute -top-5 left-0 w-full h-[280px] -z-4 bg-gradient-to-b from-transparent to-primary-foreground"></div>

            <div>
              <div
                className="mx-auto"
                style={{
                  width: "100px",
                  height: "100px",
                  position: "relative",
                }}
              >
                <iframe
                  src="https://giphy.com/embed/nSQUjoqKtDzeXwk9mN"
                  width="100%"
                  height="100%"
                  style={{ position: "absolute" }}
                  className="giphy-embed"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className="z-10">
              <Header
                top="เกมส์การลงทุน"
                header="เกมส์จัดพอร์ตลงทุน"
                content="กรุณากรอกข้อมูลเพื่อคํานวณพอร์ตลงทุนที่เหมาะสมที่สุดสําหรับคุณ"
              />
            </div>

            {/* Market Data Input */}
            <div className="mb-8 mt-20 my-10 rounded-lg">
              <h2 className="text-lg text-primary mb-8">
                ข้อมูลสินทรัพย์ (Expected Return & Volatility)
              </h2>
              {marketDataInputs.length === 0 ? (
                <p className="text-red-500">
                  กรุณาเพิ่มสินทรัพย์อย่างน้อย 1 รายการ
                </p>
              ) : (
                <>
                  <div className="grid grid-col-1 lg:grid-cols-2 gap-6">
                    {marketDataInputs.map((asset) => (
                      <div
                        key={asset.id}
                        className="relative grid grid-cols-1 gap-4 items-end p-6 bg-gradient-to-br from-indigo-100/10 to-indigo-500/40 rounded-xl backdrop-blur-sm border border-white/10 shadow-sm text-primary"
                      >
                        <div className="w-full flex flex-col gap-2">
                          <div className="flex items-center">
                            <Gem className="h-5 w-5 text-indigo-500 mr-2" />
                            <h1 className="font-semibold">{asset.name}</h1>{" "}
                            <div className="absolute top-2 right-2">
                              <button
                                onClick={() => handleRemoveAsset(asset.id)}
                                className="flex justify-center items-center h-6 w-6 text-white rounded-full hover:bg-red-500 transition-colors duration-200 hover:cursor-pointer"
                                aria-label="Remove asset"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <div className="w-full rounded-lg">
                            <div className="grid gap-2">
                              <div className="grid gap-2">
                                <div className="grid grid-cols-3 items-center gap-4">
                                  <label
                                    htmlFor={`asset-name-${asset.id}`}
                                    className="text-sm"
                                  >
                                    ชื่อสินทรัพย์
                                  </label>
                                  <input
                                    type="text"
                                    id={`asset-name-${asset.id}`}
                                    value={asset.name}
                                    onChange={(e) =>
                                      handleAssetInputChange(
                                        asset.id,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    placeholder="เช่น หุ้น, ตราสารหนี้"
                                    className="col-span-2 h-8 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                  <label
                                    htmlFor={`asset-return-${asset.id}`}
                                    className="text-sm"
                                  >
                                    ผลตอบแทนคาดหวัง (%)
                                  </label>
                                  <input
                                    type="number"
                                    id={`asset-return-${asset.id}`}
                                    value={(asset.expectedReturn * 100).toFixed(
                                      2
                                    )}
                                    onChange={(e) =>
                                      handleAssetInputChange(
                                        asset.id,
                                        "expectedReturn",
                                        e.target.value
                                      )
                                    }
                                    step="0.01"
                                    min="0"
                                    className="col-span-2 h-8 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                  <label
                                    htmlFor={`asset-volatility-${asset.id}`}
                                    className="text-sm"
                                  >
                                    ความผันผวน (%)
                                  </label>

                                  <input
                                    type="number"
                                    id={`asset-volatility-${asset.id}`}
                                    value={(asset.volatility * 100).toFixed(2)}
                                    onChange={(e) =>
                                      handleAssetInputChange(
                                        asset.id,
                                        "volatility",
                                        e.target.value
                                      )
                                    }
                                    step="0.01"
                                    min="0"
                                    className="col-span-2 h-8 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* button เพิ่มสินทรัพย์  */}
              <div
                onClick={handleAddAsset}
                className="max-w-max group relative mt-8 mx-0 flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8e7cc31f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8e7cc33f] hover:cursor-pointer"
              >
                <span
                  className={cn(
                    "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[oklch(68.5% 0.169 237.323)]/50 via-[#9c40ff]/50 to-[oklch(68.5% 0.169 237.323)]/50 bg-[length:300%_100%] p-[1px]"
                  )}
                  style={{
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "destination-out",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "subtract",
                    WebkitClipPath: "padding-box",
                  }}
                />

                <AnimatedGradientText className="font-medium">
                  เพิ่มสินทรัพย์
                </AnimatedGradientText>
                <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </div>
            </div>

            {/* Correlation and Risk-Free Rate Input */}
            <div className="mb-8 p-6 bg-primary-foreground rounded-lg border">
              <h2 className="text-lg text-primary mb-4">
                ค่าสัมประสิทธิ์สหสัมพันธ์และอัตราดอกเบี้ยปราศจากความเสี่ยง
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="risk-free-rate"
                    className="block text-sm font-medium text-primary/80 mb-1"
                  >
                    อัตราดอกเบี้ยปราศจากความเสี่ยง (%)
                  </label>
                  <input
                    type="number"
                    id="risk-free-rate"
                    value={(riskFreeRate * 100).toFixed(2)}
                    onChange={(e) =>
                      setRiskFreeRate(parseFloat(e.target.value) / 100 || 0)
                    }
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full px-3 py-2 border  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-primary mb-3">
                  สหสัมพันธ์ระหว่างสินทรัพย์
                </h3>
                {marketDataInputs.length < 2 && (
                  <p className="text-gray-500 text-sm">
                    เพิ่มสินทรัพย์อย่างน้อย 2 รายการเพื่อตั้งค่าสหสัมพันธ์
                  </p>
                )}
                <div className="grid grid-cols-1 gap-4">
                  {marketDataInputs.map((asset1, index1) =>
                    marketDataInputs.slice(index1 + 1).map((asset2) => (
                      <div
                        key={`${asset1.id}-${asset2.id}`}
                        className="flex items-center gap-4 bg-primary-foreground p-3 rounded-md shadow-sm border"
                      >
                        <label
                          htmlFor={`corr-${asset1.id}-${asset2.id}`}
                          className="block text-sm font-medium text-primary/80 w-1/2"
                        >
                          {asset1.name} กับ {asset2.name}
                        </label>
                        <input
                          type="number"
                          id={`corr-${asset1.id}-${asset2.id}`}
                          value={getCorrelationValue(asset1.id, asset2.id)}
                          onChange={(e) =>
                            handleCorrelationChange(
                              asset1.id,
                              asset2.id,
                              e.target.value
                            )
                          }
                          step="0.01"
                          min="-1"
                          max="1"
                          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* User Profile Input */}
            <div className="mb-8 p-6 bg-primary-foreground rounded-lg border">
              <h2 className="text-lg text-primary mb-4">
                ข้อมูลโปรไฟล์การลงทุนของคุณ
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="investment-amount"
                    className="block text-sm font-medium text-primary/80 mb-1"
                  >
                    จํานวนเงินที่ต้องการลงทุน (บาท)
                  </label>
                  <input
                    type="number"
                    id="investment-amount"
                    value={investmentAmount}
                    onChange={(e) =>
                      setInvestmentAmount(parseFloat(e.target.value) || 0)
                    }
                    min="0"
                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="investment-horizon"
                    className="block text-sm font-medium text-primary/80 mb-1"
                  >
                    กรอบเวลาการลงทุน (ปี)
                  </label>
                  <input
                    type="number"
                    id="investment-horizon"
                    value={investmentHorizon}
                    onChange={(e) =>
                      setInvestmentHorizon(parseInt(e.target.value) || 0)
                    }
                    min="1"
                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div
              className="max-w-max group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] hover:cursor-pointer"
              onClick={handleCalculatePortfolio}
            >
              <span
                className={cn(
                  "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
                )}
                style={{
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "destination-out",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "subtract",
                  WebkitClipPath: "padding-box",
                }}
              />
              ⭐ <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
              <AnimatedGradientText className="text-lg font-medium">
                {loading ? "กำลังคำนวณ..." : "คํานวณพอร์ตลงทุน"}
              </AnimatedGradientText>
              <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      ) : (
        <PortfolioDisplay
          portfolio={portfolioResult!}
          efficientFrontier={frontierData!}
          userProfile={userProfile!}
          riskFreeRate={riskFreeRate!}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

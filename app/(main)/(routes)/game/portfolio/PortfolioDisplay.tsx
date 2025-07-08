import React from "react";
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
  Coins,
  RotateCcw,
  ChartLine,
  TrendingDown,
  BadgePercent,
} from "lucide-react";

import {
  CustomTooltipProps,
  OptimizationResult,
  Payload,
  UserProfile,
} from "@/types/portfolio";
import EfficientFrontierCanvas from "@/app/(main)/(routes)/game/portfolio/EfficientFrontierCanvas";
import Header from "@/components/common/Header";
import { InView } from "@/components/ui/in-view";

import { cn } from "@/lib/utils";
import { INITIAL_COLORS, RISK_FREE_RATE } from "@/lib/constants";
import CuteGlassButton from "@/components/ui/cute-glass-button";

// --- Portfolio Display Component ---
export const PortfolioDisplay: React.FC<{
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
  riskFreeRate = RISK_FREE_RATE,
  onRestart,
}) => {
  const COLORS = INITIAL_COLORS;

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
                entry.name
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

        <div className="max-w-max">
          <CuteGlassButton
            onClick={onRestart}
            textColorFrom="#a67bf5"
            textColorTo="#1ca2e9"
            text="ลองใหม่อีกครั้ง"
            iconAfter={RotateCcw}
            iconAnimation="animate-spin"
          />
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
        <div className="bg-gradient-to-br from-sky-500 to-indigo-700 p-6 rounded-xl shadow-md flex items-center space-x-4">
          <DollarSign className="text-blue-800 h-8 w-8" />
          <div>
            <p className="text-primary text-sm">จํานวนเงินที่ลงทุน</p>
            <p className="text-xl font-bold text-primary">
              ฿{userProfile.investmentAmount?.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-sky-700 p-6 rounded-xl shadow-md flex items-center space-x-4">
          <TrendingUp className="text-teal-800 h-8 w-8" />
          <div>
            <p className="text-primary text-sm">ผลตอบแทนคาดหวัง</p>
            <p className="text-xl font-bold text-primary">
              {(portfolio.expectedReturn * 100).toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-lime-500 to-teal-700 p-6 rounded-xl shadow-md flex items-center space-x-4">
          <Activity className="text-lime-800 h-8 w-8" />
          <div>
            <p className="text-primary text-sm">ระดับความผันผวน</p>
            <p className="text-xl font-bold text-primary">
              {(portfolio.volatility * 100).toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-700 p-6 rounded-xl shadow-md flex items-center space-x-4">
          <Target className="text-indigo-800 h-8 w-8" />
          <div>
            <p className="text-primary text-sm">Sharpe Ratio</p>
            <p className="text-xl font-bold text-primary">
              {portfolio.sharpeRatio.toFixed(3)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <InView
        variants={{
          hidden: {
            opacity: 0,
            y: 30,
            scale: 0.95,
            filter: "blur(4px)",
          },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          },
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        viewOptions={{ margin: "0px 0px -350px 0px" }}
      >
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
                  <th className="py-3 px-4 text-center text-sm font-semibold text-primary">
                    <div className="flex gap-1 justify-center items-center">
                      <BadgePercent size={16} className="text-indigo-500" />
                      <p>สัดส่วน</p>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-primary">
                    <div className="flex gap-1 justify-end items-center">
                      <ChartLine size={16} className="text-lime-500" />
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
                ลองส่องพอร์ตเป็นประจำ ถ้าน้ําหนักแต่ละสินทรัพย์คลาดไปเกิน 5%
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
                ถ้าไม่มั่นใจจังหวะตลาด ลองทยอยลงทุน
                จะได้ลดความเสี่ยงเรื่องจังหวะผิดพลาดนะ
              </p>
            </div>

            <div className="bg-primary-foreground p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-3">
                <CheckCircle className="h-6 w-6 text-lime-500 mr-3" />
                <h3 className="text-lg font-semibold text-lime-500">
                  วางแผนภาษีให้เป๊ะ
                </h3>
              </div>
              <p className="text-primary/80 text-sm">
                ถ้ามีโอกาส ก็ลองดูเรื่องขายเพื่อลดภาษี หรือถือยาว
                จะช่วยเรื่องภาษีได้ดีเลยน้า
              </p>
            </div>
          </div>
        </div>
      </InView>
    </div>
  );
};

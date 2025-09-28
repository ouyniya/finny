"use client";
import { useEffect, useState } from "react";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import isHoliday from "@/lib/is-holiday";
import moment from "moment";
import Loading from "@/app/loading";

export const description = "An interactive stock price chart";

const chartConfig = {
  visitors: {
    label: "Stock",
  },
  low: {
    label: "low",
    color: "var(--chart-3)",
  },
  adjClose: {
    label: "adjClose",
    color: "var(--chart-1)",
  },
  high: {
    label: "high",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface ChartDataType {
  date: Date;
  high: number;
  volume: number;
  open: number;
  low: number;
  close: number;
  adjClose: number;
}

const Chart = () => {
  const [chartData, setChartData] = useState<ChartDataType[]>([]);
  const [timeRange, setTimeRange] = React.useState("90d");

  // stock information input
  const STOCK = "^SET.BK";

  useEffect(() => {
    const fetchPrice = async () => {
      // date value
      const refDate: moment.Moment = isHoliday(new Date().toString());
      const dateStr = refDate.format("YYYY-MM-DD");

      const res = await fetch(
        `/api/stock-price?stock=${STOCK}&dateValue=${dateStr}`
      );

      if (!res.ok) {
        console.log("API error")
        throw new Error("API error");
      }

      
      const json = await res.json();

      setChartData(json);
    };

    fetchPrice();
  }, []);

  const filteredData = chartData
    ? chartData.filter((item) => {
        const date = new Date(item.date);
        const referenceDate = new Date();
        let daysToSubtract = 90;
        if (timeRange === "30d") {
          daysToSubtract = 30;
        } else if (timeRange === "7d") {
          daysToSubtract = 7;
        }
        const startDate = new Date(referenceDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);
        return date >= startDate;
      })
    : [];

  return (
    <>
      {filteredData.length <= 0 ? (
        <Loading cn="w-full max-h-max" />
      ) : (
        <Card className="pt-0">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1">
              <CardTitle>SET Index</CardTitle>
              <CardDescription>
                ราคาสูงสุด ต่ำสุด และราคาปิดปรับปรุงแล้ว (Adj Close) ของดัชนี
                SET Index ประเทศไทย
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="fillLow" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-3)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-3)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillAdjClose" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-2)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-2)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="low"
                  type="natural"
                  fill="url(#fillLow)"
                  stroke="var(--chart-3)"
                  stackId="a"
                />
                <Area
                  dataKey="adjClose"
                  type="natural"
                  fill="url(#fillAdjClose)"
                  stroke="var(--chart-1)"
                  stackId="a"
                />
                <Area
                  dataKey="high"
                  type="natural"
                  fill="url(#fillHigh)"
                  stroke="var(--chart-2)"
                  stackId="a"
                />
                <ChartLegend
                  content={<ChartLegendContent payload={undefined} />}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </>
  );
};
export default Chart;

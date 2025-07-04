"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
export const description = "A multiple line chart";

interface NAVPRops {
  dateValue: string;
  NAV:
    | {
        nav_date: string;
        unique_id: string;
        class_abbr_name: string;
        net_asset: number;
        last_val: number;
        previous_val: number;
        sell_price: number;
        buy_price: number;
        sell_swap_price: number;
        buy_swap_price: number;
        remark_th: string;
        remark_en: string;
        last_upd_date: string;
      }[]
    | string;
}

interface ChartNAVProps {
  NAVData: NAVPRops[];
}

const ChartNAV = ({ NAVData }: ChartNAVProps) => {
  
  const validNAVData = NAVData?.filter((item) => {
    return Array.isArray(item.NAV);
  });

  const allClasses = React.useMemo(() => {
    const set = new Set<string>();
    validNAVData.forEach((item) => {
      if (Array.isArray(item.NAV)) {
        item.NAV.forEach((nav) => set.add(nav.class_abbr_name));
      }
    });
    return Array.from(set);
  }, [validNAVData]);

  // เตรียมข้อมูลสำหรับกราฟ (chartData)
  const chartData = validNAVData.map((item) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row: Record<string, any> = { date: item.dateValue };

    // กำหนดค่าเริ่มต้น null ให้ class ทุกตัว
    allClasses.forEach((cls) => {
      row[cls] = null;
    });

    if (Array.isArray(item.NAV)) {
      // ใส่ค่าของ last_val ตาม class ให้แต่ละ row
      item.NAV.forEach((nav) => {
        row[nav.class_abbr_name] = nav.last_val;
      });
    }

    return row;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>กราฟ NAV แยกตาม class</CardTitle>
        <CardDescription>ย้อนหลัง 3 เดือน</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            nav: { label: "NAV", color: "var(--chart-1)" },
          }}
        >
          <LineChart
            data={chartData}
            width={300}
            height={200}
            margin={{ left: 12, right: 12, top: 20, bottom: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis domain={["auto", "auto"]} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            {allClasses.map((cls, index) => (
              <Line
                key={cls}
                type="monotone"
                dataKey={cls}
                stroke={`var(--chart-${index + 1})`}
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              *ข้อมูลแบบ real time จากสำนักงาน ก.ล.ต.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChartNAV;

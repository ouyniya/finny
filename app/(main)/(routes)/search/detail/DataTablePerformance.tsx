"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import * as React from "react";

interface PerformanceProps {
  last_upd_date: string;
  class_abbr_name: string;
  reference_period: string;
  performance_type_desc: string;
  performance_val: string | null;
  as_of_date: string;
}

const referencePeriodsOrder = [
  "3 months",
  "6 months",
  "1 year",
  "3 years",
  "5 years",
  "10 years",
  "year to date",
  "inception date",
];

const referencePeriodsTh: Record<string, string> = {
  "3 months": "3 เดือน",
  "6 months": "6 เดือน",
  "1 year": "1 ปี",
  "3 years": "3 ปี*",
  "5 years": "5 ปี*",
  "10 years": "10 ปี*",
  "year to date": "ตั้งแต่ต้นปี",
  "inception date": "ตั้งแต่จัดตั้งกองทุน*",
};

const typeOrder = [
  "ผลตอบแทนกองทุนรวม",
  "ผลตอบแทนตัวชี้วัด",
  "ค่าเฉลี่ยในกลุ่มเดียวกัน",
  "ความผันผวนของกองทุนรวม",
  "ความผันผวนของตัวชี้วัด",
];

export default function PerformanceTableTest({
  performance,
}: {
  performance: PerformanceProps[];
}) {
  // Group by class_abbr_name first
  const groupedByClass = React.useMemo(() => {
    const map = new Map<string, PerformanceProps[]>();
    performance.forEach((item) => {
      if (!map.has(item.class_abbr_name)) {
        map.set(item.class_abbr_name, []);
      }
      map.get(item.class_abbr_name)!.push(item);
    });
    return map;
  }, []);

  return (
    <div className="space-y-12">
      {[...groupedByClass.entries()].map(([className, records]) => {
        // Extract unique performance_type_desc
        const uniqueTypes = Array.from(
          new Set(records.map((r) => r.performance_type_desc))
        );

        // Create a lookup for fast access
        const lookup = new Map<string, Map<string, string | null>>();
        // key: performance_type_desc, value: map of reference_period -> val
        uniqueTypes.forEach((type) => {
          lookup.set(type, new Map());
        });

        records.forEach(
          ({ performance_type_desc, reference_period, performance_val }) => {
            lookup
              .get(performance_type_desc)
              ?.set(reference_period, performance_val);
          }
        );

        // ---- สรุปผล ---- //
        const shortTermPeriods = ["3 months", "6 months", "1 year"];
        const longTermPeriods = ["3 years", "5 years", "10 years"];

        const summaryList: string[] = [];

        const checkPerformance = (periods: string[]) => {
          let goodCount = 0;
          let badCount = 0;
          periods.forEach((period) => {
            const fundReturn = parseFloat(
              lookup.get("ผลตอบแทนกองทุนรวม")?.get(period) || "NaN"
            );
            const benchmarkReturn = parseFloat(
              lookup.get("ผลตอบแทนตัวชี้วัด")?.get(period) || "NaN"
            );
            if (!isNaN(fundReturn) && !isNaN(benchmarkReturn)) {
              if (fundReturn > benchmarkReturn) goodCount++;
              else badCount++;
            }
          });
          return { goodCount, badCount };
        };

        const checkRisk = (periods: string[]) => {
          let goodCount = 0;
          let badCount = 0;
          periods.forEach((period) => {
            const fundRisk = parseFloat(
              lookup.get("ความผันผวนของกองทุนรวม")?.get(period) || "NaN"
            );
            const benchmarkRisk = parseFloat(
              lookup.get("ความผันผวนของตัวชี้วัด")?.get(period) || "NaN"
            );
            if (!isNaN(fundRisk) && !isNaN(benchmarkRisk)) {
              if (fundRisk < benchmarkRisk) goodCount++;
              else badCount++;
            }
          });
          return { goodCount, badCount };
        };

        const shortTermResult = checkPerformance(shortTermPeriods);
        const longTermResult = checkPerformance(longTermPeriods);

        const shortTermRisk = checkRisk(shortTermPeriods);
        const longTermRisk = checkRisk(longTermPeriods);

        // count performance alert

        if (shortTermResult.goodCount >= shortTermPeriods.length) {
          summaryList.push(
            `🧩 ผลตอบแทนช่วงสั้น (${shortTermPeriods
              .map((p) => referencePeriodsTh[p])
              .join(", ")}) ดีเมื่อเทียบกับตัวชี้วัด`
          );
        }

        if (shortTermResult.badCount >= shortTermPeriods.length) {
          summaryList.push(
            `🚧 ผลตอบแทนช่วงสั้น (${shortTermPeriods
              .map((p) => referencePeriodsTh[p])
              .join(", ")}) ไม่ค่อยดีเมื่อเทียบกับตัวชี้วัด`
          );
        }

        if (longTermResult.goodCount >= longTermPeriods.length) {
          summaryList.push(
            `🧩 ผลตอบแทนช่วงยาว (${longTermPeriods
              .map((p) => referencePeriodsTh[p])
              .join(", ")}) ดีเมื่อเทียบกับตัวชี้วัด`
          );
        }

        if (longTermResult.badCount >= longTermPeriods.length) {
          summaryList.push(
            `🚧 ผลตอบแทนช่วงยาว (${longTermPeriods
              .map((p) => referencePeriodsTh[p])
              .join(", ")}) ไม่ค่อยดีเมื่อเทียบกับตัวชี้วัด`
          );
        }

        // count risk alert

        if (shortTermRisk.goodCount >= shortTermPeriods.length) {
          summaryList.push(
            `🧩 ความผันผวนช่วงสั้น (${shortTermPeriods
              .map((p) => referencePeriodsTh[p])
              .join(", ")}) ดีเมื่อเทียบกับตัวชี้วัด`
          );
        }

        if (shortTermRisk.badCount >= shortTermPeriods.length) {
          summaryList.push(
            `🚧 ความผันผวนช่วงสั้น (${shortTermPeriods
              .map((p) => referencePeriodsTh[p])
              .join(", ")}) ไม่ค่อยดีเมื่อเทียบกับตัวชี้วัด`
          );
        }

        if (longTermRisk.goodCount >= longTermPeriods.length) {
          summaryList.push(
            `🧩 ความผันผวนช่วงยาว (${longTermPeriods
              .map((p) => referencePeriodsTh[p])
              .join(", ")}) ดีเมื่อเทียบกับตัวชี้วัด`
          );
        }

        if (longTermRisk.badCount >= longTermPeriods.length) {
          summaryList.push(
            `🚧 ความผันผวนช่วงยาว (${longTermPeriods
              .map((p) => referencePeriodsTh[p])
              .join(", ")}) ไม่ค่อยดีเมื่อเทียบกับตัวชี้วัด`
          );
        }

        return (
          <div key={className}>
            <h2 className="text-base font-bold mb-4">
              กองทุน: {className === "main" ? "กองทุนหลัก" : className}
            </h2>
            {summaryList.length > 0 && (
              <>
                <Alert className="mb-4">
                  <AlertDescription>
                    <div className="text-sm space-y-1">
                      {summaryList.map((summary, idx) => (
                        <p
                          className={
                            summary.includes("ไม่ค่อยดี")
                              ? "text-yellow-400"
                              : "text-teal-400"
                          }
                          key={idx}
                        >
                          {summary}
                        </p>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              </>
            )}
            <table className="w-full table-auto border-collapse border text-sm">
              <thead>
                <tr className="bg-primary/10">
                  <th className="px-3 py-2 text-left">รายการ</th>
                  {referencePeriodsOrder.map((period) => (
                    <th key={period} className="px-3 py-2 text-center">
                      {referencePeriodsTh[period] || period}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {uniqueTypes
                  .sort((a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b))
                  .map((type) => (
                    <tr key={type} className="even:bg-primary/10">
                      <td className="px-3 py-2">{type}</td>
                      {referencePeriodsOrder.map((period) => {
                        const val = lookup.get(type)?.get(period);
                        return (
                          <td key={period} className="px-3 py-2 text-center">
                            {val === null || val === undefined ? "-" : val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

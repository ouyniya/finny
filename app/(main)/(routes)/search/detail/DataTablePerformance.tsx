"use client";

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

export default function PerformanceTableTest({performance}: {performance: PerformanceProps[]}) {
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

        return (
          <div key={className}>
            <h2 className="text-base font-bold mb-4">
              กองทุน: {className === "main" ? "กองทุนหลัก" : className}
            </h2>
            <table className="w-full table-auto border-collapse border text-sm">
              <thead>
                <tr className="bg-primary/10">
                  <th className="px-3 py-2 text-left">รายการ</th>
                  {referencePeriodsOrder.map((period) => (
                    <th key={period} className="px-3 py-2 text-center">
                      {period}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {uniqueTypes.map((type) => (
                  <tr key={type} className="even:bg-primary/10">
                    <td className="px-3 py-2">{type}</td>
                    {referencePeriodsOrder.map((period) => {
                      const val = lookup.get(type)?.get(period);
                      return (
                        <td
                          key={period}
                          className="px-3 py-2 text-center"
                        >
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

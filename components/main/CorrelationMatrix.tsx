"use client";

import React from "react";

type Props = {
  correlations: Record<string, Record<string, number>>;
};

export default function CorrelationMatrix({ correlations }: Props) {
  const assets = Object.keys(correlations);

  return (
    <table className="border-collapse border border-gray-300 w-full text-sm">
      <thead>
        <tr>
          <th className="border p-2 bg-gray-100">Asset</th>
          {assets.map((a) => (
            <th key={a} className="border p-2 bg-gray-100">{a}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {assets.map((a) => (
          <tr key={a}>
            <td className="border p-2 bg-gray-100 font-bold">{a}</td>
            {assets.map((b) => (
              <td key={b} className="border p-2 text-center">
                {correlations[a][b].toFixed(2)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

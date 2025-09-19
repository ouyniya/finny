"use client";

import { Line } from "react-chartjs-2";
import { TooltipItem, FontSpec } from "chart.js";
import { SimulationResults } from "@/types/swing-pricing";

const SwingPricingNAVChart = ({ results }: { results: SimulationResults }) => {
  let computedFont = null;

  if (typeof window !== "undefined" && typeof document !== "undefined") {
    computedFont = window.getComputedStyle(document.body).fontFamily;
  }

  console.log(computedFont);

  // Chart data
  const chartData = {
    labels: [
      "วันก่อนเกิดเหตุการณ์",
      "วันที่เกิดเหตุการณ์ (ซื้อ/ขาย)",
      "วันถัดไป (ผลลัพธ์)",
    ],
    datasets: [
      {
        label: "สถานการณ์: ไม่มี Swing Pricing",
        data: [
          results.timelineNavNoSwing.day1,
          results.timelineNavNoSwing.day2,
          results.timelineNavNoSwing.day3,
        ],
        borderColor: "oklch(70.2% 0.183 293.541)",
        backgroundColor: "oklch(70.2% 0.183 293.541)",
        tension: 0.2,
        color: "white",
      },
      {
        label: "สถานการณ์: มี Swing Pricing",
        data: [
          results.timelineNavSwing.day1,
          results.timelineNavSwing.day2,
          results.timelineNavSwing.day3,
        ],
        borderColor: "oklch(68.5% 0.169 237.323)",
        backgroundColor: "oklch(68.5% 0.169 237.323)",
        tension: 0.2,
        color: "white",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        color: "white",
        labels: {
          color: "white", // สีตัวหนังสือใน legend
          font: {
            family: `${computedFont}, sans-serif`,
          },
        },
      },

      title: {
        display: true,
        text: "การเปรียบเทียบ NAV ในแต่ละสถานการณ์",
        font: {
          family: `${computedFont}, sans-serif`,
          size: 18,
        },
        color: "white",
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"line">) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(4) + " บาท/หน่วย";
            }
            return label;
          },
        },
        bodyFont: {
          family: `${computedFont}, sans-serif`,
          size: 14, // ขนาดฟอนต์ (ถ้าต้องการ)
          weight: "normal",
        } as Partial<FontSpec>,
        titleFont: {
          family: `${computedFont}, sans-serif`,
          size: 16,
          weight: "bold",
        } as Partial<FontSpec>,
        bodyColor: "white", // สีข้อความใน tooltip
        titleColor: "white", // สีหัวข้อ tooltip
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // สีเส้นกริดแกน X (โปร่งแสง)
          drawTicks: true, // แสดงเส้น tick
          drawBorder: false, // แสดงเส้นแกน (border)
        },
        title: {
          display: true,
          text: "NAV (บาท/หน่วย)",
          color: "white",
          font: {
            family: `${computedFont}, sans-serif`,
          },
        },

        ticks: {
          font: {
            family: `${computedFont}, sans-serif`,
          },
          color: "white", // สีตัวเลขบนแกน y
        },
        min:
          Math.min(
            results.navBeforeSwing,
            results.navAfterNoSwing,
            results.navAfterSwing
          ) * 0.95,
        max:
          Math.max(
            results.navBeforeSwing,
            results.navAfterNoSwing,
            results.navAfterSwing
          ) * 1.05,
      },
      x: {
        title: {
          display: true,
          text: "ช่วงเวลา",
          color: "white",
          font: {
            family: `${computedFont}, sans-serif`,
          },
        },
        ticks: {
          font: {
            family: `${computedFont}, sans-serif`,
          },
          color: "white", // สีตัวเลขบนแกน x
        },
      },
    },
  };

  return (
    <div className="bg-primary-foreground p-6 rounded-lg border mb-8">
      <Line data={chartData} options={chartOptions} />
      <div className="text-sm flex flex-col gap-2 mt-4">
        <p className="text-base font-semibold">
          กราฟแสดง NAV ของกองทุนใน 3 ช่วงเวลา:
        </p>
        <p className="opacity-50">
          วันก่อนเกิดเหตุการณ์: NAV ตั้งต้น | วันที่เกิดเหตุการณ์ (ซื้อ/ขาย):
          NAV ที่นักลงทุนทำธุรกรรม | วันถัดไป (ผลลัพธ์): NAV
          ที่ผู้ลงทุนที่เหลือได้รับผลกระทบ
        </p>
      </div>
    </div>
  );
};
export default SwingPricingNAVChart;

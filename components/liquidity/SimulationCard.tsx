"use client";

import React, { useState, useMemo } from "react";
import InputSlider from "./InputSlider";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Header from "../common/Header";
import SwingPricingVisualization from "./SwingPricingVisualization";
import SwingPricingDefinition from "./SwingPricingDefinition";
import {
  CalculationStep,
  DetailedScenario,
  SimulationResults,
} from "@/types/swing-pricing";
import Link from "next/link";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const calculateSwingPricing = (
  initialNav: number,
  totalUnits: number,
  netFlowUnits: number,
  transactionCostRate: number,
  swingThresholdPercent: number
): SimulationResults => {
  const initialFundValue = initialNav * totalUnits;
  const netFlowValue = netFlowUnits * initialNav;
  const swingThresholdValue = initialFundValue * (swingThresholdPercent / 100);

  const detailedCalculations: DetailedScenario[] = [];

  // --- 1. Base NAV (สถานการณ์เริ่มต้น) ---
  const initialScenarioSteps: CalculationStep[] = [];
  const navBeforeSwing = initialNav;
  initialScenarioSteps.push({
    step: "1. มูลค่าเริ่มต้นของกองทุน",
    description: `มูลค่าสินทรัพย์รวม = NAV เริ่มต้น x จำนวนหน่วยลงทุนทั้งหมด`,
    value: `${initialNav.toFixed(
      2
    )} บาท/หน่วย x ${totalUnits.toLocaleString()} หน่วย = ${initialFundValue.toLocaleString()} บาท`,
  });
  initialScenarioSteps.push({
    step: "2. NAV ต่อหน่วย (ก่อนเกิดเหตุการณ์)",
    description: `นี่คือ NAV ณ สิ้นวันก่อนหน้าที่ไม่มีการเปลี่ยนแปลง`,
    value: `${navBeforeSwing.toFixed(4)} บาท/หน่วย`,
  });
  detailedCalculations.push({
    scenarioName: "สถานการณ์เริ่มต้น",
    steps: initialScenarioSteps,
  });

  // --- 2. สถานการณ์ "ไม่มี Swing Pricing" (Liquidation After NAV Fixed) ---
  const noSwingScenarioSteps: CalculationStep[] = [];
  let fundValueAfterNoSwing = initialFundValue;
  let remainingUnitsNoSwing = totalUnits;
  let actualTransactionCost = Math.abs(netFlowValue) * transactionCostRate;
  let firstMoverAdvantage = 0;

  if (netFlowUnits !== 0) {
    noSwingScenarioSteps.push({
      step: `3. มูลค่ากระแสเงินสุทธิ`,
      description: `${
        netFlowUnits > 0 ? "เงินไหลเข้า" : "เงินไหลออก"
      }สุทธิ ${netFlowUnits.toLocaleString()} หน่วย x NAV ${initialNav.toFixed(
        2
      )} บาท/หน่วย`,
      value: `${netFlowValue.toLocaleString()} บาท`,
    });
    noSwingScenarioSteps.push({
      step: `4. ต้นทุนการทำธุรกรรม`,
      description: `|มูลค่ากระแสเงินสุทธิ| x อัตราต้นทุนการทำธุรกรรม`,
      value: `|${netFlowValue.toLocaleString()}| บาท x ${(
        transactionCostRate * 100
      ).toFixed(2)}% = ${actualTransactionCost.toLocaleString()} บาท`,
    });

    // Calculate final fund value and remaining units for 'no swing'
    fundValueAfterNoSwing =
      initialFundValue + netFlowValue - actualTransactionCost;
    remainingUnitsNoSwing = totalUnits + netFlowUnits;

    const navAfterNoSwing =
      remainingUnitsNoSwing > 0
        ? fundValueAfterNoSwing / remainingUnitsNoSwing
        : 0;
    const dilutionAmount = navBeforeSwing - navAfterNoSwing;

    if (netFlowUnits < 0) {
      // Net Outflow
      firstMoverAdvantage = Math.abs(netFlowUnits) * dilutionAmount;
      noSwingScenarioSteps.push({
        step: "5. NAV สำหรับผู้ลงทุนที่เหลือ (วันถัดไป)",
        description: `(มูลค่าสินทรัพย์รวมเริ่มต้น + กระแสเงินสุทธิ - ต้นทุนการทำธุรกรรม) / (จำนวนหน่วยลงทุนเริ่มต้น + จำนวนหน่วยสุทธิ)`,
        value: `(${initialFundValue.toLocaleString()} + ${netFlowValue.toLocaleString()} - ${actualTransactionCost.toLocaleString()}) / (${totalUnits.toLocaleString()} + ${netFlowUnits.toLocaleString()}) = ${navAfterNoSwing.toFixed(
          4
        )} บาท/หน่วย`,
      });
      noSwingScenarioSteps.push({
        step: "6. การเจือจาง (Dilution)",
        description: `NAV เริ่มต้น - NAV ผู้ลงทุนที่เหลือ`,
        value: `${navBeforeSwing.toFixed(4)} - ${navAfterNoSwing.toFixed(
          4
        )} = ${dilutionAmount.toFixed(4)} บาท/หน่วย`,
      });
      noSwingScenarioSteps.push({
        step: "7. First Mover Advantage (เงินไหลออก)",
        description: `จำนวนหน่วยที่ขายคืน x มูลค่าการเจือจางต่อหน่วย`,
        value: `${Math.abs(
          netFlowUnits
        ).toLocaleString()} หน่วย x ${dilutionAmount.toFixed(
          4
        )} บาท/หน่วย = ${firstMoverAdvantage.toLocaleString()} บาท`,
      });
    } else {
      // Net Inflow
      noSwingScenarioSteps.push({
        step: "5. NAV สำหรับผู้ลงทุนที่เหลือ (วันถัดไป)",
        description: `(มูลค่าสินทรัพย์รวมเริ่มต้น + กระแสเงินสุทธิ - ต้นทุนการทำธุรกรรม) / (จำนวนหน่วยลงทุนเริ่มต้น + จำนวนหน่วยสุทธิ)`,
        value: `(${initialFundValue.toLocaleString()} + ${netFlowValue.toLocaleString()} - ${actualTransactionCost.toLocaleString()}) / (${totalUnits.toLocaleString()} + ${netFlowUnits.toLocaleString()}) = ${navAfterNoSwing.toFixed(
          4
        )} บาท/หน่วย`,
      });
      noSwingScenarioSteps.push({
        step: "6. การเจือจาง (Dilution)",
        description: `NAV เริ่มต้น - NAV ผู้ลงทุนที่เหลือ`,
        value: `${navBeforeSwing.toFixed(4)} - ${navAfterNoSwing.toFixed(
          4
        )} = ${dilutionAmount.toFixed(4)} บาท/หน่วย`,
      });
      noSwingScenarioSteps.push({
        step: "7. First Mover Advantage (เงินไหลเข้า)",
        description: `ผู้ซื้อรายใหม่จ่ายราคาเต็ม แต่กองทุนมีต้นทุน ทำให้ NAV โดยรวมในอนาคตลดลง`,
        value: `ไม่มี First Mover Advantage ในรูปแบบได้กำไรโดยตรง แต่ผู้ลงทุนเดิมถูก Dilute`,
      });
    }
  } else {
    // No Flow
    fundValueAfterNoSwing = initialFundValue;
    remainingUnitsNoSwing = totalUnits;
    actualTransactionCost = 0;
    firstMoverAdvantage = 0;
    noSwingScenarioSteps.push({
      step: "3. ไม่มีกระแสเงินสุทธิ",
      description: `ไม่มีการทำธุรกรรม จึงไม่มีต้นทุนการทำธุรกรรม`,
      value: `NAV คงที่ที่ ${navBeforeSwing.toFixed(4)} บาท/หน่วย`,
    });
  }
  detailedCalculations.push({
    scenarioName: "สถานการณ์ที่ 1: ไม่มี Swing Pricing",
    steps: noSwingScenarioSteps,
  });

  const navAfterNoSwingFinal =
    remainingUnitsNoSwing > 0
      ? fundValueAfterNoSwing / remainingUnitsNoSwing
      : 0;
  const dilutionAmount = navBeforeSwing - navAfterNoSwingFinal;
  const dilutionPercentage =
    initialNav > 0 ? (dilutionAmount / initialNav) * 100 : 0;

  // --- 3. สถานการณ์ "มี Swing Pricing" (Liquidation Before NAV Fixed) ---
  const swingScenarioSteps: CalculationStep[] = [];
  let navAfterSwingPrice = initialNav;
  let swingFactorUsed = 0;
  let isSwingTriggered = false;
  let fundValueAfterSwing = initialFundValue;
  let remainingUnitsSwing = totalUnits;
  let amountPaidReceivedSwung = 0;

  if (Math.abs(netFlowValue) > swingThresholdValue) {
    isSwingTriggered = true;
    swingFactorUsed = transactionCostRate;

    swingScenarioSteps.push({
      step: `8. ตรวจสอบ Swing Threshold`,
      description: `|มูลค่ากระแสเงินสุทธิ| (${Math.abs(
        netFlowValue
      ).toLocaleString()} บาท) > Swing Threshold (${swingThresholdValue.toLocaleString()} บาท)?`,
      value: `${
        isSwingTriggered
          ? "ใช่, Swing Pricing ทำงาน!"
          : "ไม่, Swing Pricing ไม่ทำงาน"
      }`,
    });
    swingScenarioSteps.push({
      step: `9. คำนวณ Swing Factor`,
      description: `Swing Factor = อัตราต้นทุนการทำธุรกรรมที่กองทุนคาดการณ์`,
      value: `${(swingFactorUsed * 100).toFixed(2)}%`,
    });

    if (netFlowUnits > 0) {
      // Net Inflow: NAV ปรับขึ้น
      navAfterSwingPrice = initialNav * (1 + swingFactorUsed);
      amountPaidReceivedSwung = netFlowUnits * navAfterSwingPrice;
      fundValueAfterSwing = initialFundValue + amountPaidReceivedSwung;
      remainingUnitsSwing = totalUnits + netFlowUnits;
      swingScenarioSteps.push({
        step: `10. คำนวณ Swing NAV (เงินไหลเข้า)`,
        description: `NAV ปกติ x (1 + Swing Factor)`,
        value: `${initialNav.toFixed(4)} x (1 + ${(
          swingFactorUsed * 100
        ).toFixed(2)}%) = ${navAfterSwingPrice.toFixed(4)} บาท/หน่วย`,
      });
      swingScenarioSteps.push({
        step: `11. มูลค่าที่ผู้ซื้อจ่าย`,
        description: `จำนวนหน่วยที่ซื้อ x Swing NAV`,
        value: `${netFlowUnits.toLocaleString()} หน่วย x ${navAfterSwingPrice.toFixed(
          4
        )} บาท/หน่วย = ${amountPaidReceivedSwung.toLocaleString()} บาท`,
      });
      swingScenarioSteps.push({
        step: `12. มูลค่ากองทุนหลังการทำธุรกรรม`,
        description: `มูลค่าสินทรัพย์รวมเริ่มต้น + มูลค่าที่ผู้ซื้อจ่าย`,
        value: `${initialFundValue.toLocaleString()} + ${amountPaidReceivedSwung.toLocaleString()} = ${fundValueAfterSwing.toLocaleString()} บาท`,
      });
    } else if (netFlowUnits < 0) {
      // Net Outflow: NAV ปรับลง
      navAfterSwingPrice = initialNav * (1 - swingFactorUsed);
      amountPaidReceivedSwung = Math.abs(netFlowUnits) * navAfterSwingPrice;
      fundValueAfterSwing = initialFundValue - amountPaidReceivedSwung;
      remainingUnitsSwing = totalUnits + netFlowUnits;
      swingScenarioSteps.push({
        step: `10. คำนวณ Swing NAV (เงินไหลออก)`,
        description: `NAV ปกติ x (1 - Swing Factor)`,
        value: `${initialNav.toFixed(4)} x (1 - ${(
          swingFactorUsed * 100
        ).toFixed(2)}%) = ${navAfterSwingPrice.toFixed(4)} บาท/หน่วย`,
      });
      swingScenarioSteps.push({
        step: `11. มูลค่าที่ผู้ขายได้รับ`,
        description: `จำนวนหน่วยที่ขายคืน x Swing NAV`,
        value: `${Math.abs(
          netFlowUnits
        ).toLocaleString()} หน่วย x ${navAfterSwingPrice.toFixed(
          4
        )} บาท/หน่วย = ${amountPaidReceivedSwung.toLocaleString()} บาท`,
      });
      swingScenarioSteps.push({
        step: `12. มูลค่ากองทุนหลังการทำธุรกรรม`,
        description: `มูลค่าสินทรัพย์รวมเริ่มต้น - มูลค่าที่ผู้ขายได้รับ`,
        value: `${initialFundValue.toLocaleString()} - ${amountPaidReceivedSwung.toLocaleString()} = ${fundValueAfterSwing.toLocaleString()} บาท`,
      });
    }
    swingScenarioSteps.push({
      step: `13. NAV สำหรับผู้ลงทุนที่เหลือ (วันถัดไป)`,
      description: `(มูลค่ากองทุนหลังทำธุรกรรม) / (จำนวนหน่วยลงทุนที่เหลือ) (ในสถานการณ์นี้ NAV ไม่ถูก Dilute)`,
      value: `${fundValueAfterSwing.toLocaleString()} / ${remainingUnitsSwing.toLocaleString()} = ${initialNav.toFixed(
        4
      )} บาท/หน่วย`, // ควรกลับไปที่ initialNav เพราะไม่มี dilution
    });
  } else {
    // If not triggered, behave like no swing pricing for calculation detail perspective
    swingScenarioSteps.push({
      step: `8. ตรวจสอบ Swing Threshold`,
      description: `|มูลค่ากระแสเงินสุทธิ| (${Math.abs(
        netFlowValue
      ).toLocaleString()} บาท) <= Swing Threshold (${swingThresholdValue.toLocaleString()} บาท)`,
      value: `ไม่, Swing Pricing ไม่ทำงาน`,
    });
    swingScenarioSteps.push({
      step: `9. NAV ที่ใช้ในการซื้อ/ขาย`,
      description: `NAV ไม่มีการปรับ เนื่องจากไม่ถึง Swing Threshold`,
      value: `${navAfterSwingPrice.toFixed(4)} บาท/หน่วย`,
    });
    // Add steps that explain what happens when Swing Pricing doesn't trigger
    if (netFlowUnits !== 0) {
      // Re-use logic from 'No Swing Pricing' for detailed explanation
      const tempFundValueAfterNoSwing =
        initialFundValue + netFlowValue - actualTransactionCost;
      const tempRemainingUnitsNoSwing = totalUnits + netFlowUnits;
      const tempNavAfterNoSwing =
        tempRemainingUnitsNoSwing > 0
          ? tempFundValueAfterNoSwing / tempRemainingUnitsNoSwing
          : 0;
      const tempDilutionAmount = navBeforeSwing - tempNavAfterNoSwing;
      const tempFirstMoverAdvantage =
        Math.abs(netFlowUnits) * tempDilutionAmount;

      swingScenarioSteps.push({
        step: "10. ผลลัพธ์เมื่อ Swing ไม่ทำงาน (เหมือนสถานการณ์ที่ 1)",
        description: `เนื่องจากไม่ถึง Threshold กองทุนจะทำงานเหมือนไม่มี Swing Pricing ทำให้เกิด Dilution และ First Mover Advantage`,
        value: `NAV สำหรับผู้ลงทุนที่เหลือ: ${tempNavAfterNoSwing.toFixed(
          4
        )} บาท/หน่วย`,
      });
      if (netFlowUnits < 0) {
        swingScenarioSteps.push({
          step: "11. First Mover Advantage ที่เกิดขึ้น",
          description: `จำนวนหน่วยที่ขายคืน x มูลค่าการเจือจางต่อหน่วย`,
          value: `${Math.abs(
            netFlowUnits
          ).toLocaleString()} หน่วย x ${tempDilutionAmount.toFixed(
            4
          )} บาท/หน่วย = ${tempFirstMoverAdvantage.toLocaleString()} บาท`,
        });
      } else {
        swingScenarioSteps.push({
          step: "11. การเจือจางที่เกิดขึ้น",
          description: `NAV เริ่มต้น - NAV ผู้ลงทุนที่เหลือ`,
          value: `${navBeforeSwing.toFixed(4)} - ${tempNavAfterNoSwing.toFixed(
            4
          )} = ${tempDilutionAmount.toFixed(4)} บาท/หน่วย`,
        });
      }
    } else {
      swingScenarioSteps.push({
        step: "10. ไม่มีกระแสเงินสุทธิ",
        description: `ไม่มีการทำธุรกรรม จึงไม่มีผลกระทบต่อ NAV`,
        value: `NAV คงที่ที่ ${navBeforeSwing.toFixed(4)} บาท/หน่วย`,
      });
    }
  }
  detailedCalculations.push({
    scenarioName: "สถานการณ์ที่ 2: มี Swing Pricing",
    steps: swingScenarioSteps,
  });

  return {
    navBeforeSwing,
    navAfterNoSwing: parseFloat(navAfterNoSwingFinal.toFixed(4)),
    navAfterSwing: parseFloat(navAfterSwingPrice.toFixed(4)),
    dilutionAmount: parseFloat(dilutionAmount.toFixed(4)),
    dilutionPercentage: parseFloat(dilutionPercentage.toFixed(2)),
    firstMoverAdvantage: parseFloat(firstMoverAdvantage.toFixed(4)),
    swingFactorUsed: parseFloat((swingFactorUsed * 100).toFixed(2)),
    isSwingTriggered,
    timelineNavNoSwing: {
      day1: initialNav,
      day2: initialNav,
      day3: parseFloat(navAfterNoSwingFinal.toFixed(4)),
    },
    timelineNavSwing: {
      day1: initialNav,
      day2: parseFloat(navAfterSwingPrice.toFixed(4)),
      day3: isSwingTriggered
        ? parseFloat(initialNav.toFixed(4))
        : parseFloat(navAfterNoSwingFinal.toFixed(4)), // หากไม่ Swing, NAV สุดท้ายจะเหมือนสถานการณ์ No Swing
    },
    detailedCalculations,
  };
};

const SimulationCard: React.FC = () => {
  const [initialNav, setInitialNav] = useState(10.0);
  const [totalUnits, setTotalUnits] = useState(100000);
  const [netFlowUnits, setNetFlowUnits] = useState(-10000);
  const [transactionCostRate, setTransactionCostRate] = useState(0.01);
  const [swingThresholdPercent, setSwingThresholdPercent] = useState(2);

  const results: SimulationResults = useMemo(() => {
    return calculateSwingPricing(
      initialNav,
      totalUnits,
      netFlowUnits,
      transactionCostRate,
      swingThresholdPercent
    );
  }, [
    initialNav,
    totalUnits,
    netFlowUnits,
    transactionCostRate,
    swingThresholdPercent,
  ]);

  let flowType: string;
  if (netFlowUnits > 0) {
    flowType = "เงินไหลเข้าสุทธิ (Net Inflow)";
  } else if (netFlowUnits < 0) {
    flowType = "เงินไหลออกสุทธิ (Net Outflow)";
  } else {
    flowType = "ไม่มีการเปลี่ยนแปลง";
  }

  let flowDirectionClass: string;
  if (netFlowUnits > 0) {
    flowDirectionClass = "text-green-600";
  } else if (netFlowUnits < 0) {
    flowDirectionClass = "text-red-600";
  } else {
    flowDirectionClass = "";
  }

  return (
    <div className="min-h-screen bg-primary-foreground/50 backdrop-blur-lg p-4 sm:p-6 lg:p-8 font-inter rounded-2xl">
      <div className="container mx-auto p-4 md:p-8 bg-primary-foreground rounded-xl font-inter relative -z-10 overflow-hidden">
        <div className="max-w-4xl mx-auto rounded-xl p-6 sm:p-8 lg:p-10 -z-10 overflow-hidden">
          <div className="z-10">
            <Header
              top="เกมส์การเงิน"
              header="เกมส์ Partial Swing Pricing"
              content="มาปกป้องมูลค่าของกองทุนด้วย Partial Swing Pricing กันเถอะ"
              link="/game/lrm"
            />
          </div>

          <div className="flex flex-col gap-2 mt-8 mb-8 opacity-60 text-sm">
            <p className="flex gap-4">
              <span className="underline min-w-max">คำแนะนำ</span>
              <span className="">
                {" "}
                ปรับตัวเลขเพื่อดูการเปลี่ยนแปลงของ NAV และทำความเข้าใจกลไกของ
                Partial Swing Pricing ที่ช่วยป้องกันการเจือจาง (Dilution) และ
                First Mover Advantage
              </span>
            </p>
            <p className="flex gap-4">
              <span className="underline min-w-max">หมายเหตุ</span>
              <span> สมมติให้ Swing Factor เท่ากับอัตราต้นทุนการทำธุรกรรม</span>
            </p>
          </div>

          {/* Input Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 p-4  rounded-lg">
            <InputSlider
              label="NAV เริ่มต้น (บาท/หน่วย)"
              min={5}
              max={30}
              step={0.01}
              value={initialNav}
              onChange={setInitialNav}
              unit="บาท"
            />
            <InputSlider
              label="จำนวนหน่วยลงทุนทั้งหมดของกองทุน"
              min={10000}
              max={1000000000}
              step={1000}
              value={totalUnits}
              onChange={setTotalUnits}
              unit="หน่วย"
              displayValue={totalUnits.toLocaleString()}
            />
            <InputSlider
              label="ยอดซื้อ/ขายคืนสุทธิ (หน่วย)"
              min={-0.5 * totalUnits}
              max={0.5 * totalUnits}
              step={1000}
              value={netFlowUnits}
              onChange={setNetFlowUnits}
              unit="หน่วย"
              displayValue={netFlowUnits.toLocaleString()}
              description={
                <span className={flowDirectionClass}>{flowType}</span>
              }
            />
            <InputSlider
              label="อัตราต้นทุนการทำธุรกรรม"
              min={0.001}
              max={0.05}
              step={0.0001}
              value={transactionCostRate}
              onChange={setTransactionCostRate}
              unit="%"
              displayValue={`${(transactionCostRate * 100).toFixed(2)}`}
              description="เช่น ค่าคอมมิชชั่น, Bid-Ask Spread, Market Impact"
            />
            <InputSlider
              label="Swing Threshold"
              min={0}
              max={10}
              step={0.5}
              value={swingThresholdPercent}
              onChange={setSwingThresholdPercent}
              unit="%"
              description="กระแสเงินลงทุนสุทธิที่กระตุ้น Swing Pricing (% ของมูลค่ากองทุน)"
            />
          </div>

          <SwingPricingVisualization
            results={results}
            initialNav={initialNav}
            totalUnits={totalUnits}
            netFlowUnits={netFlowUnits}
            transactionCostRate={transactionCostRate}
            swingThresholdPercent={swingThresholdPercent}
          />
          <SwingPricingDefinition />
          <Link href="https://ns3.aimc.or.th/web/wp-content/uploads/2022/01/%E0%B9%80%E0%B9%80%E0%B8%99%E0%B8%A7%E0%B8%9B%E0%B8%8F%E0%B8%B4%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%B4-LRM-guideline-30.12.2021.pdf">
            <p className="mt-16 text-xs opacity-50">
              ที่มา: แนวปฏิบัติการใช้เครืองมือบริหารความเสียงสภาพคล่อง, AIMC
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SimulationCard;

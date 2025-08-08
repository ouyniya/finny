"use client";

import React, { useState } from "react";
import {
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Users,
  ArrowRight,
  Shield,
  Calculator,
  HelpCircle,
  LucideIcon,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import { SimulationResults } from "@/types/swing-pricing";
import SwingPricingNAVChart from "./SwingPricingNAVChart";

const SwingPricingVisualization = ({
  results,
  initialNav,
  totalUnits,
  netFlowUnits,
  transactionCostRate,
  swingThresholdPercent,
}: {
  results: SimulationResults;
  initialNav: number;
  totalUnits: number;
  netFlowUnits: number;
  transactionCostRate: number;
  swingThresholdPercent: number;
}) => {
  const isNetBuying = netFlowUnits > 0;
  const flowPercentage =
    (Math.abs(netFlowUnits * initialNav) / (initialNav * totalUnits)) * 100;

  // State for expanded calculation details
  const [expandedCalculations, setExpandedCalculations] = useState<
    Record<string, string | number | boolean>
  >({});

  const toggleCalculation = (key: string | number) => {
    setExpandedCalculations((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Tooltip component
  const TooltipWrapper = ({
    children,
    content,
    id,
  }: {
    children: React.ReactNode;
    content: string;
    id: string;
  }) => (
    <>
      <div className="flex justify-start items-start">
        <HoverCard>
          <HoverCardTrigger asChild className="hover:cursor-pointer">
            {children}
          </HoverCardTrigger>
          <HoverCardContent className="max-w-sm z-50">
            {id && (
              <div className="bg-primary-foreground/30 backdrop-blur-sm px-4 py-4 text-xs rounded-md">
                {content}
              </div>
            )}
          </HoverCardContent>
        </HoverCard>
      </div>
    </>
  );

  // Component สำหรับแสดง Scenario Card
  const ScenarioCard = ({
    title,
    subtitle,
    icon: Icon,
    iconColor,
    bgColor,
    children,
  }: {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    iconColor: string;
    bgColor: string;
    children: React.ReactNode;
  }) => (
    <div className={`${bgColor} border-2 rounded-xl p-6 shadow-lg`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-full ${iconColor}`}>
          <Icon size={24} className="text-white" />
        </div>
        <div>
          <h4 className="text-base font-bold">{title}</h4>
          <p className="text-sm ">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );

  // Component สำหรับแสดงการเปรียบเทียบ NAV พร้อม calculation details
  const NavComparison = ({
    label,
    value,
    change,
    isGood,
    calculationKey,
    formula,
    explanation,
  }: {
    label: string;
    value: number;
    change?: number;
    isGood: boolean;
    calculationKey: string;
    formula: string;
    explanation: string;
  }) => (
    <div className="rounded-lg border overflow-hidden">
      <div className="flex justify-between items-center p-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">{label}</span>
          {formula && (
            <TooltipWrapper
              id={calculationKey}
              content={explanation || "คลิกเพื่อดูรายละเอียดการคำนวณ"}
            >
              <button
                onClick={() => toggleCalculation(calculationKey)}
                className="transition-colors"
              >
                <Calculator size={16} />
              </button>
            </TooltipWrapper>
          )}
        </div>
        <div className="text-right">
          <div
            className={`font-bold ${
              isGood ? "text-green-600" : "text-red-600"
            }`}
          >
            {value.toFixed(4)} บาท
          </div>
          {change && (
            <div
              className={`text-sm ${
                change > 0 ? "text-red-500" : "text-green-500"
              }`}
            >
              {change > 0 ? "+" : ""}
              {change.toFixed(4)} ({((change / initialNav) * 100).toFixed(2)}%)
            </div>
          )}
        </div>
      </div>
      {expandedCalculations[calculationKey] && formula && (
        <div className="border-t p-4">
          <div className="flex items-start gap-2 mb-3">
            <Calculator className="mt-1" size={16} />
            <h5 className="font-bold">วิธีการคำนวณ:</h5>
          </div>
          <div className="p-3 bg-primary/10 rounded border text-sm mb-3">
            {formula}
          </div>
          {explanation && <p className="text-sm">{explanation}</p>}
        </div>
      )}
    </div>
  );

  // Calculation details for different scenarios
  const calculations = {
    initialFundValue: {
      formula: `มูลค่ากองทุน = NAV × จำนวนหน่วยทั้งหมด\n= ${initialNav.toFixed(
        4
      )} × ${totalUnits.toLocaleString()}\n= ${(
        initialNav * totalUnits
      ).toLocaleString()} บาท`,
      explanation: "คำนวณมูลค่ารวมของกองทุนก่อนมีการเปลี่ยนแปลง",
    },
    netFlow: {
      formula: `กระแสเงินสุทธิ = จำนวนหน่วย${
        isNetBuying ? "ซื้อ" : "ขาย"
      } × NAV\n= ${netFlowUnits.toLocaleString()} × ${initialNav.toFixed(
        4
      )}\n= ${(netFlowUnits * initialNav).toLocaleString()} บาท`,
      explanation: `มูลค่าของการ${
        isNetBuying ? "ซื้อ" : "ขายคืน"
      }หน่วยลงทุนสุทธิ`,
    },
    transactionCost: {
      formula: `ต้นทุนการทำธุรกรรม = |กระแสเงินสุทธิ| × อัตราต้นทุน\n= ${Math.abs(
        netFlowUnits * initialNav
      ).toLocaleString()} × ${(transactionCostRate * 100).toFixed(2)}%\n= ${(
        Math.abs(netFlowUnits * initialNav) * transactionCostRate
      ).toLocaleString()} บาท`,
      explanation:
        "ต้นทุนที่เกิดจากการซื้อ/ขายหลักทรัพย์ เช่น คอมมิชชั่น, spread, market impact",
    },
    navNoSwing: {
      formula: `NAV ใหม่ = (มูลค่าเดิม + กระแสเงิน - ต้นทุน) ÷ หน่วยใหม่\n= (${(
        initialNav * totalUnits
      ).toLocaleString()} + ${(
        netFlowUnits * initialNav
      ).toLocaleString()} - ${(
        Math.abs(netFlowUnits * initialNav) * transactionCostRate
      ).toLocaleString()}) ÷ ${(
        totalUnits + netFlowUnits
      ).toLocaleString()}\n= ${results.timelineNavNoSwing.day3.toFixed(
        4
      )} บาท/หน่วย`,
      explanation:
        "NAV ที่เหลือให้ผู้ลงทุนเดิมหลังจากมีการทำธุรกรรมโดยไม่มี Swing Pricing",
    },
    dilution: {
      formula: `การเจือจาง = NAV เดิม - NAV ใหม่\n= ${initialNav.toFixed(
        4
      )} - ${results.timelineNavNoSwing.day3.toFixed(
        4
      )}\n= ${results.dilutionAmount.toFixed(4)} บาท/หน่วย`,
      explanation: "การลดลงของมูลค่าหน่วยลงทุนที่ผู้ลงทุนเดิมต้องเสียไป",
    },
    firstMoverAdvantage: {
      formula: `First Mover Advantage = หน่วยที่${
        isNetBuying ? "ซื้อ" : "ขาย"
      } × การเจือจาง\n= ${Math.abs(
        netFlowUnits
      ).toLocaleString()} × ${results.dilutionAmount.toFixed(
        4
      )}\n= ${results.firstMoverAdvantage.toLocaleString()} บาท`,
      explanation: isNetBuying
        ? "ผลกระทบต่อผู้ลงทุนเดิมจากการที่มีคนซื้อเข้ามาใหม่"
        : "จำนวนเงินที่ผู้ขายคืนได้เปรียบโดยไม่ต้องแบกรับต้นทุน",
    },
    swingThreshold: {
      formula: `Swing Threshold = มูลค่ากองทุน × ${swingThresholdPercent}%\n= ${(
        initialNav * totalUnits
      ).toLocaleString()} × ${swingThresholdPercent}%\n= ${(
        (initialNav * totalUnits * swingThresholdPercent) /
        100
      ).toLocaleString()} บาท\n\nกระแสเงินปัจจุบัน: ${Math.abs(
        netFlowUnits * initialNav
      ).toLocaleString()} บาท`,
      explanation: "เกณฑ์ที่กำหนดว่าเมื่อไหร่ Swing Pricing จะเริ่มทำงาน",
    },
    swingNav: {
      formula: `Swing NAV = NAV เดิม × (1 ${
        isNetBuying ? "+" : "-"
      } Swing Factor)\n= ${initialNav.toFixed(4)} × (1 ${
        isNetBuying ? "+" : "-"
      } ${(transactionCostRate * 100).toFixed(
        2
      )}%)\n= ${results.navAfterSwing.toFixed(4)} บาท/หน่วย`,
      explanation: `NAV ที่ปรับแล้วสำหรับผู้${
        isNetBuying ? "ซื้อ" : "ขาย"
      }เพื่อชดเชยต้นทุนการทำธุรกรรม`,
    },
  };

  return (
    <div className="mx-auto bg-primary-foreground my-16">
      <hr className="border border-t-primary/10 mb-16" />
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl mb-8 flex items-center justify-center gap-3">
          <Shield className="" size={24} />
          ผลลัพธ์การจำลอง Swing Pricing
        </h2>
        <div className="bg-primary/10 border rounded-lg p-4  mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className="" size={20} />
            <span className="font-semibold">
              NAV เริ่มต้น: {results.navBeforeSwing.toFixed(4)} บาท/หน่วย
            </span>
            <TooltipWrapper
              id="initial-nav"
              content={calculations.initialFundValue.explanation}
            >
              <HelpCircle size={16} className="cursor-help" />
            </TooltipWrapper>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Users size={16} />
              กระแสเงิน: {isNetBuying ? "ซื้อ" : "ขาย"}{" "}
              {Math.abs(netFlowUnits).toLocaleString()} หน่วย
              <TooltipWrapper
                id="net-flow"
                content={calculations.netFlow.explanation}
              >
                <HelpCircle size={14} className="cursor-help" />
              </TooltipWrapper>
            </div>
            <div>({flowPercentage.toFixed(2)}% ของกองทุน)</div>
          </div>
        </div>
      </div>

      {/* Threshold Status */}
      <div
        className={`mb-8 p-4 rounded-xl border-2 ${
          results.isSwingTriggered
            ? "bg-green-900/25 border"
            : "bg-yellow-900/25 border"
        }`}
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          {results.isSwingTriggered ? (
            <>
              <CheckCircle className="text-green-400" size={24} />
              <span className="font-bold text-green-400">
                Swing Pricing เปิดใช้งาน! (เกิน Threshold{" "}
                {swingThresholdPercent}%)
              </span>
            </>
          ) : (
            <>
              <AlertTriangle className="text-yellow-400" size={24} />
              <span className="font-bold text-yellow-400">
                Swing Pricing ยังไม่เปิดใช้งาน (ยังไม่เกิน Threshold{" "}
                {swingThresholdPercent}%)
              </span>
            </>
          )}
          <TooltipWrapper
            id="threshold-check"
            content="คลิกเพื่อดูการคำนวณ Threshold"
          >
            <button
              onClick={() => toggleCalculation("swingThreshold")}
              className="transition-colors"
            >
              <Calculator size={18} />
            </button>
          </TooltipWrapper>
        </div>

        {expandedCalculations["swingThreshold"] && (
          <div className="mt-4 p-4 rounded-lg border">
            <div className="font-mono text-sm bg-primary/10 p-3 rounded whitespace-pre-line">
              {calculations.swingThreshold.formula}
            </div>
            <p className="text-sm  mt-2">
              {calculations.swingThreshold.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Visual Flow Diagram */}
      <div className="border rounded-xl p-6 shadow-lg mb-8">
        <h3 className="text-xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          กระบวนการ Swing Pricing
        </h3>

        <div className="flex items-center justify-between max-w-4xl mx-auto px-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-2 mx-auto">
              <Users className="text-white" size={24} />
            </div>
            <p className="text-sm font-medium">กระแสเงินเข้า/ออก</p>
            <p className="text-xs ">
              {Math.abs(netFlowUnits).toLocaleString()} หน่วย
            </p>
          </div>
          <ArrowRight className="" size={24} />
          {/* Step 2 */}
          <div className="text-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 mx-auto ${
                flowPercentage >= swingThresholdPercent
                  ? "bg-green-500"
                  : "bg-yellow-500"
              }`}
            >
              <span className="text-white font-bold">
                {flowPercentage.toFixed(1)}%
              </span>
            </div>
            <p className="text-sm font-medium">ตรวจสอบ Threshold</p>
            <p className="text-xs ">เกณฑ์ {swingThresholdPercent}%</p>
          </div>
          <ArrowRight className="" size={24} />
          {/* Step 3 */}
          <div className="text-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 mx-auto ${
                results.isSwingTriggered ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {results.isSwingTriggered ? (
                <CheckCircle className="text-white" size={24} />
              ) : (
                <AlertTriangle className="text-white" size={24} />
              )}
            </div>
            <p className="text-sm font-medium">
              {results.isSwingTriggered ? "ปรับ NAV" : "ไม่ปรับ NAV"}
            </p>
            <p className="text-xs ">
              {results.isSwingTriggered
                ? `±${results.swingFactorUsed}%`
                : "NAV เดิม"}
            </p>
          </div>
          <ArrowRight className="" size={24} />
          {/* Step 4 */}
          <div className="text-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 mx-auto ${
                results.isSwingTriggered ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <Shield className="text-white" size={24} />
            </div>
            <p className="text-sm font-medium">ผลลัพธ์</p>
            <p className="text-xs ">
              {results.isSwingTriggered ? "ป้องกันสำเร็จ" : "เกิด Dilution"}
            </p>
          </div>
        </div>

        {/* Summary Stats with Calculations */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-primary/10 p-4 rounded-lg shadow text-center relative">
            <div className="text-2xl font-bold text-sky-500">
              {flowPercentage.toFixed(1)}%
            </div>
            <div className="text-sm ">กระแสเงินต่อกองทุน</div>
            <TooltipWrapper
              id="flow-percent"
              content={`คำนวณจาก: |${(
                netFlowUnits * initialNav
              ).toLocaleString()}| ÷ ${(
                initialNav * totalUnits
              ).toLocaleString()} × 100`}
            >
              <HelpCircle
                size={14}
                className="absolute top-2 right-2  cursor-help"
              />
            </TooltipWrapper>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg shadow text-center relative">
            <div className="text-2xl font-bold text-purple-500">
              {swingThresholdPercent}%
            </div>
            <div className="text-sm ">Swing Threshold</div>
            <TooltipWrapper
              id="threshold-percent"
              content="เกณฑ์ที่กำหนดไว้สำหรับเปิดใช้ Swing Pricing"
            >
              <HelpCircle
                size={14}
                className="absolute top-2 right-2  cursor-help"
              />
            </TooltipWrapper>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg shadow text-center relative">
            <div
              className={`text-2xl font-bold ${
                results.isSwingTriggered ? "text-green-500" : ""
              }`}
            >
              {results.isSwingTriggered ? results.swingFactorUsed : 0}%
            </div>
            <div className="text-sm ">Swing Factor ที่ใช้</div>
            <TooltipWrapper
              id="swing-factor"
              content={`เท่ากับอัตราต้นทุนการทำธุรกรรม: ${(
                transactionCostRate * 100
              ).toFixed(2)}%`}
            >
              <HelpCircle
                size={14}
                className="absolute top-2 right-2  cursor-help"
              />
            </TooltipWrapper>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg shadow text-center relative">
            <div className="text-2xl font-bold text-red-500">
              {results.dilutionAmount.toFixed(4)}
            </div>
            <div className="text-sm ">การเจือจาง (Dilution)</div>
            <TooltipWrapper
              id="dilution-summary"
              content="การลดลงของมูลค่าหน่วยลงทุนที่ผู้ลงทุนเดิมต้องเสียไปหากไม่มี Swing Pricing"
            >
              <HelpCircle
                size={14}
                className="absolute top-2 right-2  cursor-help"
              />
            </TooltipWrapper>
          </div>
        </div>
      </div>

      {/* Main Comparison */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Scenario 1: No Swing Pricing */}
        <ScenarioCard
          title="สถานการณ์ที่ 1: ไม่มี Swing Pricing"
          subtitle="ผู้ลงทุนเดิมต้องรับภาระต้นทุน"
          icon={AlertTriangle}
          iconColor="bg-red-500"
          bgColor="bg-red-900/20 border border-red-900/50"
        >
          <div className="space-y-4">
            <NavComparison
              label="NAV ที่ผู้ซื้อ/ขายได้รับ"
              value={initialNav}
              isGood={false}
              calculationKey="initialNav"
              formula={calculations.initialFundValue.formula}
              explanation="ผู้ทำธุรกรรมได้รับ NAV ปกติโดยไม่ต้องชดเชยต้นทุน"
            />

            <NavComparison
              label="วันถัดไป: มูลค่ากองทุนต่อหน่วย"
              value={results.timelineNavNoSwing.day3}
              change={results.timelineNavNoSwing.day3 - initialNav}
              isGood={false}
              calculationKey="navNoSwing"
              formula={calculations.navNoSwing.formula}
              explanation={calculations.navNoSwing.explanation}
            />
            <div className="bg-red-900/50 p-4 rounded-lg border-l-4 border-red-700">
              <div className="flex items-start gap-2">
                <TrendingDown className="text-red-400 mt-1" size={20} />
                <div className="flex-1">
                  <h5 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                    ปัญหาที่เกิดขึ้น:
                  </h5>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-red-400 text-sm">
                        • <strong>Dilution:</strong>{" "}
                        {results.dilutionAmount.toFixed(4)} บาท/หน่วย (
                        {results.dilutionPercentage.toFixed(2)}%)
                      </span>
                      <TooltipWrapper
                        id="dilution-calc"
                        content="คลิกเพื่อดูการคำนวณ"
                      >
                        <button
                          onClick={() => toggleCalculation("dilution")}
                          className="text-red-400 hover:text-red-800"
                        >
                          <Calculator size={14} />
                        </button>
                      </TooltipWrapper>
                    </div>

                    {expandedCalculations["dilution"] && (
                      <div className="bg-primary-foreground p-3 rounded border">
                        <div className="font-mono text-xs bg-primary/10 p-2 rounded whitespace-pre-line mb-2">
                          {calculations.dilution.formula}
                        </div>
                        <p className="text-xs ">
                          {calculations.dilution.explanation}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-red-400 text-sm">
                        • <strong>First Mover Advantage:</strong>{" "}
                        {results.firstMoverAdvantage.toLocaleString()} บาท
                      </span>
                      <TooltipWrapper
                        id="fma-calc"
                        content="คลิกเพื่อดูการคำนวณ"
                      >
                        <button
                          onClick={() =>
                            toggleCalculation("firstMoverAdvantage")
                          }
                          className="text-red-400 hover:text-red-800"
                        >
                          <Calculator size={14} />
                        </button>
                      </TooltipWrapper>
                    </div>

                    {expandedCalculations["firstMoverAdvantage"] && (
                      <div className="bg-primary-foreground p-3 rounded border">
                        <div className="font-mono text-xs bg-primary/10 p-2 rounded whitespace-pre-line mb-2">
                          {calculations.firstMoverAdvantage.formula}
                        </div>
                        <p className="text-xs ">
                          {calculations.firstMoverAdvantage.explanation}
                        </p>
                      </div>
                    )}

                    <div className="text-red-400 text-sm">
                      • ผู้ลงทุนเดิมเสียเปรียบ
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScenarioCard>

        {/* Scenario 2: With Swing Pricing */}
        <ScenarioCard
          title="สถานการณ์ที่ 2: มี Swing Pricing"
          subtitle="ป้องกันผู้ลงทุนเดิมจากต้นทุน"
          icon={Shield}
          iconColor="bg-green-500"
          bgColor="bg-green-900/20 border border-green-900/50"
        >
          <div className="space-y-4">
            <NavComparison
              label="NAV ที่ปรับแล้วสำหรับซื้อ/ขาย"
              value={results.navAfterSwing}
              change={results.navAfterSwing - initialNav}
              isGood={true}
              calculationKey="swingNav"
              formula={calculations.swingNav.formula}
              explanation={calculations.swingNav.explanation}
            />

            <NavComparison
              label="วันถัดไป: มูลค่ากองทุนต่อหน่วย"
              value={results.timelineNavSwing.day3}
              isGood={true}
              calculationKey="swingProtection"
              formula={`NAV ผู้ลงทุนเดิม = ${initialNav.toFixed(
                4
              )} บาท/หน่วย\n(ไม่เปลี่ยนแปลงเพราะมี Swing Pricing ป้องกัน)`}
              explanation="Swing Pricing ทำให้ผู้ลงทุนเดิมไม่ได้รับผลกระทบจากต้นทุนการทำธุรกรรม"
            />
            {results.isSwingTriggered ? (
              <div className="bg-green-900/50 p-4 rounded-lg border-l-4 border-green-400">
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-green-600 mt-1" size={20} />
                  <div>
                    <h5 className="font-bold text-green-400 mb-2">
                      การป้องกันที่ทำงาน:
                    </h5>
                    <ul className="text-green-400 text-sm space-y-1">
                      <li>
                        • <strong>Swing Factor:</strong>{" "}
                        {results.swingFactorUsed}% ถูกนำมาใช้
                      </li>
                      <li>
                        • <strong>ไม่มี Dilution</strong> สำหรับผู้ลงทุนเดิม
                      </li>
                      <li>
                        • <strong>ไม่มี First Mover Advantage</strong>
                      </li>
                      <li>
                        • ผู้{isNetBuying ? "ซื้อ" : "ขาย"}
                        จ่าย/ได้รับราคายุติธรรม
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-900/25 p-4 rounded-lg border-l-4 border-yellow-700">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="text-yellow-300 mt-1" size={20} />
                  <div>
                    <h5 className="font-bold text-yellow-300 mb-2">
                      ยังไม่เพียงพอ:
                    </h5>
                    <p className="text-yellow-300 text-sm">
                      กระแสเงินยังไม่ถึง Threshold
                      จึงยังเกิดปัญหาเหมือนสถานการณ์ที่ 1
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScenarioCard>
      </div>

      {/* NAV Comparison Chart */}
      <SwingPricingNAVChart results={results} />
    </div>
  );
};

export default SwingPricingVisualization;

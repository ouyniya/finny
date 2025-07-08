"use client";

import { Dispatch, SetStateAction, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Target,
  PieChart,
  ChevronRight,
  ChevronLeft,
  InfoIcon,
} from "lucide-react";
import Header from "@/components/common/Header";
import CuteGlassButton from "@/components/ui/cute-glass-button";
import {
  INITIAL_RETIREMENT_DATA,
  initialMarketDataInputs,
} from "@/lib/constants";
import { InView } from "@/components/ui/in-view";
import Image from "next/image";
import WhatIsRetireGame from "./WhatIsRetireGame";
import { toast } from "react-toastify";
import {
  CustomTooltipProps,
  FormData,
  HistoryItem,
  StepProps,
} from "@/types/retire";

export default function RetirementPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_RETIREMENT_DATA);
  function GoToTopButton() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function simulateRetirement(
    age: number,
    retireAge: number,
    salary: number,
    saving: number,
    lifestyle: "low" | "medium" | "high",
    portfolio: { stock: number; bond: number; cash: number }
  ): HistoryItem[] {
    const expenseByLifestyle = {
      low: 15000,
      medium: 25000,
      high: 40000,
    };
    const yearsToSave = retireAge - age;
    const yearsToRetire = 90 - retireAge;

    let balance = 0;
    const history: HistoryItem[] = [];

    // Accumulation phase
    for (let i = 0; i < yearsToSave; i++) {
      balance += saving * 12;
      const stockReturn = initialMarketDataInputs[3]?.expectedReturn || 0; // Add nullish coalescing for safety
      const bondReturn = initialMarketDataInputs[1]?.expectedReturn || 0;
      const cashReturn = initialMarketDataInputs[0]?.expectedReturn || 0;

      const returnRate =
        (portfolio.stock * stockReturn +
          portfolio.bond * bondReturn +
          portfolio.cash * cashReturn) /
        100;
      balance *= 1 + returnRate;
      history.push({
        year: i + 1,
        age: age + i + 1,
        balance: Math.round(balance),
        phase: "accumulation",
      });
    }

    // Retirement phase
    for (let i = 0; i < yearsToRetire; i++) {
      balance -= expenseByLifestyle[lifestyle] * 12;
      const bondReturn = initialMarketDataInputs[1]?.expectedReturn || 0;
      const cashReturn = initialMarketDataInputs[0]?.expectedReturn || 0;

      const returnRate =
        (portfolio.stock * 0 +
          portfolio.bond * bondReturn +
          portfolio.cash * cashReturn) /
        100;
      balance *= 1 + returnRate;
      history.push({
        year: yearsToSave + i + 1,
        age: retireAge + i + 1,
        balance: Math.round(Math.max(0, balance)),
        phase: "retirement",
      });
      if (balance <= 0) break;
    }

    return history;
  }

  const steps = [
    <Step1 key="step1" />,
    <Step2 key="step2" data={formData} onChange={setFormData} />,
    <Step3 key="step3" data={formData} onChange={setFormData} />,
    <Step4 key="step4" data={formData} onChange={setFormData} />,
    <Step5
      key="step5"
      data={formData}
      graphData={simulateRetirement(
        formData.age,
        formData.retireAge,
        formData.salary,
        formData.saving,
        formData.lifestyle,
        formData.portfolio
      )}
    />,
  ];

  return (
    <div className="bg-primary-foreground/50 rounded-2xl border text-primary py-8">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <Header
            top="เกมส์การเงิน"
            header="เกมส์วางแผนเกษียณ"
            content="สร้างอนาคตที่มั่นคงด้วยการวางแผนที่ดี"
            link="/game"
          />
        </div>

        <ProgressStep step={step} setStep={setStep} />

        <div className="bg-primary-foreground backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
          <div className="transition-all duration-500 ease-in-out">
            {steps[step]}
          </div>

          <div className="mt-8 flex justify-between">
            {step > 0 && (
              <div className="max-w-max">
                <CuteGlassButton
                  onClick={() => {
                    GoToTopButton();
                    setStep((s) => s - 1);
                  }}
                  textColorFrom="#a67bf5"
                  textColorTo="#1ca2e9"
                  text="กลับ"
                  iconAfter={ChevronLeft}
                />
              </div>
            )}
            {step < steps.length - 1 && (
              <div className="max-w-max">
                <CuteGlassButton
                  onClick={() => {
                    console.log(step);
                    if (step === 3) {
                      let sumWeight: number = 0;
                      for (const [, value] of Object.entries(
                        formData.portfolio
                      )) {
                        sumWeight += +value;
                      }
                      if (sumWeight !== 100) {
                        return toast(
                          "กรุณาใส่น้ำหนักของสินทรัพย์ให้รวมกันเท่ากับ 100%"
                        );
                      }
                    }
                    GoToTopButton();
                    setStep((s) => s + 1);
                  }}
                  textColorFrom="#a67bf5"
                  textColorTo="#1ca2e9"
                  text="ถัดไป"
                  iconAfter={ChevronRight}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressStep({
  step,
  setStep,
}: {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}) {
  const steps = [
    { label: "เกริ่นนำ", icon: InfoIcon },
    { label: "ข้อมูล", icon: DollarSign },
    { label: "สไตล์ชีวิต", icon: Target },
    { label: "ลงทุน", icon: PieChart },
    { label: "สรุป", icon: TrendingUp },
  ];

  return (
    <div className="flex items-center justify-center mb-8 p-4 rounded-2xl overflow-x-auto">
      <div className="flex items-center justify-center gap-6 min-w-max">
        {steps.map((item, index) => {
          const Icon = item.icon;
          const isActive = index <= step;
          const isCompleted = index < step;

          return (
            <div key={index} className="flex items-center">
              {/* Step Icon + Label */}
              <div
                className="flex flex-col items-center text-center hover:cursor-pointer"
                onClick={() => {
                  setStep(index);
                }}
              >
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 border-indigo-400 text-white"
                      : "border-slate-600 text-slate-400"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div
                  className={`text-xs md:text-sm mt-2 font-medium ${
                    isActive ? "text-indigo-400" : "text-slate-500"
                  }`}
                >
                  {item.label}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 w-10 md:w-16 mx-2 md:mx-4 ${
                    isCompleted
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                      : "bg-slate-700"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
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
          transition={{ duration: 0.1, ease: "easeInOut" }}
          viewOptions={{ margin: "0px 0px -350px 0px" }}
        >
          <div>
            <Image
              src="/images/game/retire.jpg"
              width={850}
              height={350}
              alt="investment game"
            />
          </div>
        </InView>

        <div className="my-8 text-sm text-left">
          <WhatIsRetireGame />
        </div>
      </div>
    </div>
  );
}

function Step2({ data, onChange }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-300 mb-2">
          ข้อมูลเบื้องต้น
        </h2>
        <p className="text-slate-400">กรอกข้อมูลพื้นฐานเพื่อเริ่มวางแผน</p>
      </div>

      <div className="grid gap-4">
        <div>
          <label
            htmlFor="age"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            อายุปัจจุบัน
          </label>
          <input
            id="age"
            type="number"
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-slate-400 transition-all duration-200"
            placeholder="เช่น 30"
            value={data.age}
            max={data.retireAge - 1}
            onChange={(e) => {
              let value = Number(e.target.value);
              if (value >= data.retireAge - 1) {
                value = data.retireAge - 1;
                onChange({ ...data, age: isNaN(value) ? 0 : value });
                return null;
              }
              onChange({ ...data, age: isNaN(value) ? 0 : value });
            }}
          />
        </div>

        <div>
          <label
            htmlFor="salary"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            เงินเดือนต่อเดือน (บาท)
          </label>
          <input
            id="salary"
            type="number"
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-slate-400 transition-all duration-200"
            placeholder="เช่น 50,000"
            value={data.salary}
            onChange={(e) =>
              onChange({ ...data, salary: Number(e.target.value) })
            }
          />
        </div>

        <div>
          <label
            htmlFor="saving"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            เงินออมต่อเดือน (บาท)
          </label>
          <input
            id="saving"
            type="number"
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-slate-400 transition-all duration-200"
            placeholder="เช่น 10,000"
            value={data.saving}
            max={data.salary}
            onChange={(e) => {
              let value = Number(e.target.value);
              if (value >= data.salary) {
                value = data.salary;
                onChange({ ...data, saving: isNaN(value) ? 0 : value });
                return null;
              }
              onChange({ ...data, saving: isNaN(value) ? 0 : value });
            }}
          />
        </div>

        <div>
          <label
            htmlFor="retireAge"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            อายุที่ต้องการเกษียณ
          </label>
          <input
            id="retireAge"
            type="number"
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-slate-400 transition-all duration-200"
            placeholder="เช่น 60"
            value={data.retireAge}
            max={89}
            onChange={(e) => {
              let value = Number(e.target.value);
              if (value >= 89) {
                value = 89;
                onChange({ ...data, retireAge: isNaN(value) ? 0 : value });
                return null;
              }
              onChange({ ...data, retireAge: isNaN(value) ? 0 : value });
            }}
          />
        </div>
      </div>
    </div>
  );
}

function Step3({ data, onChange }: StepProps) {
  const lifestyles = [
    {
      value: "low",
      label: "ประหยัด",
      desc: "ค่าใช้จ่าย 15,000 บาท/เดือน",
      color: "from-green-500 to-emerald-500",
    },
    {
      value: "medium",
      label: "ปานกลาง",
      desc: "ค่าใช้จ่าย 25,000 บาท/เดือน",
      color: "from-yellow-500 to-orange-500",
    },
    {
      value: "high",
      label: "สบาย",
      desc: "ค่าใช้จ่าย 40,000 บาท/เดือน",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-300 mb-2">
          เลือกรูปแบบชีวิตหลังเกษียณ
        </h2>
        <p className="text-slate-400">ค่าใช้จ่ายที่คาดหวังในอนาคต</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {lifestyles.map((lifestyle) => (
          <div
            key={lifestyle.value}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              data.lifestyle === lifestyle.value
                ? "border-indigo-500 bg-indigo-500/10"
                : "border-slate-600 hover:border-slate-500 bg-slate-700/30"
            }`}
            onClick={() =>
              onChange({
                ...data,
                lifestyle: lifestyle.value as "low" | "medium" | "high",
              })
            }
          >
            <div className="flex flex-col items-center justify-between">
              <div>
                <Image
                  src={`/images/game/retire-${lifestyle.value}.png`}
                  width={300}
                  height={300}
                  alt={data.lifestyle}
                  className="rounded-lg mb-4"
                />
                <h3 className="font-semibold text-white text-center">
                  {lifestyle.label}
                </h3>
                <p className="text-sm text-slate-400 text-center">
                  {lifestyle.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step4({ data, onChange }: StepProps) {
  const portfolioTypes = [
    { key: "stock", label: "หุ้น", desc: "ผลตอบแทนสูง ความเสี่ยงสูง" },
    { key: "bond", label: "พันธบัตร", desc: "ผลตอบแทนปานกลาง ความเสี่ยงต่ำ" },
    {
      key: "cash",
      label: "เงินฝากและตราสารหนี้ระยะสั้น",
      desc: "ผลตอบแทนต่ำ ความเสี่ยงต่ำที่สุด",
    },
  ];

  const total =
    data.portfolio.stock + data.portfolio.bond + data.portfolio.cash;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-300 mb-2">
          จัดสรรพอร์ตการลงทุน
        </h2>
        <p className="text-slate-400">กระจายความเสี่ยงด้วยการลงทุนหลากหลาย</p>
      </div>

      <div className="grid gap-4">
        {portfolioTypes.map((type) => (
          <div
            key={type.key}
            className="bg-slate-700/30 rounded-xl p-4 border border-slate-600"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-semibold text-white">{type.label}</h3>
                <p className="text-sm text-slate-400">{type.desc}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-indigo-400">
                  {data.portfolio[type.key as keyof FormData["portfolio"]]}%
                </div>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={data.portfolio[type.key as keyof FormData["portfolio"]]}
              onChange={(e) => {
                onChange({
                  ...data,
                  portfolio: {
                    ...data.portfolio,
                    [type.key]: Number(e.target.value),
                  },
                });
              }}
              className="w-full mt-2 accent-indigo-500"
            />
          </div>
        ))}
      </div>

      <div
        className={`text-center p-4 rounded-xl ${
          total === 100
            ? "bg-teal-500/10 border border-teal-500/30 text-teal-400"
            : "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400"
        }`}
      >
        <div className="font-semibold">รวม: {total}%</div>
        {total !== 100 && <div className="text-sm mt-1">แนะนำให้รวม 100%</div>}
      </div>
    </div>
  );
}

function Step5({
  data,
  graphData,
}: {
  data: FormData;
  graphData: HistoryItem[];
}) {
  const lastBalance = graphData[graphData.length - 1]?.balance || 0;
  const isSuccessful = lastBalance > 0;

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3">
          <p className="text-indigo-300 font-medium">{`อายุ ${data.age} ปี`}</p>
          <p className="text-white">{`ยอดเงิน: ${data.balance.toLocaleString()} บาท`}</p>
          <p className="text-slate-400 text-sm">
            {data.phase === "accumulation" ? "ระยะสะสม" : "ระยะเกษียณ"}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-300 mb-2">
          สรุปผลการวางแผนเกษียณ
        </h2>
        <p className="text-slate-400">ภาพรวมการเงินตลอดช่วงชีวิต</p>
      </div>

      {isSuccessful ? (
        <Image
          src="/images/game/retire-success.png"
          width={850}
          height={400}
          alt="retire success"
          className="mb-12"
        />
      ) : (
        <Image
          src="/images/game/retire-fail.png"
          width={850}
          height={400}
          alt="retire success"
          className="mb-12"
        />
      )}

      <div
        className={`p-4 rounded-xl border ${
          isSuccessful
            ? "bg-teal-500/10 border-teal-500/30"
            : "bg-red-500/10 border-red-500/30"
        }`}
      >
        <div
          className={`font-semibold mb-2 ${
            isSuccessful ? "text-teal-400" : "text-red-400"
          }`}
        >
          {isSuccessful
            ? "✓ แผนการเกษียณสำเร็จ"
            : "⚠️ แผนการเกษียณต้องปรับปรุง"}
        </div>
        <div className="text-slate-300">
          {isSuccessful
            ? `เงินของคุณจะเพียงพอใช้จนวัย ${
                graphData[graphData.length - 1]?.age
              } ปี`
            : "ลองเพิ่มเงินออมหรือลดค่าใช้จ่ายหลังเกษียณ"}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600">
          <div className="text-slate-400 text-sm">ระยะเวลาสะสม</div>
          <div className="text-2xl font-bold text-teal-400">
            {data.retireAge - data.age} ปี
          </div>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600">
          <div className="text-slate-400 text-sm">เงินออมต่อปี</div>
          <div className="text-2xl font-bold text-indigo-400">
            {(data.saving * 12).toLocaleString()} บาท
          </div>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600">
          <div className="text-slate-400 text-sm">สถานะ</div>
          <div
            className={`text-2xl font-bold ${
              isSuccessful ? "text-teal-400" : "text-red-400"
            }`}
          >
            {isSuccessful ? "เพียงพอ" : "ไม่เพียงพอ"}
          </div>
        </div>
      </div>

      <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600">
        <h3 className="text-lg font-semibold text-white mb-4">
          กราฟแสดงยอดเงินคงเหลือ
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%" className="text-sm">
            <AreaChart data={graphData}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis
                dataKey="age"
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8" }}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8" }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBalance)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

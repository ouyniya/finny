"use client";

import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCheck } from "lucide-react";
import { useState } from "react";

const LiquidityFeePage = () => {
  // Individual transaction inputs
  const [person1, setPerson1] = useState({
    name: "นาย A",
    amount: 100000,
    holdingPeriod: 30,
  });

  const [person2, setPerson2] = useState({
    name: "นาย B",
    amount: 100000,
    holdingPeriod: 15,
  });

  const [person3, setPerson3] = useState({
    name: "นาย C",
    amount: 100000,
    holdingPeriod: 5,
  });

  // Fund parameters
  const [fundParams, setFundParams] = useState({
    totalFundValue: 10000000, // 10 ล้านบาท
    liquidAssetRatio: 15, // 15% เป็นสินทรัพย์สภาพคล่อง
    tradingCostRate: 0.3, // 0.3% trading cost
    marketImpactRate: 0.2, // 0.2% market impact
  });

  // Customizable rules
  const [rules, setRules] = useState({
    shortHoldThreshold: 7,
    shortHoldFee: 2.0,
    mediumHoldThreshold: 30,
    mediumHoldMinAmount: 50000,
    mediumHoldFee: 1.0,
    largeAmountThreshold: 1000000,
    largeAmountFee: 0.5,
  });

  const updateRule = (key, value) => {
    setRules((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const updatePerson = (personSetter, field, value) => {
    personSetter((prev) => ({ ...prev, [field]: value }));
  };

  const updateFundParam = (key, value) => {
    setFundParams((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  // Check liquidity fee for individual person
  const checkIndividualFee = (person) => {
    let hasLiquidityFee = false;
    let feeRate = 0;
    let reason = "";

    // Rule 1: Short holding period
    if (person.holdingPeriod < rules.shortHoldThreshold) {
      hasLiquidityFee = true;
      feeRate = rules.shortHoldFee;
      reason = `ถือครองน้อยกว่า ${rules.shortHoldThreshold} วัน`;
    }
    // Rule 2: Medium holding + large amount
    else if (
      person.holdingPeriod < rules.mediumHoldThreshold &&
      person.amount >= rules.mediumHoldMinAmount
    ) {
      hasLiquidityFee = true;
      feeRate = rules.mediumHoldFee;
      reason = `ถือครองน้อยกว่า ${
        rules.mediumHoldThreshold
      } วัน และขายคืนมากกว่า ${rules.mediumHoldMinAmount.toLocaleString()} บาท`;
    }
    // Rule 3: Large single redemption
    else if (person.amount >= rules.largeAmountThreshold) {
      hasLiquidityFee = true;
      feeRate = rules.largeAmountFee;
      reason = `ขายคืนครั้งเดียวมากกว่า ${rules.largeAmountThreshold.toLocaleString()} บาท`;
    }

    const feeAmount = (person.amount * feeRate) / 100;

    return {
      hasLiquidityFee,
      feeRate: feeRate.toFixed(2),
      feeAmount: feeAmount.toFixed(0),
      reason,
      netAmount: person.amount - feeAmount,
    };
  };

  // Calculate fund impact
  const calculateFundImpact = () => {
    const person1Result = checkIndividualFee(person1);
    const person2Result = checkIndividualFee(person2);
    const person3Result = checkIndividualFee(person3);

    const totalRedemption = person1.amount + person2.amount + person3.amount;
    const totalFeesCollected =
      parseFloat(person1Result.feeAmount) +
      parseFloat(person2Result.feeAmount) +
      parseFloat(person3Result.feeAmount);

    // Fund liquidity analysis
    const availableLiquidity =
      (fundParams.totalFundValue * fundParams.liquidAssetRatio) / 100;
    const liquidityRatio = availableLiquidity / totalRedemption;

    // Actual fund costs for selling assets
    const assetsToSell = Math.max(0, totalRedemption - availableLiquidity);
    const tradingCost = (assetsToSell * fundParams.tradingCostRate) / 100;
    const marketImpact = (assetsToSell * fundParams.marketImpactRate) / 100;
    const totalFundCosts = tradingCost + marketImpact;

    // Cost coverage analysis
    const costCoverageRatio = totalFeesCollected / (totalFundCosts || 1);
    const netFundImpact = totalFundCosts - totalFeesCollected;

    return {
      person1Result,
      person2Result,
      person3Result,
      totalRedemption,
      totalFeesCollected,
      availableLiquidity,
      liquidityRatio,
      assetsToSell,
      tradingCost,
      marketImpact,
      totalFundCosts,
      costCoverageRatio,
      netFundImpact,
      remainingFundValue: fundParams.totalFundValue - totalRedemption,
    };
  };

  const impact = calculateFundImpact();

  const PersonCard = ({ person, result, setPerson, personName }) => (
    <div
      className={`p-4 rounded-lg ${
        result.hasLiquidityFee ? "bg-sky-500/15" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className=" text-lg">{person.name}</h3>
        <div className="text-2xl">
          {result.hasLiquidityFee ? (
            <CheckCheck size={16} className="text-sky-500" />
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="block text-xs  mb-1">
            จำนวนขายคืน: {person.amount.toLocaleString()} บาท
          </Label>
          <input
            type="range"
            min="10000"
            max="2000000"
            step="10000"
            value={person.amount}
            onChange={(e) =>
              updatePerson(setPerson, "amount", Number(e.target.value))
            }
            className="w-full h-2 bg-gray-200 rounded-lg"
          />
        </div>

        <div>
          <Label className="block text-xs  mb-1">
            ระยะเวลาถือครอง: {person.holdingPeriod} วัน
          </Label>
          <input
            type="range"
            min="1"
            max="365"
            value={person.holdingPeriod}
            onChange={(e) =>
              updatePerson(setPerson, "holdingPeriod", Number(e.target.value))
            }
            className="w-full h-2 bg-gray-200 rounded-lg"
          />
        </div>

        <div className="pt-2 border-t text-sm">
          {result.hasLiquidityFee ? (
            <div>
              <div className="text-red-600 ">
                ค่าธรรมเนียม: {result.feeRate}%
              </div>
              <div className="text-red-600">
                จ่าย: {Number(result.feeAmount).toLocaleString()} บาท
              </div>
              <div className="">
                ได้รับ: {Math.round(result.netAmount).toLocaleString()} บาท
              </div>
              <div className="text-xs text-sky-500 mt-1">
                เนื่องจาก {result.reason}
              </div>
            </div>
          ) : (
            <div>
              <div className="">ไม่มีค่าธรรมเนียม</div>
              <div className="">
                ได้รับเต็ม: {person.amount.toLocaleString()} บาท
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary-foreground/50 backdrop-blur-lg p-4 sm:p-6 lg:p-8 font-inter rounded-2xl">
      <div className="container mx-auto p-4 md:p-8 bg-primary-foreground rounded-xl font-inter relative -z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto rounded-xl p-6 sm:p-8 lg:p-10 -z-10 overflow-hidden">
          <div className="z-10 mb-8">
            <div className="text-center">
              <h1 className="text-3xl  mb-2">เกมส์ Liquidity Fee Impact</h1>
              <p className="text-lg opacity-75 mb-4">
                จำลองผลกระทบต่อกองทุนและต้นทุนการซื้อขายจริง
              </p>
            </div>
          </div>

          <div className="w-full mx-auto min-h-screen p-6">
            <div className="w-full mx-auto space-y-8">
              {/* Fund Parameters */}
              <div className="rounded-xl p-6">
                <h2 className="text-lg  mb-4">ข้อมูลกองทุน</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="block text-xs  mb-1">
                      มูลค่ากองทุน: {fundParams.totalFundValue.toLocaleString()}{" "}
                      บาท
                    </Label>
                    <input
                      type="range"
                      min="1000000"
                      max="100000000000"
                      step="1000000"
                      value={fundParams.totalFundValue}
                      onChange={(e) =>
                        updateFundParam("totalFundValue", e.target.value)
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs  mb-1">
                      สินทรัพย์สภาพคล่อง: {fundParams.liquidAssetRatio}%
                    </Label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={fundParams.liquidAssetRatio}
                      onChange={(e) =>
                        updateFundParam("liquidAssetRatio", e.target.value)
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs  mb-1">
                      Trading Cost: {fundParams.tradingCostRate}%
                    </Label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      value={fundParams.tradingCostRate}
                      onChange={(e) =>
                        updateFundParam("tradingCostRate", e.target.value)
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs  mb-1">
                      Market Impact: {fundParams.marketImpactRate}%
                    </Label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      value={fundParams.marketImpactRate}
                      onChange={(e) =>
                        updateFundParam("marketImpactRate", e.target.value)
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Rules Panel */}
              <div className="w-full mx-auto">
                <div className="rounded-xl p-6">
                  <h2 className="text-xl  mb-4">กฎ Liquidity Fee</h2>

                  <div className="flex w-full justify-between gap-4">
                    {/* Short Hold Rule */}
                    <div className="basis-1/3 p-3 bg-primary/8 rounded-lg">
                      <h3 className=" mb-4 text-sm font-semibold">
                        กฎ 1: ถือครองสั้น
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <Label className="block text-xs  mb-1">วัน</Label>
                          <Input
                            type="number"
                            value={rules.shortHoldThreshold}
                            onChange={(e) =>
                              updateRule("shortHoldThreshold", e.target.value)
                            }
                            className="w-full p-1 text-xs border rounded"
                          />
                        </div>
                        <div>
                          <Label className="block text-xs  mb-1">Fee (%)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={rules.shortHoldFee}
                            onChange={(e) =>
                              updateRule("shortHoldFee", e.target.value)
                            }
                            className="w-full p-1 text-xs border rounded"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Medium Hold Rule */}
                    <div className="basis-1/3 p-3 bg-primary/8 rounded-lg">
                      <h3 className=" mb-4 text-sm font-semibold">
                        กฎ 2: ปานกลาง+มาก
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <Label className="block text-xs  mb-1">วัน</Label>
                          <Input
                            type="number"
                            value={rules.mediumHoldThreshold}
                            onChange={(e) =>
                              updateRule("mediumHoldThreshold", e.target.value)
                            }
                            className="w-full p-1 text-xs border rounded"
                          />
                        </div>
                        <div>
                          <Label className="block text-xs  mb-1">จำนวน</Label>
                          <Input
                            type="number"
                            step="10000"
                            value={rules.mediumHoldMinAmount}
                            onChange={(e) =>
                              updateRule("mediumHoldMinAmount", e.target.value)
                            }
                            className="w-full p-1 text-xs border rounded"
                          />
                        </div>
                        <div>
                          <Label className="block text-xs  mb-1">Fee (%)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={rules.mediumHoldFee}
                            onChange={(e) =>
                              updateRule("mediumHoldFee", e.target.value)
                            }
                            className="w-full p-1 text-xs border rounded"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Large Amount Rule */}
                    <div className="basis-1/3 p-3 bg-primary/8 rounded-lg">
                      <h3 className=" mb-4 text-sm font-semibold">
                        กฎ 3: จำนวนมาก
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <Label className="block text-xs  mb-1">จำนวน</Label>
                          <Input
                            type="number"
                            step="100000"
                            value={rules.largeAmountThreshold}
                            onChange={(e) =>
                              updateRule("largeAmountThreshold", e.target.value)
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <Label className="block text-xs  mb-1">Fee (%)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={rules.largeAmountFee}
                            onChange={(e) =>
                              updateRule("largeAmountFee", e.target.value)
                            }
                            className="w-full p-1 text-xs border rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reset Button */}
                  <Button
                    onClick={() =>
                      setRules({
                        shortHoldThreshold: 7,
                        shortHoldFee: 2.0,
                        mediumHoldThreshold: 30,
                        mediumHoldMinAmount: 50000,
                        mediumHoldFee: 1.0,
                        largeAmountThreshold: 1000000,
                        largeAmountFee: 0.5,
                      })
                    }
                    className="w-full mt-4 py-2 hover:cursor-pointer transition-colors text-sm"
                  >
                    รีเซ็ต
                  </Button>
                </div>
              </div>

              <div className="text-center mb-12">
                <p className="text-sm opacity-75">
                  เรียกเก็บค่าธรรมเนียมเฉพาะคนที่ละเมิดกฎเท่านั้น
                </p>
              </div>

              {/* Individual Person Cards */}
              <div className="grid grid-cols-3 gap-4">
                <PersonCard
                  person={person1}
                  result={impact.person1Result}
                  setPerson={setPerson1}
                  personName="person1"
                />
                <PersonCard
                  person={person2}
                  result={impact.person2Result}
                  setPerson={setPerson2}
                  personName="person2"
                />
                <PersonCard
                  person={person3}
                  result={impact.person3Result}
                  setPerson={setPerson3}
                  personName="person3"
                />
              </div>

              {/* Fund Impact Analysis */}
              <div className="mt-8 rounded-xl p-6">
                <h2 className="text-xl mb-4">ผลกระทบต่อกองทุน</h2>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col items-center justify-center text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl ">
                      {impact.totalRedemption.toLocaleString()}
                    </div>
                    <div className="text-xs">ยอดขายคืนรวม (บาท)</div>
                  </div>

                  <div className="flex flex-col items-center justify-center text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl  text-green-600">
                      +{impact.totalFeesCollected.toLocaleString()}
                    </div>
                    <div className="text-xs">ค่าธรรมเนียมที่เก็บได้ (บาท)</div>
                  </div>

                  <div className="flex flex-col items-center justify-center text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl  text-red-600">
                      -{impact.totalFundCosts.toLocaleString()}
                    </div>
                    <div className="text-xs">ต้นทุนการขายสินทรัพย์ (บาท)</div>
                  </div>

                  <div
                    className={`flex flex-col items-center  justify-center text-center p-4 rounded-lg ${
                      impact.netFundImpact > 0
                        ? "bg-red-900/10"
                        : "bg-green-900/10"
                    }`}
                  >
                    <div
                      className={`text-2xl  ${
                        impact.netFundImpact > 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {impact.netFundImpact > 0 ? "-" : "+"}
                      {Math.abs(impact.netFundImpact).toLocaleString()}
                    </div>
                    <div className="text-xs">ผลกระทบสุทธิ (บาท)</div>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                  <div className="space-y-4">
                    <h3 className="">การวิเคราะห์สภาพคล่อง</h3>
                    <div className="bg-primary/5 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>สินทรัพย์สภาพคล่องที่มี:</span>
                        <span className="">
                          {impact.availableLiquidity.toLocaleString()} บาท
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>ยอดขายคืนรวม:</span>
                        <span className="">
                          {impact.totalRedemption.toLocaleString()} บาท
                        </span>
                      </div>
                      {/* <div className="flex justify-between">
                        <span>Liquidity Ratio:</span>
                        <span
                          className={` ${
                            impact.liquidityRatio >= 1
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {impact.liquidityRatio.toFixed(2)}x
                        </span>
                      </div> */}
                      <div className="flex justify-between">
                        <span>ต้องขายสินทรัพย์:</span>
                        <span
                          className={` ${
                            impact.assetsToSell > 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {impact.assetsToSell.toLocaleString()} บาท
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="">ต้นทุนการซื้อขายจริง</h3>
                    <div className="bg-primary/5 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>
                          Trading Cost ({fundParams.tradingCostRate}%):
                        </span>
                        <span className=" text-red-600">
                          {impact.tradingCost.toLocaleString()} บาท
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          Market Impact ({fundParams.marketImpactRate}%):
                        </span>
                        <span className=" text-red-600">
                          {impact.marketImpact.toLocaleString()} บาท
                        </span>
                      </div>
                      <hr />
                      <div className="flex justify-between ">
                        <span>รวมต้นทุนการขาย:</span>
                        <span className="text-red-600">
                          {impact.totalFundCosts.toLocaleString()} บาท
                        </span>
                      </div>
                      {/* <div className="flex justify-between">
                        <span>Coverage Ratio:</span>
                        <span
                          className={` ${
                            impact.costCoverageRatio >= 1
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {impact.costCoverageRatio.toFixed(2)}x
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>

                {/* Impact Summary */}
                <div className="mt-6 p-4 rounded-lg ${impact.netFundImpact > 0 ? 'bg-red-50' : 'bg-green-50'}">
                  <h3 className={` mb-2`}>สรุปผลกระทบ:</h3>
                  <div className="text-sm">
                    {impact.netFundImpact > 0 ? (
                      <>
                        <p>
                          • กองทุน<strong>ขาดทุน</strong>{" "}
                          {Math.abs(impact.netFundImpact).toLocaleString()} บาท
                          จากการขายคืนนี้
                        </p>
                        <p>
                          • ค่าธรรมเนียมที่เก็บ<strong>ไม่เพียงพอ</strong>
                          ชดเชยต้นทุนการขายสินทรัพย์
                        </p>
                        <p>
                          • ผู้ถือหน่วยคนอื่นๆ จะ<strong>รับผลกระทบ</strong>
                          จากการลดลงของ NAV
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          • กองทุน<strong>กำไร</strong>{" "}
                          {Math.abs(impact.netFundImpact).toLocaleString()} บาท
                          จากการขายคืนนี้
                        </p>
                        <p>
                          • ค่าธรรมเนียมที่เก็บ<strong>เพียงพอ</strong>
                          ชดเชยต้นทุนและเหลือเป็นกำไร
                        </p>
                        <p>
                          • ผู้ถือหน่วยคนอื่นๆ <strong>ได้ประโยชน์</strong>
                          จากค่าธรรมเนียมที่เหลือ
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidityFeePage;

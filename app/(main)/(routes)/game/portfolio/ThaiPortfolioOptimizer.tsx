"use client";

import React, { useCallback, useEffect, useState } from "react";

import { ChevronRight, Gem, Minus, Plus, X } from "lucide-react";
import { useCorrelations } from "@/hooks/useCorrelations";

import {
  AssetInput,
  FrontierPoint,
  OptimizationResult,
  UserProfile,
} from "@/types/portfolio";
import { MPTEngine } from "@/engine/MPTEngine";
import RiskFree from "@/app/(main)/(routes)/game/portfolio/riskfree";
import Header from "@/components/common/Header";

import { Particles } from "@/components/ui/magicui/particles";
import { PortfolioDisplay } from "@/app/(main)/(routes)/game/portfolio/PortfolioDisplay";
import {
  assetTickers,
  INVESTMENT_AMOUNT,
  INVESTMENT_HORIZON,
  MAX_EXPECTED_RETURN,
  MIN_VOLATILITY,
  RISK_FREE_RATE,
  initialMarketDataInputs,
} from "@/lib/constants";
import CuteGlassButton from "@/components/ui/cute-glass-button";
import { toast } from "react-toastify";
import WhatIsPortfolioGame from "./WhatIsPortfolioGame";
import Image from "next/image";
import { InView } from "@/components/ui/in-view";

interface AssetData {
  id: string;
  name: string;
  expectedReturn: number;
  volatility: number;
}

// ฟังก์ชันดึงค่าจาก API ของคุณ
async function fetchAssetData(dateValue: string): Promise<AssetData[]> {
  try {
    const results = await Promise.allSettled(
      assetTickers.map(async (asset) => {
        const response = await fetch(
          `/api/marketdata?index=${asset.ticker}&dateValue=${dateValue}`
        );
        if (!response.ok) throw new Error(`API failed for ${asset.ticker}`);
        const data = await response.json();
        return {
          id: asset.id,
          name: asset.name,
          expectedReturn: data.expectedReturn,
          volatility: data.volatility,
        };
      })
    );

    // filter errors & return valid ones
    return results.filter(isFulfilled).map((r) => r.value);
  } catch (err) {
    console.error("fetchAssetData error:", err);
    return [];
  }
}

function isFulfilled<T>(
  result: PromiseSettledResult<T>
): result is PromiseFulfilledResult<T> {
  return result.status === "fulfilled";
}

// --- Main Component ---
export default function ThaiPortfolioOptimizer() {
  const {
    correlations,
    corrError,
    loadCorrelations,
    updateCorrelation,
    getCorrelationValue,
    removeAssetCorrelations,
  } = useCorrelations();

  const handleLoadClick = () => {
    const today = new Date().toISOString().split("T")[0];
    const assetIds = assetTickers.map((a) => a.ticker);
    loadCorrelations(assetIds, today);
  };

  const [mktDataLoading, setMktDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showPortfolio, setShowPortfolio] = useState(false);
  const [portfolioResult, setPortfolioResult] =
    useState<OptimizationResult | null>(null);
  const [frontierData, setFrontierData] = useState<FrontierPoint[] | null>(
    null
  );
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // Default market data for initial input
  const [marketDataInputs, setMarketDataInputs] = useState<AssetInput[]>(
    initialMarketDataInputs
  );

  // Default risk-free rate
  const [riskFreeRate, setRiskFreeRate] = useState(RISK_FREE_RATE);

  // User profile inputs
  const [investmentAmount, setInvestmentAmount] =
    useState<number>(INVESTMENT_AMOUNT);
  const [investmentHorizon, setInvestmentHorizon] =
    useState<number>(INVESTMENT_HORIZON);

  const loadData = useCallback(async () => {
    setMktDataLoading(true);
    setError(null);

    try {
      const today = new Date().toISOString().split("T")[0];
      const data = await fetchAssetData(today);

      if (data.length === 0) {
        throw new Error("No market data available");
      }

      setMarketDataInputs(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setMktDataLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    handleLoadClick()
  }, [loadData]);

  const handleAddAsset = () => {
    setMarketDataInputs((prevAssets) => {
      const newAsset = {
        id: `asset-${prevAssets.length + 1}`,
        name: `asset-${prevAssets.length + 1}`,
        expectedReturn: 0,
        volatility: MIN_VOLATILITY / 100,
      };

      // Add new correlations for the new asset with existing assets
      prevAssets.forEach((existingAsset) => {
        updateCorrelation(newAsset.id, existingAsset.id, 0);
      });

      return [...prevAssets, newAsset];
    });
  };

  const handleRemoveAsset = (id: string) => {
    setMarketDataInputs((prevAssets) =>
      prevAssets.filter((asset) => asset.id !== id)
    );
    // ลบ correlations ที่เกี่ยวข้องกับ asset นี้
    removeAssetCorrelations(id);
  };

  const handleAssetInputChange = (
    id: string,
    field: keyof AssetInput,
    value: string
  ) => {
    if (field === "expectedReturn" && +value > MAX_EXPECTED_RETURN) {
      toast("ผลตอบแทนคาดหวังไม่ควรเกิน 100% ต่อปี");
      value = String(MAX_EXPECTED_RETURN);
    }

    if (field === "volatility" && +value < MIN_VOLATILITY) {
      toast("ค่าความผันผวนต่ำสุดไม่ควรน้อยกว่า 0%");
      value = String(MIN_VOLATILITY);
    }

    if (field === "name" && !value.trim()) {
      toast("กรุณาใส่ชื่อสินทรัพย์ด้วยค่ะ");
      value = "สินทรัพย์";
    }

    setMarketDataInputs(
      marketDataInputs.map((asset) =>
        asset.id === id
          ? {
              ...asset,
              [field]:
                field === "name"
                  ? value
                  : parseFloat(value) /
                      (field === "expectedReturn" || field === "volatility"
                        ? 100
                        : 1) || 0,
            }
          : asset
      )
    );
  };

  const handleCorrelationChange = (
    asset1Id: string,
    asset2Id: string,
    value: string
  ) => {
    const num = parseFloat(value) || 0;
    updateCorrelation(asset1Id, asset2Id, num);
  };

  function GoToTopButton() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const handleCalculatePortfolio = async () => {
    const error: string[] = [];

    setLoading(true);

    if (marketDataInputs.length === 0) {
      return;
    }

    // Validate inputs
    const isValid =
      marketDataInputs.every((asset) => {
        if (!asset.name) {
          error.push("ชื่อสินทรัพย์ไม่ถูกต้อง");
        }
        if (asset.expectedReturn > MAX_EXPECTED_RETURN) {
          error.push("ผลตอบแทนที่คาดหวังไม่ถูกต้อง");
        }
        if (asset.volatility * 100 < MIN_VOLATILITY) {
          error.push(
            `ค่าความผันผวนไม่ถูกต้อง ${
              asset.volatility * 100
            } < ${MIN_VOLATILITY} `
          );
        }

        return (
          asset.name &&
          asset.expectedReturn <= MAX_EXPECTED_RETURN &&
          asset.volatility * 100 >= MIN_VOLATILITY
        );
      }) &&
      investmentAmount > 0 &&
      investmentHorizon > 0;

    if (!isValid) {
      toast(error.join(", "));
      setLoading(false);
      return;
    }

    const mptEngine = new MPTEngine(riskFreeRate, correlations);
    const { bestPortfolio, frontier } =
      mptEngine.optimizePortfolio(marketDataInputs);

    // const averagedBestPortfolio =
    //   mptEngine.runMultipleOptimizationsAndAverage(marketDataInputs);

    setPortfolioResult(bestPortfolio);
    setFrontierData(frontier);
    setUserProfile({ investmentAmount, investmentHorizon });
    setLoading(false);
    setShowPortfolio(true);

    // go to top
    GoToTopButton();
  };

  const handleRestart = () => {
    setShowPortfolio(false);
    setPortfolioResult(null);
    setFrontierData(null);
    setUserProfile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-foreground p-4">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mb-4"></div>
          <p className="text-lg text-primary/50">กำลังคำนวณพอร์ตของคุณ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-foreground/50 backdrop-blur-lg p-4 sm:p-6 lg:p-8 font-inter rounded-2xl">
      {!showPortfolio ? (
        <div className="container mx-auto p-4 md:p-8 bg-primary-foreground rounded-xl font-inter relative -z-10 overflow-hidden">
          <div className="max-w-4xl mx-auto rounded-xl p-6 sm:p-8 lg:p-10 -z-10 overflow-hidden">
            <div className="absolute -top-5 left-0 overflow-hidden h-[400px] w-full -z-1">
              <Particles />
            </div>
            <div className="absolute -top-5 left-0 w-full opacity-40 h-[280px] -z-5"></div>

            <div className="absolute -top-5 left-0 w-full h-[280px] -z-4 bg-gradient-to-b from-transparent to-primary-foreground"></div>

            <div className="z-10">
              <Header
                top="เกมส์การลงทุน"
                header="เกมส์จัดพอร์ตลงทุน"
                content="คํานวณพอร์ตลงทุนที่เหมาะสมที่สุดสําหรับคุณ"
                link="/game"
              />
            </div>

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
              <div className="mt-12">
                <Image
                  src="/images/game/investgame.png"
                  width={850}
                  height={350}
                  alt="investment game"
                />
              </div>
            </InView>

            <div className="my-8 text-sm">
              <WhatIsPortfolioGame />
            </div>

            {/* Market Data Input */}
            <div className="mb-8 mt-24 rounded-lg">
              <div className="grid grid-cols-1 gap-1">
                <h2 className="flex gap-4 items-center">
                  <span className="text-lg text-primary">
                    ข้อมูลสินทรัพย์ (Expected Return & Volatility)
                  </span>

                  <div className="max-w-max">
                    <CuteGlassButton
                      onClick={loadData}
                      textColorFrom="#a67bf5"
                      textColorTo="#1ca2e9"
                      text="โหลดข้อมูลใหม่"
                      iconAfter={ChevronRight}
                      iconAnimation=""
                      className="text-sm"
                    />
                  </div>
                </h2>
                <p className="text-xs opacity-60 mb-8">หน่วย % ต่อปี</p>
              </div>

              {mktDataLoading && (
                <div className="animate-pulse text-gray-500">
                  Loading market data...
                </div>
              )}

              {error && (
                <div className="text-red-500">
                  ⚠️ Failed to load: {error}
                  <button
                    onClick={loadData}
                    className="ml-2 px-3 py-1 bg-red-100 rounded hover:bg-red-200"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!mktDataLoading && !error && (
                <div className="grid grid-col-1 lg:grid-cols-2 gap-6">
                  {marketDataInputs.map((asset) => (
                    <div
                      key={asset.id}
                      className="relative grid grid-cols-1 gap-4 items-end p-6 bg-gradient-to-br from-indigo-100/10 to-indigo-500/40 rounded-xl backdrop-blur-sm border border-white/10 shadow-sm text-primary"
                    >
                      <div className="w-full flex flex-col gap-2">
                        <div className="flex items-center">
                          <Gem className="h-5 w-5 text-indigo-500 mr-2" />
                          <h1 className="font-semibold">{asset.name}</h1>{" "}
                          <div className="absolute top-2 right-2">
                            <button
                              onClick={() => handleRemoveAsset(asset.id)}
                              className="flex justify-center items-center h-6 w-6 text-white rounded-full hover:bg-red-500 transition-colors duration-200 hover:cursor-pointer"
                              aria-label="Remove asset"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <div className="w-full rounded-lg">
                          <div className="grid gap-2">
                            <div className="grid gap-2">
                              <div className="grid grid-cols-3 items-center gap-4">
                                <label
                                  htmlFor={`asset-name-${asset.id}`}
                                  className="text-sm"
                                >
                                  ชื่อสินทรัพย์
                                </label>
                                <input
                                  type="text"
                                  id={`asset-name-${asset.id}`}
                                  value={asset.name}
                                  onChange={(e) =>
                                    handleAssetInputChange(
                                      asset.id,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="เช่น หุ้น, ตราสารหนี้"
                                  className="col-span-2 h-8 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <label
                                  htmlFor={`asset-return-${asset.id}`}
                                  className="text-sm"
                                >
                                  ผลตอบแทนคาดหวัง (%)
                                </label>
                                <input
                                  type="number"
                                  id={`asset-return-${asset.id}`}
                                  value={(asset.expectedReturn * 100).toFixed(
                                    2
                                  )}
                                  onChange={(e) =>
                                    handleAssetInputChange(
                                      asset.id,
                                      "expectedReturn",
                                      e.target.value
                                    )
                                  }
                                  step="0.01"
                                  min="0"
                                  className="col-span-2 h-8 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <label
                                  htmlFor={`asset-volatility-${asset.id}`}
                                  className="text-sm"
                                >
                                  ความผันผวน (%)
                                </label>

                                <input
                                  type="number"
                                  id={`asset-volatility-${asset.id}`}
                                  value={(asset.volatility * 100).toFixed(2)}
                                  onChange={(e) =>
                                    handleAssetInputChange(
                                      asset.id,
                                      "volatility",
                                      e.target.value
                                    )
                                  }
                                  step="0.01"
                                  min="0"
                                  className="col-span-2 h-8 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* button เพิ่มสินทรัพย์  */}

              <div className="max-w-max mt-8 mb-16">
                <CuteGlassButton
                  onClick={handleAddAsset}
                  textColorFrom="#a67bf5"
                  textColorTo="#1ca2e9"
                  text="เพิ่มสินทรัพย์"
                  iconAfter={ChevronRight}
                  iconAnimation=""
                />
              </div>
            </div>

            {/* Correlation and Risk-Free Rate Input */}
            <div
              className="mb-8 p-6 bg-primary-foreground rounded-lg border
            bg-gradient-to-br from-indigo-100/10 to-indigo-500/40  backdrop-blur-sm  border-white/10 shadow-sm
            "
            >
              <h2 className="text-lg text-primary mb-4">
                ค่าสัมประสิทธิ์สหสัมพันธ์และอัตราดอกเบี้ยปราศจากความเสี่ยง
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full">
                  <label
                    htmlFor="risk-free-rate"
                    className="block text-sm font-medium text-primary mb-1"
                  >
                    อัตราดอกเบี้ยปราศจากความเสี่ยง (%)
                  </label>
                  <input
                    type="number"
                    id="risk-free-rate"
                    value={(riskFreeRate * 100).toFixed(2)}
                    onChange={(e) =>
                      setRiskFreeRate(parseFloat(e.target.value) / 100 || 0)
                    }
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full px-3 py-2 border  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="flex gap-2 w-full">
                  <RiskFree />
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-primary mb-3">
                  สหสัมพันธ์ระหว่างสินทรัพย์
                </h3>

                <div className="p-1">
                  {/* <button
                    onClick={handleLoadClick}
                    disabled={corrLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                  >
                    {corrLoading ? "Loading..." : "Load Correlations"}
                  </button> */}

                  {corrError && <p className="text-red-500">{corrError}</p>}
                </div>

                {marketDataInputs.length < 2 && (
                  <p className="text-gray-500 text-sm">
                    เพิ่มสินทรัพย์อย่างน้อย 2 รายการเพื่อตั้งค่าสหสัมพันธ์
                  </p>
                )}
                <div className="grid grid-cols-1 gap-4">
                  {marketDataInputs.map((asset1, index1) =>
                    marketDataInputs.slice(index1 + 1).map((asset2) => (
                      <div
                        key={`${asset1.id}-${asset2.id}`}
                        className="flex items-center gap-4 bg-primary-foreground/40 p-3 rounded-md shadow-sm border"
                      >
                        <label
                          htmlFor={`corr-${asset1.id}-${asset2.id}`}
                          className="block text-sm font-medium text-primary w-1/2"
                        >
                          {asset1.name} กับ {asset2.name}
                        </label>
                        <input
                          type="number"
                          id={`corr-${asset1.id}-${asset2.id}`}
                          value={getCorrelationValue(
                            asset1.id,
                            asset2.id
                          ).toFixed(2)}
                          onChange={(e) =>
                            handleCorrelationChange(
                              asset1.id,
                              asset2.id,
                              e.target.value
                            )
                          }
                          step="0.01"
                          min="-1"
                          max="1"
                          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {getCorrelationValue(asset1.id, asset2.id) >= 0 ? (
                          <div className="flex justify-center items-center w-6 h-6 bg-emerald-700 p-2 rounded-full">
                            <Plus className="w-4" />
                          </div>
                        ) : (
                          <div className="flex justify-center items-center w-6 h-6 bg-red-700 p-2 rounded-full">
                            <Minus className="w-4" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* User Profile Input */}
            <div className="mb-8 p-6 bg-primary-foreground rounded-lg border bg-gradient-to-br from-indigo-100/10 to-indigo-500/40  backdrop-blur-sm border-white/10 shadow-sm">
              <h2 className="text-lg text-primary mb-4">
                ข้อมูลโปรไฟล์การลงทุนของคุณ
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="investment-amount"
                    className="block text-sm font-medium text-primary mb-1"
                  >
                    จํานวนเงินที่ต้องการลงทุน (บาท)
                  </label>
                  <input
                    type="number"
                    id="investment-amount"
                    value={investmentAmount}
                    onChange={(e) =>
                      setInvestmentAmount(parseFloat(e.target.value) || 0)
                    }
                    min="0"
                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="investment-horizon"
                    className="block text-sm font-medium text-primary mb-1"
                  >
                    กรอบเวลาการลงทุน (ปี)
                  </label>
                  <input
                    type="number"
                    id="investment-horizon"
                    value={investmentHorizon}
                    onChange={(e) =>
                      setInvestmentHorizon(parseInt(e.target.value) || 0)
                    }
                    min="1"
                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <CuteGlassButton
              onClick={handleCalculatePortfolio}
              textColorFrom="#a67bf5"
              textColorTo="#1ca2e9"
              text="คํานวณพอร์ตลงทุน"
              iconBefore="⭐"
              iconAfter={ChevronRight}
              iconAnimation="animate-spin"
              loading={loading}
            />
          </div>
        </div>
      ) : (
        <PortfolioDisplay
          portfolio={portfolioResult!}
          efficientFrontier={frontierData!}
          userProfile={userProfile!}
          riskFreeRate={riskFreeRate!}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

"use client";

import Header from "@/components/main/Header";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { AnimatedCircularProgressBar } from "@/components/magicui/animated-circular-progress-bar";
import { GlowEffectButton } from "@/components/button/GlowButton";
import Link from "next/link";
import Image from "next/image";
import LoadingBox from "@/components/main/LoadingBox";
import PerformanceTableTest from "./DataTablePerformance";

interface FundDetailProps {
  id: number;
  asOfDate: string;
  regisIdYear1: string;
  type: string;
  projThaiName: string;
  projAbbrName: string;
  compThaiName: string;
  isinCode: string;
  projType: string;
  numSell: string;
  projOfferPlace: string;
  projRetailType: string;
  unitMulticlass: string;
  classList: string;
  policyThaiDesc: string;
  specGrDesc: string;
  mainFeederFund: string;
  feederCountry: string;
  mainFeederFundUcits: string;
  futureFlag: string;
  futureReason: string;
  riskFlag: string;
  globalExposureLimitMethod: string;
  noteFlag: string;
  policySpecDesc: string;
  currentRmfPvdType: string;
  managementStyleTh: string;
  fundCompare: string;
  mutualInvType: string;
  investCountryFlagEng: string;
  redempPeriodEng: string;
  redempPeriodOth: string;
  projTermTh: string;
  trackingError: string;
  benchmarkDescTh: string;
  benchmarkRatio: string;
  yieldPaying: string;
  dividendPolicy: string;
  riskSpectrum: string;
  supervisorNameEng: string;
  apprDate: string;
  regisDate: string;
  sellVal: string;
  pcancDate: string;
  cancCancNav: string;
  cancDate: string;
}

interface PerformanceProps {
  last_upd_date: string;
  class_abbr_name: string;
  reference_period: string;
  performance_type_desc: string;
  performance_val: string | null;
  as_of_date: string;
}

interface Result {
  data: FundDetailProps | null;
  performance: PerformanceProps[];
}

interface LoadingState {
  results: boolean;
}

interface SearchInput {
  name: string;
}

interface AppState {
  results: Result;
  searchInput: SearchInput;
  error: string;
  loading: LoadingState;
}

type AppAction =
  | { type: "SET_RESULTS"; payload: Result }
  | { type: "SET_LOADING"; payload: Partial<LoadingState> }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_SEARCH_INPUT"; payload: Partial<SearchInput> };

class FundSearchDetail {
  private static instance: FundSearchDetail;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cache = new Map<string, any>();
  private readonly CACHE_DURATION = 5 * 60 * 1000;

  static getInstance(): FundSearchDetail {
    if (!FundSearchDetail.instance) {
      FundSearchDetail.instance = new FundSearchDetail();
    }
    return FundSearchDetail.instance;
  }

  private getCacheKey(endpoint: string, params?: URLSearchParams): string {
    return `${endpoint}${params ? `?${params.toString()}` : ""}`;
  }

  private async fetchDataWithCache<T>(
    endpoint: string,
    params?: URLSearchParams
  ): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    const url = params ? `${endpoint}?${params.toString()}` : endpoint;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData?.error || `API error: ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();
    this.cache.set(cacheKey, { data, timestamp: Date.now() });

    console.log(data);
    return data;
  }

  async searchFunds(searchParams: SearchInput): Promise<Result> {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return this.fetchDataWithCache<Result>("/api/fund/detail", params);
  }
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_RESULTS":
      return {
        ...state,
        results: action.payload,
        loading: { ...state.loading, results: false },
      };
    case "SET_LOADING":
      return { ...state, loading: { ...state.loading, ...action.payload } };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_SEARCH_INPUT": // Added this case for clarity, though not strictly necessary for this fix
      return {
        ...state,
        searchInput: { ...state.searchInput, ...action.payload },
      };
    default:
      return state;
  }
}

function useSearchFunds(initialParams: SearchInput) {
  const service = useMemo(() => FundSearchDetail.getInstance(), []);

  const initialState: AppState = {
    results: { data: null, performance: [] },
    searchInput: initialParams,
    loading: { results: false },
    error: "",
  };

  const [state, dispatch] = useReducer(appReducer, initialState);

  // Effect to perform the search when searchInput changes
  useEffect(() => {
    const performSearch = async () => {
      // Only perform search if a name is provided
      if (!state.searchInput.name) {
        dispatch({
          type: "SET_RESULTS",
          payload: { data: null, performance: [] },
        });
        return;
      }

      dispatch({ type: "SET_LOADING", payload: { results: true } });
      dispatch({ type: "SET_ERROR", payload: "" });

      try {
        const results = await service.searchFunds(state.searchInput);
        dispatch({ type: "SET_RESULTS", payload: results });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        dispatch({
          type: "SET_RESULTS",
          payload: { data: null, performance: [] },
        });
      }
    };

    performSearch();
  }, [service, state.searchInput.name]); // Depend on service and specifically searchInput.name

  // Function to update search input, which will trigger the useEffect
  const setSearchInput = useCallback((newInput: Partial<SearchInput>) => {
    dispatch({ type: "SET_SEARCH_INPUT", payload: newInput });
  }, []);

  return {
    state,
    setSearchInput,
  };
}

const DetailPage = () => {
  const [loading, setLoading] = useState("กลับหน้าค้นหากองทุน");
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "";

  // Pass the initial name to the hook
  const { state, setSearchInput } = useSearchFunds({ name });

  // Update the search input in the hook whenever the URL's 'name' param changes
  useEffect(() => {
    if (state.searchInput.name !== name) {
      setSearchInput({ name });
    }
  }, [name, state.searchInput.name, setSearchInput]);

  function isEmptyObject(obj: object | null | undefined): boolean {
    if (!obj) return true;
    return Object.keys(obj).length === 0;
  }

  const riskValue = +(
    state.results?.data?.riskSpectrum?.replace("RS", "") ?? "0"
  );

  console.log(riskValue);

  const gaugePrimaryColor = riskValue
    ? riskValue <= 4
      ? "oklch(70.4% 0.14 182.503)"
      : riskValue <= 5
      ? "oklch(79.5% 0.184 86.047)"
      : riskValue <= 6
      ? "oklch(63.7% 0.237 25.331)"
      : "oklch(58.5% 0.233 277.117)"
    : "oklch(58.5% 0.233 277.117)";

  return (
    <>
      {state.error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4 max-w-md mx-auto">
          {state.error}
        </div>
      )}

      {state.loading.results || state?.results?.data === null ? (
        <>
          <LoadingBox />
        </>
      ) : isEmptyObject(state?.results?.data) ? (
        <>
          <div className="flex flex-col justify-center items-center gap-5 mx-auto">
            <div className="flex">
              <div className="w-50 h-50 bg-indigo-500 rounded-full overflow-hidden">
                <Image
                  src="/images/people/no.png"
                  width={200}
                  height={200}
                  alt="No funds"
                  className="translate-x-4 translate-y-6"
                />
              </div>
            </div>

            <p>ไม่พบข้อมูลกองทุนที่คุณค้นหา</p>

            <div className="mx-auto mt-16">
              <GlowEffectButton>
                <Link
                  href="/search"
                  className="link"
                  onClick={() => {
                    setLoading("กำลังเปลี่ยนหน้า...");
                    setTimeout(() => {
                      setLoading("เกิดข้อผิดพลาด กรุณาโหลดหน้านี้ใหม่");
                    }, 5000);
                  }}
                >
                  {loading}
                </Link>
              </GlowEffectButton>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-8 justify-center items-center mx-auto w-full">
            <div className="flex flex-col justify-center items-center gap-5 mx-auto">
              <Header
                top="มารู้จักกองทุนนี้กันเถอะ"
                header={name}
                content={state.results?.data?.projThaiName ?? ""}
              />

              <div className="flex flex-col gap-8 w-full max-w-max mt-16">
                <div className="flex flex-col md:flex-row gap-8 w-full">
                  <Card className="basis-2/3 w-full bg-primary-foreground/50">
                    <CardHeader>
                      <CardTitle>รายละเอียดกองทุน</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between items-start">
                      <table className="w-full text-left text-sm">
                        <tbody className="flex flex-col gap-2">
                          <tr className="flex gap-2 justify-between items-start">
                            <td className="opacity-50">
                              บริษัทหลักทรัพย์จัดการกองทุน
                            </td>
                            <td className="text-right max-w-3/4">
                              {state.results?.data?.compThaiName}
                            </td>
                          </tr>
                          <tr className="flex gap-2 justify-between items-start">
                            <td className="opacity-50">เหมาะสำหรับ</td>
                            <td className="text-right max-w-3/4">
                              {state.results?.data?.projRetailType}
                            </td>
                          </tr>
                          <tr className="flex gap-2 justify-between items-start">
                            <td className="opacity-50 inline-flex my-auto">
                              <p className="mr-1">หมวดหมู่กองทุน</p>
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <AlertCircle size={16} className="mt-0.5" />
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                  <div className="flex justify-between gap-4">
                                    <div className="space-y-1">
                                      <h4 className="text-sm font-semibold">
                                        หมวดหมู่กองทุน
                                      </h4>
                                      <p className="text-sm">
                                        เอาไว้ดูว่ากองทุนนี้เน้นลงทุนในสินทรัพย์แบบไหน
                                        เช่น หุ้น ตราสารหนี้ หรือกองทุนผสม
                                        เป็นต้น
                                      </p>
                                      <div className="text-muted-foreground text-xs">
                                        <Link href="https://www.settrade.com/th/mutualfund/fund-aimc">
                                          หมวดหมู่กองทุนมีอะไรบ้าง?
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            </td>
                            <td className="text-right max-w-3/4">
                              {state.results?.data?.fundCompare}
                            </td>
                          </tr>
                          <tr className="flex gap-2 justify-between items-start">
                            <td className="opacity-50">การจ่ายปันผล</td>
                            <td className="text-right max-w-3/4">
                              {state.results?.data?.dividendPolicy}
                            </td>
                          </tr>
                          <tr className="flex gap-2 justify-between items-start">
                            <td className="opacity-50">กองทุนหลักที่ลงทุน</td>
                            <td className="text-right max-w-3/4">
                              {state.results?.data?.mainFeederFund}
                            </td>
                          </tr>
                          <tr className="flex gap-2 justify-between items-start">
                            <td className="opacity-50">ประเภทการลงทุน</td>
                            <td className="text-right max-w-3/4">
                              {state.results?.data?.mutualInvType}
                            </td>
                          </tr>
                          <tr className="flex gap-2 justify-between items-start">
                            <td className="opacity-50">
                              ตัวชี้วัดผลการดำเนินงาน
                            </td>
                            <td className="text-right max-w-3/4">
                              {state.results?.data?.benchmarkDescTh}
                            </td>
                          </tr>
                          <tr className="flex gap-2 justify-between items-start">
                            <td className="opacity-50">รายละเอียดอื่นๆ </td>
                            <td className="text-right max-w-3/4">
                              {state.results?.data?.policySpecDesc}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>

                  <Card className="basis-1/3 w-full bg-primary-foreground/50">
                    <CardHeader>
                      <CardTitle>ระดับความเสี่ยง</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 justify-center item-center w-full">
                      {riskValue ? (
                        <AnimatedCircularProgressBar
                          className="size-35 w-full text-3xl"
                          max={8}
                          min={1}
                          value={riskValue}
                          gaugePrimaryColor={gaugePrimaryColor}
                          gaugeSecondaryColor="rgba(255, 255, 255, 0.1)"
                        />
                      ) : (
                        <p className="text-red-500">
                          ไม่พบข้อมูลระดับความเสี่ยง
                        </p>
                      )}

                      <div className="flex flex-col gap-1">
                        <p className="text-sm opacity-50">
                          ความเสี่ยงต่างประเทศ
                        </p>
                        <p className="text-sm">
                          {state.results?.data?.investCountryFlagEng}
                        </p>
                        <p className="text-sm">
                          <span className="opacity-50">
                            การป้องกันความเสี่ยงต่างประเทศ:
                          </span>{" "}
                          {state.results?.data?.futureReason === "Hedging"
                            ? "มี"
                            : state.results?.data?.futureReason === "-"
                            ? "ไม่มีข้อมูล"
                            : "ไม่มี"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Card className="basis-2/3 w-full bg-primary-foreground/50">
                    <CardHeader>
                      <CardTitle>ผลการดำเนินงาน</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6 overflow-auto">
                      <div className="max-w-[300px] md:max-w-full">
                        <PerformanceTableTest
                          performance={state.results?.performance}
                        />
                      </div>
                      <p className="text-sm opacity-50">
                        หมายเหตุ: ข้อมูลสิ้นสุดวันที่{" "}
                        {state.results?.performance[0]?.as_of_date.substring(
                          0,
                          10
                        )}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-16">
            <GlowEffectButton>
              <Link
                href="/search"
                className="link"
                onClick={() => {
                  setLoading("กำลังเปลี่ยนหน้า...");
                  setTimeout(() => {
                    setLoading("เกิดข้อผิดพลาด กรุณาโหลดหน้านี้ใหม่");
                  }, 5000);
                }}
              >
                {loading}
              </Link>
            </GlowEffectButton>
          </div>
        </>
      )}
    </>
  );
};

export default DetailPage;

// const results = {
//   data: {
//     id: 7305,
//     asOfDate: "31/5/2568",
//     regisIdYear1: "MF0045/2559",
//     type: "จดทะเบียน",
//     projThaiName: "กองทุนเปิดวรรณ อัลติเมท โกลบอล โกรว์ธ",
//     projAbbrName: "ONE-UGG",
//     compThaiName: "บริษัทหลักทรัพย์จัดการกองทุน วรรณ จำกัด",
//     isinCode: "TH7016010004",
//     projType: "เปิด",
//     numSell: "ขายหลายครั้ง",
//     projOfferPlace: "เสนอขายในไทย",
//     projRetailType: "กองทุนเพื่อผู้ลงทุนทั่วไป",
//     unitMulticlass: "มี",
//     classList:
//       "ONE-UGG-RA, ONE-UGG-RD, ONE-UGG-IA, ONE-UGG-ID, ONE-UGG-ASSF, ONE-UGG-DSSF",
//     policyThaiDesc: "ตราสารทุน",
//     specGrDesc:
//       "กองทุนรวมฟีดเดอร์; กองทุนรวมฟีดเดอร์; กองทุนรวมฟีดเดอร์; กองทุนรวมฟีดเดอร์; กองทุนรวมเพื่อการออม; กองทุนรวมเพื่อการออม; กองทุนรวมเพื่อการออม; กองทุนรวมเพื่อการออม",
//     mainFeederFund: "Baillie Gifford Worldwide Long Term Global Growth Fund",
//     feederCountry: "IRELAND",
//     mainFeederFundUcits: "ใช่",
//     futureFlag: "ลงทุน",
//     futureReason: "Non-Hedging",
//     riskFlag: "ไม่ซับซ้อน",
//     globalExposureLimitMethod: "Commitment Approach",
//     noteFlag: "ไม่ลงทุน",
//     policySpecDesc: "-",
//     currentRmfPvdType: "-",
//     managementStyleTh:
//       "มุ่งหวังให้ผลประกอบการเคลื่อนไหวตามดัชนีชี้วัด (passive management/index tracking)",
//     fundCompare: "-",
//     mutualInvType: "Feeder Fund",
//     investCountryFlagEng: "กองทุนรวมที่เน้นลงทุนแบบมีความเสี่ยงต่างประเทศ",
//     redempPeriodEng: "อื่นๆ",
//     redempPeriodOth: "ดูเพิ่มเติมในรายละเอียดระยะเวลาในการรับซื้อคืน ",
//     projTermTh: "ไม่กำหนดอายุโครงการ",
//     trackingError: "20.87",
//     benchmarkDescTh:
//       "ดัชนี MSCI AC World Daily Total Return Net USD , ดัชนี MSCI ACWI Net Total Return USD, ดัชนี MSCI AC World ",
//     benchmarkRatio: "0, 0, 0",
//     yieldPaying: "จ่ายผลตอบแทนแบบไม่ซับซ้อน",
//     dividendPolicy: "ไม่จ่าย",
//     riskSpectrum: "RS6",
//     supervisorNameEng: "ธนาคาร กสิกรไทย จำกัด (มหาชน)",
//     apprDate: "12/1/2559",
//     regisDate: "4/2/2559",
//     sellVal: "33,257,520.38",
//     pcancDate: "-",
//     cancCancNav: "-",
//     cancDate: "-",
//   },
// };

// const performance =
// [{
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "1 year",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": "24.66",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "10 years",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": null,
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "3 months",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": "33.73",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "3 years",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": "25.89",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "5 years",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": "28.99",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "6 months",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": "28.65",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "inception date",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": "28.92",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "year to date",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": "29.51",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "1 year",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "14.7",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "10 years",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "14.91",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "3 months",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "23.07",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "3 years",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "14.21",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "5 years",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "14.24",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "6 months",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "17.75",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "inception date",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "14.28",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "year to date",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "18.83",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "1 year",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": "4.52",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "10 years",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": "3.97",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "3 months",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": "-0.52",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "3 years",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": "4.48",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "5 years",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": "6.59",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "6 months",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": "-1.98",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "inception date",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": null,
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "year to date",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": "0.65",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "1 year",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "14.25",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "10 years",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "0",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "3 months",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "2.15",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "3 years",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "12.57",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "5 years",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "5.48",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "6 months",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "1.61",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "inception date",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "6.69",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "year to date",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "3.41",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "1 year",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "9.18",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "10 years",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "8.2",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "3 months",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "1.54",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "3 years",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "9.12",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "5 years",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "11.66",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "6 months",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "1.26",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "inception date",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "12.39",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-ASSF",
//         "reference_period": "year to date",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "3.73",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "1 year",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": "24.66",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "10 years",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": null,
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "3 months",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": "33.73",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "3 years",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": "25.9",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "5 years",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": "28.99",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "6 months",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": "28.65",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "inception date",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": "30.18",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "year to date",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": "29.51",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "1 year",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "14.7",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "10 years",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "14.91",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "3 months",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "23.07",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "3 years",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "14.21",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "5 years",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "14.24",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "6 months",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "17.75",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "inception date",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "17.58",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "year to date",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "18.83",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "1 year",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": "4.52",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "10 years",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": "3.97",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "3 months",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": "-0.52",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "3 years",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": "4.48",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "5 years",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": "6.59",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "6 months",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": "-1.98",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "inception date",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": null,
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "year to date",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": "0.65",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "1 year",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "14.24",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "10 years",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "0",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "3 months",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "2.15",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "3 years",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "12.63",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "5 years",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "5.5",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "6 months",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "1.61",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "inception date",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "7.9",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "year to date",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "3.41",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "1 year",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "9.18",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "10 years",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "8.2",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "3 months",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "1.54",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "3 years",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "9.12",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "5 years",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "11.66",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "6 months",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "1.26",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "inception date",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "8.62",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-IA",
//         "reference_period": "year to date",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "3.73",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "1 year",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": "24.66",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "10 years",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": null,
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "3 months",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": "33.73",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "3 years",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": "25.89",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "5 years",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": "28.98",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "6 months",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": "28.65",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "inception date",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": "25.85",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "year to date",
//         "performance_type_desc": "ความผันผวนของกองทุนรวม",
//         "performance_val": "29.51",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "1 year",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "14.7",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "10 years",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "14.91",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "3 months",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "23.07",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "3 years",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "14.21",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "5 years",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "14.24",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "6 months",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "17.75",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "inception date",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "14.84",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "year to date",
//         "performance_type_desc": "ความผันผวนของตัวชี้วัด",
//         "performance_val": "18.83",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "1 year",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": "4.52",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "10 years",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": "3.97",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "3 months",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": "-0.52",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "3 years",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": "4.48",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "5 years",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": "6.59",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "6 months",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": "-1.98",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "inception date",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": null,
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "year to date",
//         "performance_type_desc": "ค่าเฉลี่ยในกลุ่มเดียวกัน",
//         "performance_val": "0.65",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "1 year",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "14.25",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "10 years",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "0",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "3 months",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "2.15",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "3 years",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "12.57",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "5 years",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "5.51",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "6 months",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "1.61",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "inception date",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "12.65",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "year to date",
//         "performance_type_desc": "ผลตอบแทนกองทุนรวม",
//         "performance_val": "3.41",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "1 year",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "9.18",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "10 years",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "8.2",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "3 months",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "1.54",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "3 years",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "9.12",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "5 years",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "11.66",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "6 months",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "1.26",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "inception date",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "9.8",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     },
//     {
//         "last_upd_date": "2025-07-02T06:47:30.35",
//         "class_abbr_name": "ONE-UGG-RA",
//         "reference_period": "year to date",
//         "performance_type_desc": "ผลตอบแทนตัวชี้วัด",
//         "performance_val": "3.73",
//         "as_of_date": "2025-07-01 00:00:00.0000000"
//     }
// ]

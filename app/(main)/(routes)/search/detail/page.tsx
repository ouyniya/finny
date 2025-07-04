"use client";

import Header from "@/components/main/Header";
import { AlertCircle, Loader } from "lucide-react";
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
  memo,
  lazy,
  Suspense,
} from "react";
import { AnimatedCircularProgressBar } from "@/components/magicui/animated-circular-progress-bar";
import { GlowEffectButton } from "@/components/button/GlowButton";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ChevronRight } from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import LoadingBox from "@/components/main/LoadingBox";

// Lazy load heavy components
const PerformanceTableTest = lazy(() => import("./DataTablePerformance"));
const ChartNAV = lazy(() => import("./ChartNAV"));

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

interface FundFactSheetProps {
  last_upd_date: string;
  url_halfyear_report: string | null;
  url_annual_report: string | null;
  url_factsheet: string | null;
}

interface NAVPRops {
  dateValue: string;
  NAV:
    | {
        nav_date: string;
        unique_id: string;
        class_abbr_name: string;
        net_asset: number;
        last_val: number;
        previous_val: number;
        sell_price: number;
        buy_price: number;
        sell_swap_price: number;
        buy_swap_price: number;
        remark_th: string;
        remark_en: string;
        last_upd_date: string;
      }[]
    | string;
}

interface Result {
  data: FundDetailProps | null;
  performance: PerformanceProps[];
  fundFactSheet: FundFactSheetProps | null;
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

// Enhanced caching service with better performance
class FundSearchDetail {
  private static instance: FundSearchDetail;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cache = new Map<string, any>();
  private readonly CACHE_DURATION = 5 * 60 * 1000;
  private abortController: AbortController | null = null;

  static getInstance(): FundSearchDetail {
    if (!FundSearchDetail.instance) {
      FundSearchDetail.instance = new FundSearchDetail();
    }
    return FundSearchDetail.instance;
  }

  private getCacheKey(endpoint: string, params?: URLSearchParams): string {
    return `${endpoint}${params ? `?${params.toString()}` : ""}`;
  }

  // Cancel previous request if new one is made
  private cancelPreviousRequest() {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();
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

    this.cancelPreviousRequest();

    const url = params ? `${endpoint}?${params.toString()}` : endpoint;

    try {
      const response = await fetch(url, {
        signal: this.abortController?.signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData?.error || `API error: ${response.status}`;
        throw new Error(message);
      }

      const data = await response.json();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("Request cancelled");
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Unknown error occurred");
    }
  }

  async searchFunds(searchParams: SearchInput): Promise<Result> {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return this.fetchDataWithCache<Result>("/api/fund/detail", params);
  }

  // Clean up method
  cleanup() {
    this.cancelPreviousRequest();
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
    case "SET_SEARCH_INPUT":
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
    results: { data: null, performance: [], fundFactSheet: null },
    searchInput: initialParams,
    loading: { results: false },
    error: "",
  };

  const [state, dispatch] = useReducer(appReducer, initialState);

  // Debounce search to prevent rapid API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const performSearch = async () => {
        if (!state.searchInput.name) {
          dispatch({
            type: "SET_RESULTS",
            payload: {
              data: null,
              performance: [],
              fundFactSheet: null,
            },
          });
          return;
        }

        dispatch({ type: "SET_LOADING", payload: { results: true } });
        dispatch({ type: "SET_ERROR", payload: "" });

        try {
          const results = await service.searchFunds(state.searchInput);
          dispatch({ type: "SET_RESULTS", payload: results });
        } catch (error) {
          if (error instanceof Error) {
            if (error.message !== "Request cancelled") {
              dispatch({ type: "SET_ERROR", payload: error.message });
              dispatch({
                type: "SET_RESULTS",
                payload: {
                  data: null,
                  performance: [],
                  fundFactSheet: null,
                },
              });
            }
          } else {
            dispatch({ type: "SET_ERROR", payload: "Unknown error occurred" });
            dispatch({
              type: "SET_RESULTS",
              payload: {
                data: null,
                performance: [],
                fundFactSheet: null,
              },
            });
          }
        }
      };

      performSearch();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [service, state.searchInput.name]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      service.cleanup();
    };
  }, [service]);

  const setSearchInput = useCallback((newInput: Partial<SearchInput>) => {
    dispatch({ type: "SET_SEARCH_INPUT", payload: newInput });
  }, []);

  return {
    state,
    setSearchInput,
  };
}

// Memoized utility functions
// Utility function
export const formatThaiDate = (text: string) => {
  if (text.length !== 10) {
    return text;
  }
  const year = +text.slice(0, 4) + 543;
  const month = text.slice(5, 7);
  const day = text.slice(8, 10);
  return `${day}/${month}/${year}`;
};

const isEmptyObject = (obj: object | null | undefined): boolean => {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
};

// Memoized components
const ErrorDisplay = memo(
  ({
    error,
    loading,
    setLoading,
  }: {
    error: string;
    loading: string;
    setLoading: (loading: string) => void;
  }) => (
    <div className="flex flex-col justify-center items-center gap-5 mx-auto">
      <div className="flex">
        <Image
          src="/images/people/cry.png"
          width={200}
          height={200}
          alt="No funds"
          priority={false}
          loading="lazy"
        />
      </div>
      <p className="text-red-400">{error}</p>
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
  )
);

ErrorDisplay.displayName = "ErrorDisplay";

const NoDataDisplay = memo(
  ({
    loading,
    setLoading,
  }: {
    loading: string;
    setLoading: (loading: string) => void;
  }) => (
    <div className="flex flex-col justify-center items-center gap-5 mx-auto">
      <div className="flex">
        <Image
          src="/images/people/cry.png"
          width={200}
          height={200}
          alt="No funds"
          priority={false}
          loading="lazy"
        />
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
  )
);

NoDataDisplay.displayName = "NoDataDisplay";

const RiskDisplay = memo(
  ({
    riskValue,
    gaugePrimaryColor,
    data,
  }: {
    riskValue: number;
    gaugePrimaryColor: string;
    data: FundDetailProps | null;
  }) => (
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
          <p className="text-red-500">ไม่พบข้อมูลระดับความเสี่ยง</p>
        )}
        <div className="flex flex-col gap-1">
          <p className="text-sm opacity-50">ความเสี่ยงต่างประเทศ</p>
          <p className="text-sm">{data?.investCountryFlagEng}</p>
          <p className="text-sm">
            <span className="opacity-50">การป้องกันความเสี่ยงต่างประเทศ:</span>{" "}
            {data?.futureReason === "Hedging"
              ? "มี"
              : data?.futureReason === "-"
              ? "ไม่มีข้อมูล"
              : "ไม่มี"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
);

RiskDisplay.displayName = "RiskDisplay";

const DetailPage = () => {
  const [NAVData, setNAVData] = useState<NAVPRops[] | null>(null);
  const [loadingNAV, setLoadingNAV] = useState(true);
  const [errorNAV, setErrorNAV] = useState("");

  const [loading, setLoading] = useState("กลับหน้าค้นหากองทุน");
  const [showFull, setShowFull] = useState(false);
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "";

  const { state, setSearchInput } = useSearchFunds({ name });

  useEffect(() => {
    if (state.searchInput.name !== name) {
      setSearchInput({ name });
    }
  }, [name, state.searchInput.name, setSearchInput]);

  useEffect(() => {
    if (!state.searchInput.name) return;

    const fetchNAV = async () => {
      setLoadingNAV(true);
      setErrorNAV("");

      try {
        const res = await fetch(
          `/api/fund/detail/nav?name=${state.searchInput.name}`
        );
        if (!res.ok) {
          throw new Error("ไม่สามารถโหลดข้อมูล NAV ได้");
        }
        const nav = await res.json();

        setNAVData(nav.NAV);
      } catch (error) {
        if (error instanceof Error) {
          setErrorNAV(error.message);
        } else {
          setErrorNAV("เกิดข้อผิดพลาดไม่ทราบสาเหตุ");
        }
      } finally {
        setLoadingNAV(false);
      }
    };

    fetchNAV();
  }, [state.searchInput.name]);

  // Memoized calculations
  const riskValue = useMemo(
    () => +(state.results?.data?.riskSpectrum?.replace("RS", "") ?? "0"),
    [state.results?.data?.riskSpectrum]
  );

  const gaugePrimaryColor = useMemo(() => {
    if (!riskValue) return "oklch(58.5% 0.233 277.117)";
    if (riskValue <= 4) return "oklch(70.4% 0.14 182.503)";
    if (riskValue <= 5) return "oklch(79.5% 0.184 86.047)";
    if (riskValue <= 6) return "oklch(63.7% 0.237 25.331)";
    return "oklch(58.5% 0.233 277.117)";
  }, [riskValue]);

  // Early returns for different states
  if (state.error) {
    return (
      <ErrorDisplay
        error={state.error}
        loading={loading}
        setLoading={setLoading}
      />
    );
  }

  if (state.loading.results || state.results?.data === null) {
    return <LoadingBox />;
  }

  if (isEmptyObject(state.results?.data)) {
    return <NoDataDisplay loading={loading} setLoading={setLoading} />;
  }

  return (
    <div className="flex flex-col gap-8 justify-center items-center mx-auto w-full">
      <div className="flex flex-col justify-center items-center gap-5 mx-auto">
        <Header
          top="มารู้จักกองทุนนี้กันเถอะ"
          header={name}
          content={state.results?.data?.projThaiName ?? ""}
        />

        <div className="flex flex-col gap-8 w-full max-w-max mt-16">
          <Suspense
            fallback={
              <div className="flex gap-2 justify-center items-center text-indigo-500">
                <Loader size={16} className="animate-spin" />
                <p>กำลังโหลดกราฟ...</p>
              </div>
            }
          >
            {loadingNAV ? (
              <div className="flex gap-2 justify-center items-center text-indigo-500">
                <Loader size={16} className="animate-spin" />
                <p>กำลังโหลดข้อมูล NAV...</p>
              </div>
            ) : errorNAV ? (
              <div className="text-red-500">{errorNAV}</div>
            ) : !NAVData || NAVData?.length <= 0 ? (
              <div className="flex gap-2 justify-center items-center text-red-500">
                <AlertCircle size={16} />
                <p>ไม่พบข้อมูล NAV</p>
              </div>
            ) : (
              <>
                <ChartNAV NAVData={NAVData} />
              </>
            )}
          </Suspense>

          <div className="flex flex-col md:flex-row gap-8 w-full">
            <Card className="basis-2/3 w-full bg-primary-foreground/50">
              <CardHeader>
                <CardTitle>รายละเอียดกองทุน</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-start">
                <table className="w-full text-left text-sm">
                  <tbody className="flex flex-col gap-2">
                    <tr className="flex gap-2 justify-between items-start">
                      <td className="opacity-50">ISIN Code</td>
                      <td className="text-right max-w-3/4">
                        {state.results?.data?.isinCode}
                      </td>
                    </tr>
                    <tr className="flex gap-2 justify-between items-start">
                      <td className="opacity-50">
                        บริษัทหลักทรัพย์จัดการกองทุน
                      </td>
                      <td className="text-right max-w-3/4">
                        {state.results?.data?.compThaiName}
                      </td>
                    </tr>
                    <tr className="flex gap-2 justify-between items-start">
                      <td className="opacity-50">หนังสือชี้ชวน</td>
                      <td className="text-right max-w-3/4">
                        {state.results?.fundFactSheet?.url_factsheet ? (
                          <Link
                            href={`/search/ffs?url=${state.results?.fundFactSheet?.url_factsheet}`}
                          >
                            <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] ">
                              <span
                                className={cn(
                                  "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
                                )}
                                style={{
                                  WebkitMask:
                                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                                  WebkitMaskComposite: "destination-out",
                                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                                  maskComposite: "subtract",
                                  WebkitClipPath: "padding-box",
                                }}
                              />
                              📥{" "}
                              <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
                              <AnimatedGradientText className="text-sm font-medium">
                                ดาวน์โหลดหนังสือชี้ชวน
                              </AnimatedGradientText>
                              <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                            </div>
                          </Link>
                        ) : (
                          <p className="text-red-500">ไม่พบข้อมูล</p>
                        )}
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
                            <AlertCircle
                              size={16}
                              className="mt-0.5 hover:cursor-pointer"
                            />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="flex justify-between gap-4">
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold">
                                  หมวดหมู่กองทุน
                                </h4>
                                <p className="text-sm">
                                  เอาไว้ดูว่ากองทุนนี้เน้นลงทุนในสินทรัพย์แบบไหน
                                  เช่น หุ้น ตราสารหนี้ หรือกองทุนผสม เป็นต้น
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
                      <td className="opacity-50">ตัวชี้วัดผลการดำเนินงาน</td>
                      <td className="text-right max-w-3/4">
                        <div className="relative">
                          <p
                            className={`${
                              showFull ? "whitespace-normal" : "line-clamp-2"
                            }`}
                          >
                            {state.results?.data?.benchmarkDescTh}
                          </p>
                          {state.results?.data?.benchmarkDescTh?.length >
                            100 && (
                            <button
                              className="text-indigo-500 text-sm mt-1 hover:cursor-pointer"
                              onClick={() => setShowFull(!showFull)}
                            >
                              {showFull ? "ย่อ" : "ดูเพิ่มเติม"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <RiskDisplay
              riskValue={riskValue}
              gaugePrimaryColor={gaugePrimaryColor}
              data={state.results?.data}
            />
          </div>

          <Card className="basis-2/3 w-full bg-primary-foreground/50">
            <CardHeader>
              <CardTitle>ผลการดำเนินงาน</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 overflow-auto">
              {!state.results?.performance ||
              state.results?.performance?.length <= 0 ? (
                <div>ไม่พบข้อมูล</div>
              ) : (
                <>
                  <div className="max-w-[300px] md:max-w-full">
                    <Suspense
                      fallback={<div>กำลังโหลดตารางผลการดำเนินงาน...</div>}
                    >
                      <PerformanceTableTest
                        performance={state.results?.performance}
                      />
                    </Suspense>
                  </div>
                  <p className="text-sm opacity-50">
                    <span className="font-semibold underline">หมายเหตุ</span>
                    <br />
                    * ข้อมูลผลตอบแทนและความเสี่ยงที่มีระยะเวลามากกว่า 1 ปีขึ้นไป
                    แสดงเป็นค่าเฉลี่ยต่อปี (Annualized Return)
                    <br />
                    วันที่จดทะเบียนกองทุน {state.results?.data?.regisDate}
                    <br />
                    ข้อมูลหน่วยเป็น %<br />
                    ข้อมูลสิ้นสุดวันที่
                    {formatThaiDate(
                      state.results?.performance[0]?.as_of_date.substring(0, 10)
                    )}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
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
    </div>
  );
};

export default DetailPage;

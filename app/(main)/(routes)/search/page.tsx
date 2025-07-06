"use client";

import { useRouter } from "next/navigation";
import React, {
  useCallback,
  useRef,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import Loading from "@/app/loading";
import Header from "@/components/main/Header";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/magicui/marquee";
import { AnimatedCircularProgressBar } from "@/components/magicui/animated-circular-progress-bar";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { AlertCircle, Globe, Trash } from "lucide-react";

// Types
interface FundProps {
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

interface ResultWithTotal {
  data: FundProps[];
  total: number;
}

interface FundType {
  _count: { fundCompare: number };
  fundCompare: string;
}

interface Company {
  _count: { compThaiName: number };
  compThaiName: string;
}

interface SearchInput {
  name: string;
  fundCompare: string;
  company: string;
  page: string;
}

// Loading state management
interface LoadingState {
  fundTypes: boolean;
  companies: boolean;
  results: boolean;
}

// State management with useReducer
interface AppState {
  fundTypes: FundType[];
  companies: Company[];
  results: ResultWithTotal;
  searchInput: SearchInput;
  loading: LoadingState;
  error: string;
}

// Component Props
interface SearchPageProps {
  searchParams: Promise<SearchInput>;
}

type AppAction =
  | { type: "SET_FUND_TYPES"; payload: FundType[] }
  | { type: "SET_COMPANIES"; payload: Company[] }
  | { type: "SET_RESULTS"; payload: ResultWithTotal }
  | { type: "SET_SEARCH_INPUT"; payload: Partial<SearchInput> }
  | { type: "SET_LOADING"; payload: Partial<LoadingState> }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_FILTERS" };

// API Service Class
class FundSearchService {
  private static instance: FundSearchService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cache = new Map<string, any>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): FundSearchService {
    if (!FundSearchService.instance) {
      FundSearchService.instance = new FundSearchService();
    }
    return FundSearchService.instance;
  }

  private getCacheKey(endpoint: string, params?: URLSearchParams): string {
    return `${endpoint}${params ? `?${params.toString()}` : ""}`;
  }

  private async fetchWithCache<T>(
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

    return data;
  }

  async getFundTypes(): Promise<FundType[]> {
    return this.fetchWithCache<FundType[]>("/api/fund/fund-type");
  }

  async getCompanies(): Promise<Company[]> {
    return this.fetchWithCache<Company[]>("/api/fund/company");
  }

  async searchFunds(searchParams: SearchInput): Promise<ResultWithTotal> {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    return this.fetchWithCache<ResultWithTotal>("/api/fund/search", params);
  }
}

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_FUND_TYPES":
      return {
        ...state,
        fundTypes: action.payload,
        loading: { ...state.loading, fundTypes: false },
      };
    case "SET_COMPANIES":
      return {
        ...state,
        companies: action.payload,
        loading: { ...state.loading, companies: false },
      };
    case "SET_RESULTS":
      return {
        ...state,
        results: action.payload,
        loading: { ...state.loading, results: false },
      };
    case "SET_SEARCH_INPUT":
      return {
        ...state,
        searchInput: { ...state.searchInput, ...action.payload },
      };
    case "SET_LOADING":
      return { ...state, loading: { ...state.loading, ...action.payload } };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_FILTERS":
      return {
        ...state,
        searchInput: {
          name: "",
          fundCompare: "",
          company: "",
          page: "1",
        },
        results: { data: [], total: 0 },
        error: "",
      };
    default:
      return state;
  }
}

// Custom hook for search functionality
function useSearchFunds(initialParams: SearchInput) {
  const router = useRouter();
  const service = useMemo(() => FundSearchService.getInstance(), []);

  const initialState: AppState = {
    fundTypes: [],
    companies: [],
    results: { data: [], total: 0 },
    searchInput: initialParams,
    loading: { fundTypes: true, companies: true, results: false },
    error: "",
  };

  const [state, dispatch] = useReducer(appReducer, initialState);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [fundTypes, companies] = await Promise.all([
          service.getFundTypes(),
          service.getCompanies(),
        ]);

        dispatch({ type: "SET_FUND_TYPES", payload: fundTypes });
        dispatch({ type: "SET_COMPANIES", payload: companies });

        // After companies are loaded, validate the initial company parameter
        // if (initialParams.company) {
        //   const companyExists = companies.some(
        //     (c) => +c.compThaiName === +initialParams.company
        //   );
        //   if (!companyExists) {
        //     // If company doesn't exist, clear the company filter
        //     dispatch({ type: "SET_SEARCH_INPUT", payload: { company: "" } });
        //   }
        // }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        dispatch({
          type: "SET_LOADING",
          payload: { fundTypes: false, companies: false },
        });
      }
    };

    fetchInitialData();
  }, [service, initialParams.company]);

  // Search function
  const performSearch = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: { results: true } });
    dispatch({ type: "SET_ERROR", payload: "" });

    try {
      const results = await service.searchFunds(state.searchInput);
      dispatch({ type: "SET_RESULTS", payload: results });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      dispatch({ type: "SET_RESULTS", payload: { data: [], total: 0 } });
    }
  }, [service, state.searchInput]);

  // Update URL and perform search
  const handleSearchV2 = useCallback(() => {
    const params = new URLSearchParams();
    // Calculate skip based on current page

    // Update search input with calculated skip
    const searchInputWithSkip = {
      ...state.searchInput,
    };

    Object.entries(searchInputWithSkip).forEach(([key, value]) => {
      if (value && key !== "page") params.set(key, value);
    });

    // Always include page in URL
    if (state.searchInput.page) {
      params.set("page", state.searchInput.page);
    }

    router.push(`?${params.toString()}`);
    performSearch();
  }, [state.searchInput, router, performSearch]);

  // Clear filters
  const clearFilters = useCallback(() => {
    dispatch({ type: "CLEAR_FILTERS" });
    router.push("?");
  }, [router]);

  // Update search input
  const updateSearchInput = useCallback((updates: Partial<SearchInput>) => {
    dispatch({ type: "SET_SEARCH_INPUT", payload: updates });
  }, []);

  // Update URL and perform search
  const handleSearch = useCallback(() => {
    // Create the new search input object
    const newSearchInput = {
      ...state.searchInput,
      page: "1",
    };

    // Update the state
    updateSearchInput(newSearchInput);

    // Immediately search with the NEW values (not waiting for state update)
    performSearchWithParams(newSearchInput);
  }, [state.searchInput, updateSearchInput]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      // Create the new search input object
      const newSearchInput = {
        ...state.searchInput,
        page: newPage.toString(),
      };

      // Update the state
      updateSearchInput({
        page: newPage.toString(),
      });

      // Immediately search with the NEW values (not waiting for state update)
      performSearchWithParams(newSearchInput);
    },
    [state.searchInput, updateSearchInput]
  );

  const performSearchWithParams = useCallback(
    async (searchInput: SearchInput) => {
      dispatch({ type: "SET_LOADING", payload: { results: true } });
      dispatch({ type: "SET_ERROR", payload: "" });

      try {
        // Update URL
        const params = new URLSearchParams();

        Object.entries(searchInput).forEach(([key, value]) => {
          if (value && key !== "page") params.set(key, value);
        });

        if (searchInput.page) {
          params.set("page", searchInput.page);
        }

        router.push(`?${params}`);

        // Perform search with the provided parameters
        const results = await service.searchFunds(searchInput);
        dispatch({ type: "SET_RESULTS", payload: results });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        dispatch({ type: "SET_RESULTS", payload: { data: [], total: 0 } });
      }
    },
    [service, router]
  );

  return {
    state,
    handleSearch,
    handleSearchV2,
    clearFilters,
    updateSearchInput,
    performSearch,
    handlePageChange,
  };
}

// Utility functions

const getPaginationInfo = (searchInput: SearchInput, total: number) => {
  const currentPage = parseInt(searchInput.page || "1");
  const ITEM_PER_PAGE = process.env.ITEM_PER_PAGE || "10";
  const itemsPerPage = parseInt(ITEM_PER_PAGE);
  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

const getFundTypeIcon = (fundCompare: string): { bg: string; text: string } => {
  const typeMap = {
    equity: { bg: "bg-red-500", text: "EQ" },
    bond: { bg: "bg-teal-700", text: "FI" },
    money: { bg: "bg-teal-700", text: "FI" },
    allocation: { bg: "bg-yellow-600", text: "MX" },
    property: { bg: "bg-blue-600", text: "RT" },
  };

  const type = fundCompare.toLowerCase();
  for (const [key, value] of Object.entries(typeMap)) {
    if (type.includes(key)) return value;
  }
  return { bg: "", text: "" };
};

const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Main Component
const SearchPage = ({ searchParams }: SearchPageProps) => {
  const resultsRef = useRef<HTMLDivElement>(null);
  const params = React.use(searchParams);

  const initialParams = {
    name: params.name || "",
    fundCompare: params.fundCompare || "",
    company: params.company || "",
    page: params.page || "1", // Add page initialization
  };

  const {
    state,
    handleSearch,
    handleSearchV2,
    clearFilters,
    updateSearchInput,
    // performSearch,
    handlePageChange,
  } = useSearchFunds(initialParams);

  useEffect(() => {
    // Only scroll if we have results and not on initial load
    if (state.results.data.length > 0 && !state.loading.results) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start", // Align to top of viewport
        });
      }, 100);
    }
  }, [state.results.data, state.loading.results]);

  // Update search input when URL params change and companies are loaded
  useEffect(() => {
    if (state.companies.length > 0 && params.company) {
      // Ensure the company value from URL matches the loaded companies
      const companyExists = state.companies.some(
        (c) => c.compThaiName === params.company
      );
      if (companyExists) {
        updateSearchInput({ company: params.company });
      }
    }
  }, [state.companies, params.company, updateSearchInput]);

  // Initial search effect
  useEffect(() => {
    if (Object.values(initialParams).some(Boolean)) {
      handleSearchV2();
    }
  }, []);

  // Updated pagination component
  const PaginationComponent = () => {
    const paginationInfo = getPaginationInfo(
      state.searchInput,
      state.results.total
    );
    const { currentPage, totalPages, hasNextPage, hasPrevPage } =
      paginationInfo;

    // Generate page numbers to show (show current page and 2 pages before/after)
    const getVisiblePages = () => {
      const maxVisible = 5; // Show up to 5 page numbers
      const half = Math.floor(maxVisible / 2);

      let startPage = Math.max(1, currentPage - half);
      let endPage = Math.min(totalPages, currentPage + half);

      // Adjust if we're near the beginning or end
      if (endPage - startPage + 1 < maxVisible) {
        if (startPage === 1) {
          endPage = Math.min(totalPages, startPage + maxVisible - 1);
        } else {
          startPage = Math.max(1, endPage - maxVisible + 1);
        }
      }

      return Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      );
    };

    const visiblePages = getVisiblePages();

    if (totalPages <= 1) return null;

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={cn(
                "hover:cursor-pointer",
                !hasPrevPage && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => {
                if (hasPrevPage) {
                  handlePageChange(currentPage - 1);
                }
              }}
            />
          </PaginationItem>

          {/* Show first page if not visible */}
          {visiblePages[0] > 1 && (
            <>
              <PaginationItem>
                <PaginationLink
                  className="hover:cursor-pointer"
                  onClick={() => handlePageChange(1)}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {visiblePages[0] > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {/* Show visible page numbers */}
          {visiblePages.map((pageNum) => (
            <PaginationItem key={pageNum}>
              <PaginationLink
                className={cn(
                  "hover:cursor-pointer",
                  pageNum === currentPage &&
                    "bg-primary text-primary-foreground"
                )}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Show last page if not visible */}
          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  className="hover:cursor-pointer"
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              className={cn(
                "hover:cursor-pointer",
                !hasNextPage && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => {
                if (hasNextPage) {
                  handlePageChange(currentPage + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  // Memoized components
  const SearchBox = useMemo(
    () => (
      <div className="search-box flex flex-col gap-5 min-w-[390px]">
        {/* Name Search */}
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="basis-2/3 lg:basis-1/2 relative h-full md:h-[135px] bg-primary-foreground/60 border rounded-2xl md:overflow-hidden">
            <div className="flex md:gap-38 w-full px-4 py-5">
              <Image
                src="/images/people/name.png"
                width={100}
                height={100}
                alt="search"
                className="absolute -bottom-2 left-3 z-10 hidden md:block"
              />
              <div className="w-50 h-50 bg-indigo-500 absolute rounded-full -left-14 top-8 hidden md:block" />
              <div className="w-full md:ml-37 flex flex-col gap-2">
                <p>
                  <span className="opacity-40 text-sm">
                    ค้นหาจาก <br />
                  </span>
                  ชื่อกองทุน
                </p>
                <div className="flex gap-2">
                  <input
                    value={state.searchInput.name}
                    onChange={(e) =>
                      updateSearchInput({ name: e.target.value })
                    }
                    className="border rounded-lg bg-primary-foreground px-2 py-2 text-xs w-full"
                    placeholder="กรอกชื่อกองทุน"
                  />
                  <Button
                    className="text-primary-foreground font-bold hover:cursor-pointer"
                    onClick={handleSearch}
                  >
                    ค้นหา
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Company Search */}
          <div className="basis-2/3 relative h-full md:h-[135px] bg-primary-foreground/60 border rounded-2xl md:overflow-hidden">
            <div className="flex md:gap-38 w-full px-4 py-5">
              <Image
                src="/images/people/company.png"
                width={100}
                height={100}
                alt="search"
                className="absolute -bottom-3 left-3 z-10 hidden md:block"
              />
              <div className="w-50 h-50 bg-teal-500 absolute rounded-full -left-14 top-8 hidden md:block" />
              <div className="w-full md:ml-37 flex flex-col gap-2">
                <p>
                  <span className="opacity-40 text-sm">
                    ค้นหาจาก <br />
                  </span>
                  รายชื่อบริษัทหลักทรัพย์จัดการกองทุน
                </p>
                {state.loading.companies ? (
                  <Loading cn="w-full max-h-[50px]" />
                ) : (
                  <div className="flex flex-col md:flex-row gap-2 items-end">
                    <Select
                      value={state.searchInput.company}
                      onValueChange={(value) => {
                        updateSearchInput({ company: value });
                      }}
                    >
                      <SelectTrigger className="w-full bg-primary-foreground text-xs">
                        <SelectValue placeholder="บริษัทหลักทรัพย์จัดการกองทุน" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>
                            บริษัทหลักทรัพย์จัดการกองทุน
                          </SelectLabel>
                          {state.companies.map((company, index) => {
                            if (company._count.compThaiName === 0) {
                            }
                            return (
                              <SelectItem
                                key={index}
                                value={company.compThaiName}
                              >
                                {company.compThaiName
                                  .replace(
                                    "บริษัทหลักทรัพย์จัดการกองทุนรวม",
                                    ""
                                  )
                                  .replace("บริษัทหลักทรัพย์จัดการกองทุน", "")
                                  .replace("จำกัด", "")
                                  .replace("(มหาชน)", "")
                                  .replace("(ประเทศไทย)", "")}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button
                      className="max-w-max text-primary-foreground font-bold hover:cursor-pointer"
                      onClick={handleSearch}
                    >
                      ค้นหา
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Fund Type Search */}
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="w-full relative bg-primary-foreground border rounded-2xl md:overflow-hidden">
            <div className="flex gap-38 w-full px-4 py-5">
              <div className="w-full flex flex-col gap-3">
                <p>
                  <span className="opacity-40 text-sm">ค้นหาจาก </span>
                  ประเภทของกองทุน
                </p>

                {state.loading.fundTypes ? (
                  <Loading cn="w-full max-h-[50px]" />
                ) : (
                  <>
                    <div className="flex relative gap-1 overflow-hidden">
                      <Marquee
                        pauseOnHover
                        className="[--duration:60s] hover:cursor-pointer"
                      >
                        {state.fundTypes.map((type, index) => {
                          const icon = getFundTypeIcon(type.fundCompare);
                          return (
                            <div
                              key={index}
                              className="flex relative justify-center items-center w-25 h-20 max-w-25 min-w-25 rounded-xl px-2 text-xs text-center font-medium bg-primary/10 border"
                              onClick={() =>
                                updateSearchInput({
                                  fundCompare: type.fundCompare,
                                })
                              }
                            >
                              <div className="flex flex-col gap-1">
                                {icon.text && (
                                  <div
                                    className={cn(
                                      "absolute -top-2 right-0 flex justify-center items-center w-5 h-5 rounded-full text-[8px] text-primary font-semibold text-center shadow-xs shadow-slate-900",
                                      icon.bg
                                    )}
                                  >
                                    {icon.text}
                                  </div>
                                )}
                                {truncateText(type.fundCompare, 25)}
                                <span className="opacity-50">
                                  {` (${type._count.fundCompare} กอง)`}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </Marquee>
                      <div className="pointer-events-none absolute inset-x-0 -rotate-90 bottom-0 translate-x-[49%] h-1/4 bg-gradient-to-t from-primary-foreground z-10" />
                      <div className="pointer-events-none absolute inset-x-0 rotate-90 bottom-0 -translate-x-[49%] h-1/4 bg-gradient-to-t from-primary-foreground z-10" />
                    </div>

                    <div className="flex gap-2 justify-end items-center w-full">
                      <Select
                        value={state.searchInput.fundCompare}
                        onValueChange={(value) =>
                          updateSearchInput({ fundCompare: value })
                        }
                      >
                        <SelectTrigger className="w-full bg-primary-foreground">
                          <SelectValue placeholder="ประเภทของกองทุน" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>ประเภทของกองทุน</SelectLabel>
                            {state.fundTypes.map((type, index) => (
                              <SelectItem key={index} value={type.fundCompare}>
                                {truncateText(
                                  type.fundCompare,
                                  window.innerWidth < 400 ? 27 : 100
                                )}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Button
                        className="text-primary-foreground font-bold hover:cursor-pointer"
                        onClick={handleSearch}
                      >
                        ค้นหา
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        <div className="w-full flex justify-end">
          <Button
            className="flex gap-2 justify-center items-center bg-primary-foreground w-full border text-white hover:text-red-500 hover:bg-red-400/10 hover:cursor-pointer"
            onClick={clearFilters}
          >
            <Trash size={16} />
            ล้างตัวกรอง
          </Button>
        </div>
      </div>
    ),
    [state, updateSearchInput, handleSearch, clearFilters]
  );

  return (
    <>
      <Header
        top="Search"
        header="ค้นหากองทุน"
        content="ค้นหากองทุนที่ตรงใจคุณได้ที่นี่"
      />

      {SearchBox}

      {/* Results */}
      <div ref={resultsRef}>
        <div className="mt-8 mx-auto flex flex-col gap-2 justify-center text-center text-2xl">
          ผลการค้นหา <br />
          <p className="text-base -mt-1 mb-2">ข้อมูลกองทุนและระดับความเสี่ยง</p>
          <p className="text-sm opacity-50">
            พบข้อมูลจำนวน {state.results.total.toLocaleString()} กองทุน
          </p>
        </div>
      </div>

      {state.error ? (
        <div className="text-red-500 text-center mt-4">{state.error}</div>
      ) : state.loading.results ? (
        <Loading cn="w-full max-h-[50px]" />
      ) : state.results.data.length === 0 ? (
        <p className="text-center w-full">ไม่มีผลลัพธ์</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {state.results.data.map((fund) => (
            <div
              key={fund.id}
              className="border rounded-lg hover:bg-primary-foreground/80 duration-300 group"
            >
              <div
                onClick={() =>
                  window.open(
                    `/search/detail?name=${fund.projAbbrName}`,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                className="flex justify-between items-center p-4 hover:cursor-pointer"
              >
                <div>
                  <div className="flex gap-2 ">
                    <h3 className="flex gap-2 items-center font-medium">
                      {fund.projAbbrName}
                    </h3>

                    <div className="flex items-center justify-center gap-1 opacity-70">
                      <div className="text-xs bg-primary-foreground border px-1.5 rounded-md text-primary">
                        <p>
                          {fund.compThaiName
                            .replace("บริษัทหลักทรัพย์จัดการกองทุนรวม", "")
                            .replace("บริษัทหลักทรัพย์จัดการกองทุน", "")
                            .replace("จำกัด", "")
                            .replace("(มหาชน)", "")
                            .replace("(ประเทศไทย)", "")}
                        </p>
                      </div>
                    </div>

                    {fund.investCountryFlagEng.includes("ไม่มีความเสี่ยง") ? (
                      <></>
                    ) : (
                      <>
                        <div className="flex justify-center items-center">
                          <p className="text-xs">
                            <Globe
                              size={16}
                              className="text-indigo-500 opacity-50"
                            />
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <p className="text-sm text-primary/70">{fund.projThaiName}</p>
                </div>
                <div className="flex opacity-70">
                  {!+fund.riskSpectrum.replace("RS", "") ? (
                    <div className="flex gap-1 justify-center items-center">
                      <AlertCircle size={16} />
                      <p className="text-sm">ไม่มีข้อมูล</p>
                    </div>
                  ) : (
                    <AnimatedCircularProgressBar
                      max={8}
                      min={1}
                      value={
                        !+fund.riskSpectrum.replace("RS", "")
                          ? 0
                          : +fund.riskSpectrum.replace("RS", "")
                      }
                      gaugePrimaryColor={
                        +fund.riskSpectrum.replace("RS", "")
                          ? +fund.riskSpectrum.replace("RS", "") <= 4
                            ? "oklch(70.4% 0.14 182.503)"
                            : +fund.riskSpectrum.replace("RS", "") <= 5
                            ? "oklch(79.5% 0.184 86.047)"
                            : +fund.riskSpectrum.replace("RS", "") <= 6
                            ? "oklch(63.7% 0.237 25.331)"
                            : "oklch(58.5% 0.233 277.117)"
                          : "oklch(58.5% 0.233 277.117)"
                      }
                      gaugeSecondaryColor="rgba(255, 255, 255, 0.1)"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {state.results.total > 0 && <PaginationComponent />}
    </>
  );
};

export default SearchPage;

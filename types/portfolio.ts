export interface OptimizationResult {
  weights: number[];
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  assets: {
    id: string;
    name: string;
    weight: number;
    expectedReturn: number;
    volatility: number;
  }[];
}

export interface UserProfile {
  investmentAmount: number;
  investmentHorizon: number;
}

export interface AssetInput {
  id: string;
  name: string;
  expectedReturn: number;
  volatility: number;
}

export type Payload = {
  dataKey: string;
  name: string;
  value: string | number;
  color: string;
};

export type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    name: string;
    value: string | number;
    color: string;
  }>;
  label?: string;
};

export interface CorrelationInput {
  asset1Id: string;
  asset2Id: string;
  value: number;
}

export interface FrontierPoint {
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
}

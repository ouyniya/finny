import { Dispatch, SetStateAction } from "react";
import { TooltipProps } from "recharts";

export type FormData = {
  age: number;
  salary: number;
  saving: number;
  retireAge: number;
  lifestyle: "low" | "medium" | "high";
  portfolio: {
    stock: number;
    bond: number;
    cash: number;
  };
};

export type HistoryItem = {
  year: number;
  age: number;
  balance: number;
  phase: string;
};

export type StepProps = {
  data: FormData;
  onChange: Dispatch<SetStateAction<FormData>>;
};

export interface CustomTooltipProps extends TooltipProps<number, string> {
  payload?: Array<{
    payload: {
      age: number;
      balance: number;
      phase: string;
    };
    dataKey: string;
    value: number;
  }>;
}

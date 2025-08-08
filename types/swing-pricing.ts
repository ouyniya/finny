export interface CalculationStep {
  step: string;
  description: string;
  value: string;
}

export interface DetailedScenario {
  scenarioName: string;
  steps: CalculationStep[];
}

export interface SimulationResults {
  navBeforeSwing: number;
  navAfterNoSwing: number;
  navAfterSwing: number;
  dilutionAmount: number;
  dilutionPercentage: number;
  firstMoverAdvantage: number;
  swingFactorUsed: number;
  isSwingTriggered: boolean;
  timelineNavNoSwing: { day1: number; day2: number; day3: number };
  timelineNavSwing: { day1: number; day2: number; day3: number };
  detailedCalculations: DetailedScenario[];
}

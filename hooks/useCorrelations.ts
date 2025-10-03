import { useState, useCallback } from "react";

export type Correlation = {
  asset1Id: string;
  asset2Id: string;
  value: number;
};

export function useCorrelations() {
  const [correlations, setCorrelations] = useState<Correlation[]>([]);
  const [corrLoading, setCorrLoading] = useState(false);
  const [corrError, setCorrError] = useState<string | null>(null);

  const loadCorrelations = useCallback(async (assets: string[], dateValue: string) => {
    setCorrLoading(true);
    setCorrError(null);
    try {
      const query = `assets=${assets.join(",")}&dateValue=${dateValue}`;
      const res = await fetch(`/api/correlations?${query}`);
      if (!res.ok) throw new Error("Failed to fetch correlations");

      const data = await res.json();
      // Convert API object to array
      const newCorrelations: Correlation[] = [];
      for (const asset1Id in data.correlations) {
        for (const asset2Id in data.correlations[asset1Id]) {
          if (asset1Id !== asset2Id) {
            newCorrelations.push({
              asset1Id,
              asset2Id,
              value: data.correlations[asset1Id][asset2Id],
            });
          }
        }
      }
      setCorrelations(newCorrelations);
    } catch (err) {
      if (err instanceof Error) setCorrError(err.message);
      else setCorrError("Unexpected error occurred");
    } finally {
      setCorrLoading(false);
    }
  }, []);

  const updateCorrelation = useCallback((asset1Id: string, asset2Id: string, value: number) => {
    setCorrelations(prev => {
      const index = prev.findIndex(c =>
        (c.asset1Id === asset1Id && c.asset2Id === asset2Id) ||
        (c.asset1Id === asset2Id && c.asset2Id === asset1Id)
      );
      if (index !== -1) {
        return prev.map((c, i) => i === index ? { ...c, value } : c);
      }
      return [...prev, { asset1Id, asset2Id, value }];
    });
  }, []);

  const getCorrelationValue = useCallback((asset1Id: string, asset2Id: string) => {
    const c = correlations.find(c =>
      (c.asset1Id === asset1Id && c.asset2Id === asset2Id) ||
      (c.asset1Id === asset2Id && c.asset2Id === asset1Id)
    );

    console.log()
    return c?.value ?? 0;
  }, [correlations]);

  const removeAssetCorrelations = useCallback((assetId: string) => {
  setCorrelations(prev => prev.filter(
    c => c.asset1Id !== assetId && c.asset2Id !== assetId
  ));
}, []);

  return {
    correlations,
    corrLoading,
    corrError,
    loadCorrelations,
    updateCorrelation,
    getCorrelationValue,
    removeAssetCorrelations
  };
}

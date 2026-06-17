import { useEffect, useState } from "react";
import { getEstimateCost } from "../data/pzemService";

export default function useCostEstimate(period = "month") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCost = async () => {
      setLoading(true);
      try {
        const result = await getEstimateCost(period);
        if (isMounted) setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCost();

    return () => {
      isMounted = false;
    };
  }, [period]);

  return { data, loading };
}

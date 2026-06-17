import { useEffect, useState } from "react";
import { getSummary } from "../data/pzemService";

export default function useSummary(period = "today") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSummary = async () => {
      setLoading(true);
      try {
        const result = await getSummary(period);
        if (isMounted) setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSummary();

    return () => {
      isMounted = false;
    };
  }, [period]);

  return { data, loading };
}

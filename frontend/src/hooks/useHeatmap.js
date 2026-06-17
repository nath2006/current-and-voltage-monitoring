import { useEffect, useState } from "react";
import { getHeatmap } from "../data/pzemService";

export default function useHeatmap(weeks = 4) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchHeatmap = async () => {
      setLoading(true);
      try {
        const result = await getHeatmap(weeks);
        if (isMounted) setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHeatmap();

    return () => {
      isMounted = false;
    };
  }, [weeks]);

  return { data, loading };
}

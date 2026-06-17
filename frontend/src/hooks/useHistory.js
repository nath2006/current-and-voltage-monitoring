import { useEffect, useState } from "react";
import { getHistory } from "../data/pzemService";

export default function useHistory(range = "day") {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const result = await getHistory(range);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, [range]);

  return { data, loading, error };
}

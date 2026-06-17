import { useEffect, useState } from "react";
import { getRecentEvents } from "../data/pzemService";

export default function useEvents(limit = 20, pollIntervalMs = 30000) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      try {
        const result = await getRecentEvents(limit);
        if (isMounted) setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEvents();

    const interval = setInterval(fetchEvents, pollIntervalMs);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [limit, pollIntervalMs]);

  return { data, loading };
}

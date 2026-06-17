import { useEffect, useState } from "react";
import { getLatestPzemData } from "../data/pzemService";

export default function usePzem() {
  const [data, setData] = useState(null);
  const [device, setDevice] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getLatestPzemData();

        setData(result.telemetry);
        setDevice(result.device);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval);
  }, []);

  return { data, device };
}

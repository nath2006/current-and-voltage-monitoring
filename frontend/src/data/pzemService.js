import axios from "axios";

/**
 * HIT API FROM BE SERVICE 
 */

const API_URL = "http://localhost:3001/api/pzem/latest";

export const getLatestPzemData = async () => {
  const res = await axios.get(API_URL);
  return res.data.data;
};

import axios from "axios";

/**
 * HIT API FROM BE SERVICE 
 */

const API_URL =
   "http://localhost:3001/api/pzem/latest";
  //"http://192.168.1.6:3001/api/pzem/latest";

export const getLatestPzemData = async () => {
  const response = await axios.get(API_URL);

  return response.data.data;
};

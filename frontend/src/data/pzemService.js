/**
 * HIT API FROM BE SERVICE 
 */
import axios from "axios";

const BASE_URL = "http://localhost:3001/api/pzem";

export const getLatestPzemData = async () => {
  const res = await axios.get(`${BASE_URL}/latest`);
  return res.data.data;
};

export const getHistory = async (range = "day") => {
  const res = await axios.get(`${BASE_URL}/history`, { params: { range } });
  return res.data.data;
};

export const getHeatmap = async (weeks = 4) => {
  const res = await axios.get(`${BASE_URL}/heatmap`, { params: { weeks } });
  return res.data.data;
};

export const getRecentEvents = async (limit = 20) => {
  const res = await axios.get(`${BASE_URL}/events`, { params: { limit } });
  return res.data.data;
};

export const getSummary = async (period = "today") => {
  const res = await axios.get(`${BASE_URL}/summary`, { params: { period } });
  return res.data.data;
};

export const getEstimateCost = async (period = "month") => {
  const res = await axios.get(`${BASE_URL}/estimate-cost`, { params: { period } });
  return res.data.data;
};

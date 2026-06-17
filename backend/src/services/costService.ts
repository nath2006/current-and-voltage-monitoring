import { getSummary } from "./summaryService.js";

const DEFAULT_TARIFF =
  parseFloat(process.env.ELECTRICITY_TARIFF) || 1444.7;

/**
 * Estimasi biaya listrik untuk periode tertentu.
 * Ini murni estimasi berdasarkan sensor PZEM (bukan alat ukur resmi),
 * jadi cocok untuk pemantauan personal, bukan dasar penagihan.
 */
async function estimateCost(period = "month", tariff = DEFAULT_TARIFF) {
  const summary = await getSummary(period);

  const currentCost = round(summary.current.totalEnergyKwh * tariff);
  const previousCost = round(summary.previous.totalEnergyKwh * tariff);

  return {
    period,
    tariffPerKwh: tariff,
    currentEnergyKwh: summary.current.totalEnergyKwh,
    estimatedCost: currentCost,
    previousEnergyKwh: summary.previous.totalEnergyKwh,
    previousEstimatedCost: previousCost,
    note: "Estimasi berdasarkan sensor PZEM, bukan alat ukur resmi bersertifikat.",
  };
}

function round(n) {
  return Math.round(n * 100) / 100;
}

export { estimateCost, DEFAULT_TARIFF };

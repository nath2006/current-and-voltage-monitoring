import prisma from "../lib/prisma.js";
import { formatDate } from "./rollupService.js";

/**
 * Statistik ringkasan untuk periode tertentu, plus perbandingan
 * dengan periode sebelumnya (hari ini vs kemarin, minggu ini vs minggu lalu, dst).
 */
async function getSummary(period = "today") {
  const { current, previous } = getPeriodRanges(period);

  // Konversi string ke Date object untuk Prisma
  const currentSummaries = await prisma.dailySummary.findMany({
    where: { 
      date: { 
        gte: new Date(`${current.start}T00:00:00.000Z`), 
        lte: new Date(`${current.end}T23:59:59.999Z`) 
      } 
    },
  });

  const previousSummaries = await prisma.dailySummary.findMany({
    where: { 
      date: { 
        gte: new Date(`${previous.start}T00:00:00.000Z`), 
        lte: new Date(`${previous.end}T23:59:59.999Z`) 
      } 
    },
  });

  const currentAgg = aggregate(currentSummaries);
  const previousAgg = aggregate(previousSummaries);

  return {
    period,
    current: currentAgg,
    previous: previousAgg,
    change: {
      totalEnergyKwh: percentChange(
        previousAgg.totalEnergyKwh,
        currentAgg.totalEnergyKwh
      ),
      activeDurationSeconds: percentChange(
        previousAgg.activeDurationSeconds,
        currentAgg.activeDurationSeconds
      ),
    },
  };
}

function aggregate(summaries: any[]) {
  if (summaries.length === 0) {
    return {
      totalEnergyKwh: 0,
      activeDurationSeconds: 0,
      avgPower: 0,
      peakPower: 0,
      daysCounted: 0,
    };
  }

  const totalEnergyKwh = summaries.reduce((s, d) => s + d.totalEnergyKwh, 0);
  const activeDurationSeconds = summaries.reduce(
    (s, d) => s + d.activeDurationSeconds,
    0
  );
  const avgPower =
    summaries.reduce((s, d) => s + d.avgPower, 0) / summaries.length;
  const peakPower = Math.max(...summaries.map((d) => d.peakPower));

  return {
    totalEnergyKwh: round(totalEnergyKwh),
    activeDurationSeconds,
    avgPower: round(avgPower),
    peakPower: round(peakPower),
    daysCounted: summaries.length,
  };
}

function percentChange(prev: number, curr: number) {
  if (prev === 0) return curr > 0 ? 100 : 0;
  return round(((curr - prev) / prev) * 100);
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

function getPeriodRanges(period: string) {
  const today = new Date();
  const todayStr = formatDate(today);

  if (period === "today") {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = formatDate(yesterday);

    return {
      current: { start: todayStr, end: todayStr },
      previous: { start: yStr, end: yStr },
    };
  }

  if (period === "week") {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 6);

    const prevWeekEnd = new Date(weekStart);
    prevWeekEnd.setDate(prevWeekEnd.getDate() - 1);
    const prevWeekStart = new Date(prevWeekEnd);
    prevWeekStart.setDate(prevWeekStart.getDate() - 6);

    return {
      current: { start: formatDate(weekStart), end: todayStr },
      previous: {
        start: formatDate(prevWeekStart),
        end: formatDate(prevWeekEnd),
      },
    };
  }

  // Month (30 days)
  const monthStart = new Date(today);
  monthStart.setDate(monthStart.getDate() - 29);

  const prevMonthEnd = new Date(monthStart);
  prevMonthEnd.setDate(prevMonthEnd.getDate() - 1);

  const prevMonthStart = new Date(prevMonthEnd);
  prevMonthStart.setDate(prevMonthStart.getDate() - 29);

  return {
    current: { start: formatDate(monthStart), end: todayStr },
    previous: {
      start: formatDate(prevMonthStart),
      end: formatDate(prevMonthEnd),
    },
  };
}

export { getSummary };

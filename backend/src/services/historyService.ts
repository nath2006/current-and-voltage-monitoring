import prisma from "../lib/prisma.js";

/**
 * Mengambil data history untuk grafik tren.
 * - range "day"   : readings per menit, 24 jam terakhir (data mentah)
 * - range "week"  : daily_summary, 7 hari terakhir
 * - range "month" : daily_summary, 30 hari terakhir
 */
async function getHistory(range = "day") {
  if (range === "day") {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const readings = await prisma.reading.findMany({
      where: {
        recordedAt: {
          gte: since,
        },
      },
      orderBy: {
        recordedAt: "asc",
      },
      select: {
        recordedAt: true,
        power: true,
        voltage: true,
        current: true,
        energy: true,
      },
    });

    return readings.map((r) => ({
      timestamp: r.recordedAt,
      power: r.power,
      voltage: r.voltage,
      current: r.current,
      energy: r.energy,
    }));
  }

  const days = range === "week" ? 7 : 30;

  const since = new Date();
  since.setDate(since.getDate() - days);

  const sinceStr = since.toISOString().split("T")[0];

  const summaries = await prisma.dailySummary.findMany({
    where: {
      date: {
        gte: sinceStr,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  return summaries.map((s) => ({
    date: s.date,
    totalEnergyKwh: s.totalEnergyKwh,
    activeDurationSeconds: s.activeDurationSeconds,
    avgPower: s.avgPower,
    peakPower: s.peakPower,
    peakHour: s.peakHour,
  }));
}

export { getHistory };

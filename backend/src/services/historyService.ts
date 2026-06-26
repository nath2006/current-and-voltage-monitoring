import prisma from "../lib/prisma.js";

/**
 * Mengambil data history untuk grafik tren.
 *
 * range:
 * - day   : data mentah 24 jam terakhir
 * - week  : ringkasan 7 hari terakhir
 * - month : ringkasan 30 hari terakhir
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
        voltage: true,
        current: true,
        power: true,
        energy: true,
      },
    });

    return readings.map((reading) => ({
      timestamp: reading.recordedAt,
      voltage: reading.voltage,
      current: reading.current,
      power: reading.power,
      energy: reading.energy,
    }));
  }

  // Week = 7 hari, selain itu Month = 30 hari
  const days = range === "week" ? 7 : 30;

  const since = new Date();
  since.setDate(since.getDate() - days);

  // Karena kolom date bertipe DATE, reset ke awal hari
  since.setHours(0, 0, 0, 0);

  const summaries = await prisma.dailySummary.findMany({
    where: {
      date: {
        gte: since,
      },
    },
    orderBy: {
      date: "asc",
    },
    select: {
      date: true,
      totalEnergyKwh: true,
      activeDurationSeconds: true,
      avgPower: true,
      peakPower: true,
      peakHour: true,
    },
  });

  return summaries.map((summary) => ({
    date: summary.date,
    totalEnergyKwh: summary.totalEnergyKwh,
    activeDurationSeconds: summary.activeDurationSeconds,
    avgPower: summary.avgPower,
    peakPower: summary.peakPower,
    peakHour: summary.peakHour,
  }));
}

export { getHistory };

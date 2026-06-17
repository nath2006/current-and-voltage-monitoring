import prisma from "../lib/prisma.ts";

/**
 * Hitung dan simpan/update ringkasan harian dari tabel readings untuk
 * tanggal tertentu (default: hari ini, waktu lokal server).
 */
async function rollupDailySummary(dateStr) {
  const targetDate = dateStr || formatDate(new Date());
  const { start, end } = dayRange(targetDate);

  const readings = await prisma.reading.findMany({
    where: { recordedAt: { gte: start, lt: end } },
    orderBy: { recordedAt: "asc" },
  });

  if (readings.length === 0) {
    return null;
  }

  const totalEnergyKwh =
    readings[readings.length - 1].energy - readings[0].energy;

  const activeReadings = readings.filter((r) => r.state !== "idle");

  // Setiap reading merepresentasikan ~1 menit (interval downsampling)
  const activeDurationSeconds = activeReadings.length * 60;

  const avgPower =
    readings.reduce((sum, r) => sum + r.power, 0) / readings.length;

  const peakPower = Math.max(...readings.map((r) => r.power));

  const peakHour = findPeakHour(readings);

  const summary = await prisma.dailySummary.upsert({
    where: { date: targetDate },
    update: {
      totalEnergyKwh: totalEnergyKwh >= 0 ? totalEnergyKwh : 0,
      activeDurationSeconds,
      avgPower,
      peakPower,
      peakHour,
    },
    create: {
      date: targetDate,
      totalEnergyKwh: totalEnergyKwh >= 0 ? totalEnergyKwh : 0,
      activeDurationSeconds,
      avgPower,
      peakPower,
      peakHour,
    },
  });

  return summary;
}

function findPeakHour(readings) {
  const hourlyPower = Array(24).fill(0);
  const hourlyCount = Array(24).fill(0);

  for (const r of readings) {
    const hour = r.recordedAt.getHours();
    hourlyPower[hour] += r.power;
    hourlyCount[hour] += 1;
  }

  let peakHour = 0;
  let peakAvg = -1;

  for (let h = 0; h < 24; h++) {
    if (hourlyCount[h] === 0) continue;

    const avg = hourlyPower[h] / hourlyCount[h];

    if (avg > peakAvg) {
      peakAvg = avg;
      peakHour = h;
    }
  }

  return peakHour;
}

function dayRange(dateStr) {
  const start = new Date(`${dateStr}T00:00:00`);
  const end = new Date(`${dateStr}T23:59:59.999`);

  return { start, end };
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

export {
  rollupDailySummary,
  formatDate,
};

import prisma from "../lib/prisma.js";

const DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

/**
 * Menghasilkan matrix rata-rata power untuk tiap kombinasi (hari dalam minggu, jam),
 * dipakai untuk heatmap di frontend.
 */
async function getHeatmapData(weeks = 4) {
  const since = new Date();
  since.setDate(since.getDate() - weeks * 7);

  const readings = await prisma.reading.findMany({
    where: { recordedAt: { gte: since } },
    select: {
      power: true,
      recordedAt: true,
    },
  });

  // matrix[dayOfWeek][hour] = { total, count }
  const matrix = Array.from({ length: 7 }, () =>
    Array.from({ length: 24 }, () => ({
      total: 0,
      count: 0,
    }))
  );

  for (const r of readings) {
    const day = r.recordedAt.getDay(); // 0 = Minggu
    const hour = r.recordedAt.getHours();

    matrix[day][hour].total += r.power;
    matrix[day][hour].count += 1;
  }

  const result = [];

  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const cell = matrix[day][hour];

      result.push({
        day,
        dayName: DAY_NAMES[day],
        hour,
        avgPower:
          cell.count > 0
            ? Math.round((cell.total / cell.count) * 10) / 10
            : 0,
        sampleCount: cell.count,
      });
    }
  }

  return result;
}

export { getHeatmapData };

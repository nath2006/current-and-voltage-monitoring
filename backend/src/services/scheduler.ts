import cron from "node-cron";
import prisma from "../lib/prisma.js";
import { rollupDailySummary, formatDate } from "./rollupService.js";

function startScheduledJobs() {
  // Jalan setiap hari pukul 23:09
  cron.schedule("05 00 * * *", async () => {
    console.log("[CRON] Starting daily rollup...");

    try {
      const readings = await prisma.reading.findMany({
        select: {
          recordedAt: true,
        },
        orderBy: {
          recordedAt: "asc",
        },
      });

      if (readings.length === 0) {
        console.log("[CRON] No readings found.");
        return;
      }

      // Ambil semua tanggal unik seperti endpoint backfill
      const dates = [...new Set(readings.map((r) => formatDate(r.recordedAt)))].sort();

      console.log(`[CRON] Processing ${dates.length} dates...`);

      for (const dateStr of dates) {
        try {
          const result = await rollupDailySummary(dateStr);

          console.log(
            `[CRON] Daily rollup for ${dateStr}:`,
            result ? "done" : "no data"
          );
        } catch (err: any) {
          console.error(`[CRON] Rollup failed for ${dateStr}:`, err.message);
        }
      }

      console.log("[CRON] Daily rollup finished.");
    } catch (err: any) {
      console.error("[CRON] Scheduler failed:", err.message);
    }
  });

  console.log("[CRON] Scheduled jobs registered");
}

export { startScheduledJobs };

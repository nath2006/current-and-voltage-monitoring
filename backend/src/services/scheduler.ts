import cron from "node-cron";
import { rollupDailySummary, formatDate } from "./rollupService.js";

function startScheduledJobs() {
  // Jalan tiap jam 00:05, rollup data hari kemarin
  // supaya reading terakhir hari itu sudah pasti tersimpan
  cron.schedule("5 0 * * *", async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const dateStr = formatDate(yesterday);

    try {
      const result = await rollupDailySummary(dateStr);

      console.log(
        `[CRON] Daily rollup for ${dateStr}:`,
        result ? "done" : "no data"
      );
    } catch (err) {
      console.error("[CRON] Rollup failed:", err.message);
    }
  });

  console.log("[CRON] Scheduled jobs registered");
}

export { startScheduledJobs };

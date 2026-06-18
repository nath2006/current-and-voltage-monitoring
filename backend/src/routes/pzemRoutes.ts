import express, { Request, Response } from "express";
import prisma from "../lib/prisma.js";  
import { getHistory } from "../services/historyService.js";
import { getHeatmapData } from "../services/heatmapService.js";
import { getRecentEvents } from "../services/eventService.js";
import { getSummary } from "../services/summaryService.js";
import { estimateCost } from "../services/costService.js";
import { rollupDailySummary } from "../services/rollupService.js";
import { rollupDailySummary, formatDate } from "../services/rollupService.js";
const router = express.Router();

// GET /api/pzem/rollup/backfill
router.get("/rollup/backfill", async (req: Request, res: Response) => {
  try {
    console.log("🔄 Starting backfill via API...");
    
    // Cek koneksi database dulu
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log("✅ Database connected");
    } catch (dbError) {
      console.error("❌ Database connection failed:", dbError);
      return res.status(500).json({
        success: false,
        message: "Database connection failed",
        error: dbError instanceof Error ? dbError.message : "Unknown DB error",
      });
    }

    // Ambil semua readings
    let readings;
    try {
      readings = await prisma.reading.findMany({
        select: { recordedAt: true },
        orderBy: { recordedAt: "asc" },
      });
      console.log(`📊 Found ${readings.length} readings`);
    } catch (readError) {
      console.error("❌ Failed to fetch readings:", readError);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch readings",
        error: readError instanceof Error ? readError.message : "Unknown error",
      });
    }

    if (readings.length === 0) {
      return res.json({
        success: true,
        message: "No readings found",
        data: [],
      });
    }

    // Dapatkan tanggal unik
    const dates = new Set<string>();
    for (const r of readings) {
      const dateStr = formatDate(r.recordedAt);
      dates.add(dateStr);
    }

    console.log(`📅 Found ${dates.size} unique dates to backfill`);
    console.log("Dates:", Array.from(dates).sort());

    const results = [];
    let successCount = 0;
    let failCount = 0;

    for (const dateStr of dates) {
      try {
        console.log(`  ⏳ Processing ${dateStr}...`);
        const result = await rollupDailySummary(dateStr);
        
        if (result) {
          console.log(`  ✅ ${dateStr}: success`);
          successCount++;
        } else {
          console.log(`  ⚠️ ${dateStr}: no data (0 readings)`);
          failCount++;
        }
        
        results.push({
          date: dateStr,
          success: !!result,
          data: result,
        });
      } catch (error: any) {
        console.error(`  ❌ ${dateStr}: error -`, error.message);
        failCount++;
        results.push({
          date: dateStr,
          success: false,
          error: error.message,
          stack: error.stack,
        });
      }
    }

    console.log(`✅ Backfill completed: ${successCount} success, ${failCount} failed`);

    res.json({
      success: true,
      message: `Backfill completed: ${successCount} success, ${failCount} failed`,
      totalDates: dates.size,
      successCount,
      failCount,
      data: results,
    });
  } catch (err) {
    console.error("[GET /rollup/backfill] FATAL ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to backfill",
      error: err instanceof Error ? err.message : "Unknown error",
      stack: err instanceof Error ? err.stack : undefined,
    });
  }
});

// GET /api/pzem/history?range=day|week|month
router.get("/history", async (req: Request, res: Response) => {
  try {
    const range =
      typeof req.query.range === "string" &&
      ["day", "week", "month"].includes(req.query.range)
        ? req.query.range
        : "day";

    const data = await getHistory(range);

    res.json({
      success: true,
      range,
      data,
    });
  } catch (err) {
    console.error("[GET /history]", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch history",
    });
  }
});

// GET /api/pzem/heatmap?weeks=4
router.get("/heatmap", async (req: Request, res: Response) => {
  try {
    const weeks =
      typeof req.query.weeks === "string"
        ? parseInt(req.query.weeks, 10)
        : 4;

    const data = await getHeatmapData(weeks);

    res.json({
      success: true,
      weeks,
      data,
    });
  } catch (err) {
    console.error("[GET /heatmap]", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch heatmap",
    });
  }
});

// GET /api/pzem/events?limit=20
router.get("/events", async (req: Request, res: Response) => {
  try {
    const limit =
      typeof req.query.limit === "string"
        ? parseInt(req.query.limit, 10)
        : 20;

    const data = await getRecentEvents(limit);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("[GET /events]", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
});

// GET /api/pzem/summary?period=today|week|month
router.get("/summary", async (req: Request, res: Response) => {
  try {
    const period =
      typeof req.query.period === "string" &&
      ["today", "week", "month"].includes(req.query.period)
        ? req.query.period
        : "today";

    const data = await getSummary(period);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("[GET /summary]", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch summary",
    });
  }
});

// GET /api/pzem/estimate-cost?period=month&tariff=1444.7
router.get("/estimate-cost", async (req: Request, res: Response) => {
  try {
    const period =
      typeof req.query.period === "string" &&
      ["today", "week", "month"].includes(req.query.period)
        ? req.query.period
        : "month";

    const tariff =
      typeof req.query.tariff === "string"
        ? parseFloat(req.query.tariff)
        : undefined;

    const data = await estimateCost(period, tariff);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("[GET /estimate-cost]", err);

    res.status(500).json({
      success: false,
      message: "Failed to estimate cost",
    });
  }
});

// POST /api/pzem/rollup
router.post("/rollup", async (req: Request, res: Response) => {
  try {
    const date: string | undefined = req.body?.date;

    const result = await rollupDailySummary(date);

    if (!result) {
      return res.json({
        success: true,
        message:
          "No readings found for that date, nothing to roll up.",
      });
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("[POST /rollup]", err);

    return res.status(500).json({
      success: false,
      message: "Failed to rollup summary",
    });
  }
});

export default router;

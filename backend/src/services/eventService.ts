import prisma from "../lib/prisma.js";

async function getRecentEvents(limit = 20) {
  const events = await prisma.usageEvent.findMany({
    orderBy: { startedAt: "desc" },
    take: limit,
  });

  return events.map((e) => ({
    id: e.id,
    state: e.state,
    startedAt: e.startedAt,
    endedAt: e.endedAt,
    durationSeconds: e.durationSeconds,
    avgPower: e.avgPower,
    energyUsed: e.energyUsed,
    ongoing: e.endedAt === null,
  }));
}

export { getRecentEvents };

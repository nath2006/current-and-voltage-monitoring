import prisma from "../lib/prisma.js";
import { classifyState } from "./stateClassifier.js";

const DOWNSAMPLE_INTERVAL_MS = 60 * 1000; // simpan ke DB tiap 1 menit

let lastSavedAt = 0;
let currentEventId = null;
let currentEventState = null;

/**
 * Dipanggil setiap kali data MQTT masuk. Mengembalikan true kalau data
 * benar-benar disimpan ke DB (bukan sekedar live update di memory).
 */
async function maybeRecordReading(payload) {
  const now = Date.now();

  if (now - lastSavedAt < DOWNSAMPLE_INTERVAL_MS) {
    return false;
  }

  lastSavedAt = now;
  const recordedAt = new Date(now);
  const state = classifyState(payload.power);

  await prisma.reading.create({
    data: {
      voltage: payload.voltage,
      current: payload.current,
      power: payload.power,
      energy: payload.energy,
      frequency: payload.frequency,
      pf: payload.pf,
      state,
      recordedAt,
    },
  });

  await handleStateTransition(state, recordedAt, payload);

  return true;
}

/**
 * Menutup usage_event sebelumnya (kalau ada perubahan state) dan
 * membuka usage_event baru. Event yang masih berlangsung punya endedAt = null.
 */
async function handleStateTransition(newState, timestamp, payload) {
  if (currentEventId === null) {
    const openEvent = await prisma.usageEvent.findFirst({
      where: { endedAt: null },
      orderBy: { startedAt: "desc" },
    });

    if (openEvent) {
      currentEventId = openEvent.id;
      currentEventState = openEvent.state;
    }
  }

  if (currentEventState === newState) {
    return;
  }

  if (currentEventId !== null) {
    const prevEvent = await prisma.usageEvent.findUnique({
      where: { id: currentEventId },
    });

    if (prevEvent) {
      const durationSeconds = Math.round(
        (timestamp.getTime() - prevEvent.startedAt.getTime()) / 1000
      );

      const readingsInRange = await prisma.reading.findMany({
        where: {
          recordedAt: {
            gte: prevEvent.startedAt,
            lte: timestamp,
          },
        },
        select: {
          power: true,
          energy: true,
        },
      });

      const avgPower =
        readingsInRange.length > 0
          ? readingsInRange.reduce((sum, r) => sum + r.power, 0) /
            readingsInRange.length
          : null;

      const energyUsed =
        readingsInRange.length > 1
          ? readingsInRange[readingsInRange.length - 1].energy -
            readingsInRange[0].energy
          : 0;

      await prisma.usageEvent.update({
        where: { id: currentEventId },
        data: {
          endedAt: timestamp,
          durationSeconds,
          avgPower,
          energyUsed: energyUsed >= 0 ? energyUsed : 0,
        },
      });
    }
  }

  const newEvent = await prisma.usageEvent.create({
    data: {
      state: newState,
      startedAt: timestamp,
    },
  });

  currentEventId = newEvent.id;
  currentEventState = newState;
}

export { maybeRecordReading };

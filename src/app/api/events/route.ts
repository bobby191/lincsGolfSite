// src/app/api/events/route.ts
//By Robert Nelson last edit 04/30/25
//About File:

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const events = await prisma.event.findMany();
  return NextResponse.json(events);
}

export async function POST(req: Request) {
  const {
    name,
    eventType,
    gameType,
    winnerCount,
    pointSplit,
    date,
    time,
  } = await req.json();

  // convert "07:30 AM" → "07:30" or "19:30"
  const [rawTime, meridiem] = time.split(" ");
  let [hh, mm] = rawTime.split(":").map(Number);
  if (meridiem === "PM" && hh < 12) hh += 12;
  if (meridiem === "AM" && hh === 12) hh = 0;
  const isoTimestamp = new Date(`${date}T${hh.toString().padStart(2,"0")}:${mm.toString().padStart(2,"0")}:00Z`);

  const created = await prisma.event.create({
    data: {
      name,
      type: eventType,       // maps to your `type EventType` field
      gameType,
      winnerCount,
      pointSplit,            // only if schema.prisma says `pointSplit Json`
      date: isoTimestamp,
      participants: 0,       // start at zero
    },
  });

  return NextResponse.json(created, { status: 201 });
}
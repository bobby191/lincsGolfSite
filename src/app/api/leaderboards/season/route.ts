//lincs-golf-site\src\app\api\leaderboards\season\route.ts
//By Robert Nelson last edit 04/23/25
//About File:

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  //Aggregate points for users who have participations
  const sums = await prisma.participation.groupBy({
    by: ["userId"],
    _sum: { points: true },
  });

  const sumMap = Object.fromEntries(
    sums.map((s) => [s.userId, s._sum.points ?? 0])
  );

  //Fetch all users
  const users = await prisma.user.findMany({
    select: { id: true, username: true },
  });

  //Get participation counts by type for each user
  const allParticipations = await prisma.participation.findMany({
    include: {
      event: { select: { type: true } },
    },
  });

  const participationMap: Record<number, { desi: number; unofficial: number; major: number }> = {};

  for (const p of allParticipations) {
    const uid = p.userId;
    if (!participationMap[uid]) {
      participationMap[uid] = { desi: 0, unofficial: 0, major: 0 };
    }
    if (p.event.type === "Desi") participationMap[uid].desi++;
    else if (p.event.type === "Unofficial") participationMap[uid].unofficial++;
    else if (p.event.type === "Major") participationMap[uid].major++;
  }

  // 4) Combine and sort
  const leaderboard = users
    .map((u) => {
      const events = participationMap[u.id] || { desi: 0, unofficial: 0, major: 0 };
      return {
        username: u.username!,
        totalPoints: sumMap[u.id] ?? 0,
        participationSummary: `${events.unofficial}:${events.desi}:${events.major}`,
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints);

  return NextResponse.json(leaderboard);
}

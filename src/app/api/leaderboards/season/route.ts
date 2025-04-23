//lincs-golf-site\src\app\api\leaderboards\season\route.ts
//By Robert Nelson last edit 04/23/25
//About File:

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // 1) Aggregate points for users who have participations
  const sums = await prisma.participation.groupBy({
    by: ["userId"],
    _sum: { points: true },
  });

  const sumMap = Object.fromEntries(
    sums.map((s) => [s.userId, s._sum.points ?? 0])
  );

  // 2) Fetch all users
  const users = await prisma.user.findMany({
    select: { id: true, username: true },
  });

  // 3) Combine and sort
  const leaderboard = users
    .map((u) => ({
      username: u.username!,
      totalPoints: sumMap[u.id] ?? 0,
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints);

  return NextResponse.json(leaderboard);
}
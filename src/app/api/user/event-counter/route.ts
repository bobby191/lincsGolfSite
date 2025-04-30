///src/app/api/user/event-counter/route.ts
//By Robert Nelson last edit 04/29/25
//About File:

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url || '');
  const userIdParam = url.searchParams.get('userId');

  if (!userIdParam) {
    return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
  }

  const filterUserId = parseInt(userIdParam);

  const participations = await prisma.participation.findMany({
    where: { userId: filterUserId },
    include: { event: { select: { type: true } } },
  });

  let desi = 0;
  let unofficial = 0;
  let major = 0;

  for (const p of participations) {
    if (p.event.type === 'Desi') desi++;
    else if (p.event.type === 'Unofficial') unofficial++;
    else if (p.event.type === 'Major') major++;
  }

  const user = await prisma.user.findUnique({
    where: { id: filterUserId },
    select: { username: true },
  });

  return NextResponse.json({
    username: user?.username || 'Unknown',
    desiCount: desi,
    unofficialCount: unofficial,
    majorCount: major,
  });
}
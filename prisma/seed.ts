//lincs-golf-site\prisma\seed.ts
//By Robert Nelson last edit 04/30/25
//About File:

import { prisma } from "../src/lib/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  // 0) Wipe existing data (in the right order)
  await prisma.participation.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.major.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // 1) Create two test users
  const [user1, user2] = await Promise.all([
    prisma.user.create({
      data: {
        email: "1@1",
        username: "testuser",
        password: await bcrypt.hash("password123", 10),
        role: "USER",
      },
    }),
    prisma.user.create({
      data: {
        email: "jane@example.com",
        username: "janegolfer",
        password: await bcrypt.hash("secret456", 10),
        role: "USER",
      },
    }),
  ]);

  // 2) Create one Major and one Unofficial event
  const [majorEvent, unofficialEvent] = await Promise.all([
    // ---- Major Event ----
    prisma.event.create({
      data: {
        name: "Spring Major Championship",
        type: "Major",
        gameType: "Stroke Play",
        winnerCount: 8,
        pointSplit: [16, 8, 6, 5, 4, 3, 2, 1],                 // JSON column
        date: new Date("2025-05-01T10:00:00Z"),
        participants: 0,                   // defaults to 0
        majorDetail: {
          create: {
            description: "The big Spring Major points to winner!",
            calendarUrl: "https://calendar.example.com/spring-major",
            pointStructure: {               // JSON column
              "1": 16,
              "2": 8,
              "3": 6,
              "4": 5,
              "5": 4,
              "6": 3,
              "7": 2,
              "8": 1,
            },
          },
        },
      },
    }),

    // ---- Unofficial Event ----
    prisma.event.create({
      data: {
        name: "Weekend Scramble",
        type: "Unofficial",
        gameType: "Scramble (2v2)",
        winnerCount: 2,
        pointSplit: [2, 2],                // totalPoints = 4 for Unofficial
        date: new Date("2025-04-20T09:00:00Z"),
        participants: 4,                   // e.g. four players joined
      },
    }),
  ]);

  // 3) Seed participations (strokes + season points)
  await prisma.participation.createMany({
    data: [
      // Major: user1 & user2
      {
        userId: user1.id,
        eventId: majorEvent.id,
        strokes: 72,
        points: 16,
      },
      {
        userId: user2.id,
        eventId: majorEvent.id,
        strokes: 75,
        points: 8,
      },
      // Unofficial: user1 & user2
      {
        userId: user1.id,
        eventId: unofficialEvent.id,
        strokes: 68,
        points: 2,   // winnerCount=2, split=[2,2] → user1 got 1st place = 2
      },
      {
        userId: user2.id,
        eventId: unofficialEvent.id,
        strokes: 70,
        points: 2,   // second place = 2
      },
    ],
  });

  // 4) Create reciprocal friendships
  await prisma.friendship.createMany({
    data: [
      { userId: user1.id, friendId: user2.id },
      { userId: user2.id, friendId: user1.id },
    ],
  });

  console.log("🌱 Seeding complete.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  });
//lincs-golf-site\prisma\seed.ts
//By Robert Nelson last edit 04/12/25
//About File:

import { prisma } from "../src/lib/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  // 0) Clear existing data
  await prisma.participation.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.major.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // 1) Upsert two test users
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
    prisma.event.create({
      data: {
        name: "Spring Major Championship",
        type: "Major",
        date: new Date("2025-05-01T10:00:00Z"),
        participants: 0, // not used for Majors
        majorDetail: {
          create: {
            description: "The big Spring Major—100 points to winner!",
            calendarUrl: "https://calendar.example.com/spring-major",
            pointStructure: {
              "1": 100,
              "2": 80,
              "3": 70,
            },
          },
        },
      },
    }),
    prisma.event.create({
      data: {
        name: "Weekend Scramble",
        type: "Unofficial",
        date: new Date("2025-04-20T09:00:00Z"),
        participants: 4, // requires 3–4
      },
    }),
  ]);

  // 3) Seed participations (strokes + season points)
  await prisma.participation.createMany({
    data: [
      // User1 at Major
      {
        userId: user1.id,
        eventId: majorEvent.id,
        strokes: 72,
        points: 100,
      },
      {
        userId: user2.id,
        eventId: majorEvent.id,
        strokes: 75,
        points: 80,
      },
      // User1 at Unofficial
      {
        userId: user1.id,
        eventId: unofficialEvent.id,
        strokes: 68,
        points: 0,
      },
      {
        userId: user2.id,
        eventId: unofficialEvent.id,
        strokes: 70,
        points: 0,
      },
    ],
  });

  // 4) Create reciprocal friendships
  await prisma.friendship.create({
    data: { userId: user1.id, friendId: user2.id },
  });
  await prisma.friendship.create({
    data: { userId: user2.id, friendId: user1.id },
  });

  console.log("Seeding complete.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seeding error:", error);
    process.exit(1);
  });
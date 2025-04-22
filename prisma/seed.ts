//lincs-golf-site\prisma\seed.ts
//By Robert Nelson last edit 04/12/25
//About File:

import { prisma } from "../src/lib/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  // Create a test user as an example.
  const plainPassword = "password123";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await prisma.user.create({
    data: {
      email: "test@example.com",
      username: "testuser",
      password: hashedPassword,
      role: "USER",
    },
  });
  // You can add more seed data here, like events, etc.
}

main()
  .then(() => {
    console.log("Seeding complete.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding error:", error);
    process.exit(1);
  });
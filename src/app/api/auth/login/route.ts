//\lincs-golf-site\src\app\api\auth\login\route.ts
//By Robert Nelson last edit 04/12/25
//About File:

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
//import the Prisma client from helper file
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    //parses incoming request to get email and password
    const { email, password } = await req.json();

    //retrieve the user from database using email address
    const user = await prisma.user.findUnique({ where: { email } });
    console.log("Fetched user:", user);//trouble shooting log

    //no user found give 401 Unauthorized response
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    //compare hashed password
    const passwordMatches = await bcrypt.compare(password, user.password);
    //bad match
    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    //user is authenticated, create session
    return NextResponse.json({ message: "Login successful." });
  } catch (error) {
    console.error("Error logging in:", error);
    //return a 500 Internal Server Error
    return NextResponse.json({ error: "Failed to log in." }, { status: 500 });
  }
}
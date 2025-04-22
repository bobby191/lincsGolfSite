//\lincs-golf-site\src\app\api\auth\register\route.ts
//By Robert Nelson last edit 04/12/25
//About File:

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
//import the Prisma client helper from database
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    //extract email, password, and username
    const { email, password, username } = await req.json();

    //validate the input as needed (check for valid email format, password strength, etc.)

    //check if user exists
    const existingUser = await prisma.user.findUnique({where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with that email already exists." },
        { status: 400 }
      );
    }

    //hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    //create a new user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        //add other fields as needed (role, etc.)
      },
    });

    //succes respones
    return NextResponse.json({
      message: "User registered successfully.",
      user,
    });
    //error message
  } catch (error) {
    console.error("Error registering user:", error);
    //returns 500 Internal Server Error response for unexpected errors
    return NextResponse.json(
      { error: "Failed to register user." },
      { status: 500 }
    );
  }
}
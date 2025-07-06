import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { userId } = await auth();

    const { title } = await request.json();

    if (!userId) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    if (!title) {
      return new NextResponse("Title is required", {
        status: 400,
      });
    }

    const job = await db.job.create({
      data: {
        title,
        userId,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(job, {
      status: 201,
    });
  } catch (error) {
    console.log(`[JOB_POST : ${error}]`);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
};

import { NextResponse } from "next/server";

import { registerUser } from "@/action/user.action";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await registerUser({
      name: body?.name ?? "",
      email: body?.email ?? "",
      password: body?.password ?? "",
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

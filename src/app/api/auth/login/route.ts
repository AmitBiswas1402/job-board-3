import { NextResponse } from "next/server";

import { loginUser } from "@/action/user.action";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await loginUser({
      email: body?.email ?? "",
      password: body?.password ?? "",
    });

    return NextResponse.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

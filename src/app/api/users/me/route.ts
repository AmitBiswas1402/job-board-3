import { NextResponse } from "next/server";

import { getCurrentUser, updateCurrentUser } from "@/action/user.action";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const user = await updateCurrentUser({
      name: body?.name,
      email: body?.email,
    });

    return NextResponse.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update profile.";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

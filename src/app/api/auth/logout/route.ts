import { NextResponse } from "next/server";

import { logoutUser } from "@/action/user.action";

export async function POST() {
  await logoutUser();
  return NextResponse.json({ ok: true });
}

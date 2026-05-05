import { NextResponse } from "next/server";

import { updateCurrentUserPassword } from "@/action/user.action";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    await updateCurrentUserPassword({
      currentPassword: body?.currentPassword ?? "",
      newPassword: body?.newPassword ?? "",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update password.";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

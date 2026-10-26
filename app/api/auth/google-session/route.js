
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL || "http://localhost:3000"));
  }

  const email = session.user.email.toLowerCase();

  const result = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (!result.rows.length) {
    return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL || "http://localhost:3000"));
  }

  await createSession(result.rows[0].id);

  return NextResponse.redirect(new URL("/dashboard", process.env.NEXTAUTH_URL || "http://localhost:3000"));
}

import { NextResponse } from "next/server";

// In-memory counter for MVP. Replace with KV/Redis for production.
let openCount = 0;

export async function GET() {
  return NextResponse.json({ count: openCount });
}

export async function POST() {
  openCount += 1;
  return NextResponse.json({ count: openCount });
}

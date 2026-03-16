import { NextResponse } from "next/server";

// In-memory counter for MVP. Replace with KV/Redis for production.
let searchCount = 0;

export async function GET() {
  return NextResponse.json({ count: searchCount });
}

export async function POST() {
  searchCount += 1;
  return NextResponse.json({ count: searchCount });
}

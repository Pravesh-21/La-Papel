import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? process.env.BACKEND_URL;

export async function GET() {
  if (!BACKEND_URL) {
    return NextResponse.json({ error: "BACKEND_URL is not configured" }, { status: 500 });
  }

  const backendUrl = `${BACKEND_URL.replace(/\/+$/, "")}/appointments`;
  const response = await fetch(backendUrl, { cache: "no-store" });
  const payload = await response.text();

  try {
    return NextResponse.json(JSON.parse(payload), { status: response.status });
  } catch {
    return NextResponse.json({ error: payload }, { status: response.status });
  }
}

import { NextResponse } from "next/server";

const BASE = process.env.RAILS_API_URL;

export async function GET() {
  const res = await fetch(`${BASE}/tags`, {
    method: "GET",
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(`${BASE}/tags`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tag: body }),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

import { NextRequest, NextResponse } from "next/server";
import { getStore, resetStore } from "@/lib/store";

export async function GET() {
  const state = getStore();
  return NextResponse.json({ success: true, ...state });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    if (body.action === "reset") {
      const state = resetStore();
      return NextResponse.json({ success: true, message: "Store reset to initial state", ...state });
    }
    const state = getStore();
    return NextResponse.json({ success: true, ...state });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to process state action" }, { status: 500 });
  }
}

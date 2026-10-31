import { NextRequest, NextResponse } from "next/server";
import { getMilestones, updateMilestoneProof } from "@/lib/store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId") || undefined;
  const milestones = getMilestones(projectId);
  return NextResponse.json({ success: true, milestones });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { milestoneId, proofString } = body;

    if (!milestoneId || typeof milestoneId !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid 'milestoneId' in request body" },
        { status: 400 }
      );
    }

    if (!proofString || typeof proofString !== "string" || proofString.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Missing or empty 'proofString' in request body" },
        { status: 400 }
      );
    }

    const result = updateMilestoneProof(milestoneId, proofString.trim());

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Proof submitted successfully. Milestone transitioned to AWAITING_APPROVAL.",
        milestone: result.milestone,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Malformed request payload" },
      { status: 500 }
    );
  }
}

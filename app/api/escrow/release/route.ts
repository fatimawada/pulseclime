import { NextRequest, NextResponse } from "next/server";
import { getMilestone, releaseMilestoneFunds } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, milestoneId, vendorId } = body;

    // Strict parameter validation
    if (!projectId || !milestoneId || !vendorId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameters: 'projectId', 'milestoneId', and 'vendorId' are all required.",
        },
        { status: 400 }
      );
    }

    // Step 1: Pre-validate milestone exists and is strictly AWAITING_APPROVAL
    const milestone = getMilestone(milestoneId);
    if (!milestone) {
      return NextResponse.json(
        { success: false, error: `Milestone ${milestoneId} does not exist.` },
        { status: 404 }
      );
    }

    if (milestone.status !== "AWAITING_APPROVAL") {
      return NextResponse.json(
        {
          success: false,
          error: `Escrow release rejected: milestone status must be strictly 'AWAITING_APPROVAL', but was '${milestone.status}'.`,
        },
        { status: 400 }
      );
    }

    // Step 2: Simulate 1500ms network latency to Anchor Banking-as-a-Service (BaaS) provider
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Step 3: Execute atomic financial ledger transaction
    const txId = `anch_tx_${Math.floor(100000000 + Math.random() * 900000000)}`;
    const result = releaseMilestoneFunds(projectId, milestoneId, vendorId, txId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // Step 4: Return mock Anchor BaaS settlement payload
    return NextResponse.json(
      {
        success: true,
        anchor_transaction_id: result.anchor_transaction_id || "anch_tx_987654321",
        status: "SETTLED",
        disbursed_amount: result.disbursed_amount,
        currency: result.currency || "NGN",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error processing escrow release." },
      { status: 500 }
    );
  }
}

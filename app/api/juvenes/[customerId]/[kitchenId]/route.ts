import { NextRequest, NextResponse } from "next/server";
import { JamixResponse } from "@/app/types/juvenes";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string; kitchenId: string }> }
) {
  const { customerId, kitchenId } = await params;

  if (!customerId || !kitchenId) {
    return NextResponse.json(
      { error: "Customer ID and Kitchen ID are required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://fi.jamix.cloud/apps/menuservice/rest/haku/menu/${customerId}/${kitchenId}?lang=en&type=json`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`JAMIX API returned ${response.status}`);
    }

    const data: JamixResponse = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Juvenes menu:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu data from Juvenes" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { SodexoWeeklyMenu } from "@/app/types/sodexo";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ restaurantId: string }> }
) {
  const { restaurantId } = await params;

  if (!restaurantId) {
    return NextResponse.json(
      { error: "Restaurant ID is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://www.sodexo.fi/en/ruokalistat/output/weekly_json/${restaurantId}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`Sodexo API returned ${response.status}`);
    }

    const data: SodexoWeeklyMenu = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu data" },
      { status: 500 }
    );
  }
}

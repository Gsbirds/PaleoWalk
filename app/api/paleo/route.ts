import { NextRequest, NextResponse } from "next/server";
import { generatePaleoReport } from "@/lib/paleo";
import type { PaleoRequest } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<PaleoRequest>;

    const lat = Number(body.lat);
    const lon = Number(body.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return NextResponse.json(
        { error: "Valid lat and lon are required." },
        { status: 400 }
      );
    }
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return NextResponse.json(
        { error: "Coordinates out of range." },
        { status: 400 }
      );
    }

    const report = await generatePaleoReport({
      lat,
      lon,
      placeLabel: typeof body.placeLabel === "string" ? body.placeLabel : undefined,
    });

    return NextResponse.json(report);
  } catch (err) {
    console.error("paleo route error:", err);
    return NextResponse.json(
      { error: "Failed to generate report. Check server logs." },
      { status: 500 }
    );
  }
}

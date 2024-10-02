import { supabase } from "@/utils/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("metrics")
      .select("name", { count: "exact", head: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const distinctNames = Array.from(
      new Set(data.map((metric: { name: string }) => metric.name))
    );

    return NextResponse.json(distinctNames, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error fetching data: ${error}` },
      { status: 500 }
    );
  }
}

import { supabase } from "@/utils/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const name = searchParams.get("name");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const minValue = searchParams.get("minValue");
    const maxValue = searchParams.get("maxValue");

    let query = supabase.from("metrics").select("*");

    if (name) {
      query = query.eq("name", name);
    }

    if (from && to) {
      query = query.gte("created_at", from).lte("created_at", to);
    } else if (from) {
      query = query.gte("created_at", from);
    } else if (to) {
      query = query.lte("created_at", to);
    }

    if (minValue) {
      query = query.gte("value", minValue);
    }
    if (maxValue) {
      query = query.lte("value", maxValue);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error fetching data ${error}` },
      { status: 500 }
    );
  }
}

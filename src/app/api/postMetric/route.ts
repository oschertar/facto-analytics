import { supabase } from "@/utils/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { created_at, name, value, props, account } = body;
    if (!created_at || !name || !value || !account) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("metrics")
      .insert([{ created_at, name, value, props, account }])
      .select()
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Metric added successfully", data },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Error processing request ${error}` },
      { status: 500 }
    );
  }
}

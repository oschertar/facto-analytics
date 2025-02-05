import { supabase } from "@/utils/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("showAll");
    let query = supabase.from("accounts").select("*");

    if (!showAll) {
      query = query.eq("enabled", true);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Config account found successfully", data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Error processing request ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name } = body;
    if (!name) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("accounts")
      .insert([{ name, enabled: true }])
      .select()
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Config account added successfully", data: data[0] },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Error processing request ${error}` },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const { id, enabled } = body;

    if (!id) {
      return NextResponse.json({ error: "Id required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("accounts")
      .update({ enabled: enabled })
      .match({ id: id })
      .select()
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Config account updated successfully", data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Error processing request ${error}` },
      { status: 500 }
    );
  }
}

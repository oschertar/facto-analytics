import { formatDate } from "@/app/utils/utils";
import { supabase } from "@/utils/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const name = searchParams.get("name");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

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
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      query = query.gte("created_at", yesterday.toISOString());
    }

    const { data, error } = await query;

    let maxValue = 0;
    let minValue = 0;
    let dateMaxValue = null;
    let dateMinValue = null;
    let totalValue = 0;
    let averageValue = 0;

    if (data && data?.length > 0) {
      minValue = Math.min(...data?.map((metric) => metric.value));
      maxValue = Math.max(...data?.map((metric) => metric.value));
      dateMaxValue = formatDate(
        data.find((metric) => metric.value === maxValue)?.created_at
      );
      dateMinValue = formatDate(
        data.find((metric) => metric.value === minValue)?.created_at
      );
      totalValue = data.reduce((acc, metric) => acc + metric.value, 0);
      averageValue = totalValue / data?.length;
    }

    const response = {
      results: data,
      statistics: {
        max: { value: maxValue, date: dateMaxValue },
        min: { value: minValue, date: dateMinValue },
        average: averageValue?.toFixed(2),
        total: totalValue,
        name: name,
      },
    };

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error fetching data ${error}` },
      { status: 500 }
    );
  }
}

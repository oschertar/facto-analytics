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
      const names = name.split(",");
      query = query.in("name", names);
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

    const dataResponse: {
      created_at: string;
      [key: string]: string | number;
    }[] = [];

    const maxValue = 0;
    const minValue = 0;
    const dateMaxValue = null;
    const dateMinValue = null;
    const totalValue = 0;
    const averageValue = 0;

    // minValue = Math.min(...data?.map((metric) => metric.value));
    // maxValue = Math.max(...data?.map((metric) => metric.value));
    // dateMaxValue = formatDate(
    //   data.find((metric) => metric.value === maxValue)?.created_at
    // );
    // dateMinValue = formatDate(
    //   data.find((metric) => metric.value === minValue)?.created_at
    // );
    // totalValue = data.reduce((acc, metric) => acc + metric.value, 0);
    // averageValue = totalValue / data?.length;

    if (data && data?.length > 0) {
      data.forEach((metric) => {
        const dateInstance = dataResponse.find(
          (item) => item.created_at === metric.created_at
        );
        if (dateInstance) {
          dateInstance[metric.name] = metric.value;
        } else {
          dataResponse.push({
            created_at: metric.created_at,
            [metric.name]: metric.value,
          });
        }
      });
    }

    const response = {
      results: dataResponse,
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

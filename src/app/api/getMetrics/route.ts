import { DataResponseItem } from "@/app/types/Metric";
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

    const dataResponse: DataResponseItem[] = [];

    let maxValue = 0;
    let minValue = Infinity;
    let maxObject: DataResponseItem = { created_at: "" };
    let minObject: DataResponseItem = { created_at: "" };

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

    const keys = Object.keys(dataResponse[0]);
    keys.forEach((key) => {
      const values = dataResponse.map((item) => item[key]);
      if (Math.min(...values) < minValue) {
        minValue = Math.min(...values);
        minObject = dataResponse.find((item) => item[key] === minValue);
      }
      if (Math.max(...values) > maxValue) {
        maxValue = Math.max(...values);
        maxObject = dataResponse.find((item) => item[key] === maxValue);
      }
    });

    const response = {
      results: dataResponse,
      statistics: {
        max: {
          value: maxValue,
          date: formatDate(maxObject?.created_at),
          name: Object.keys(maxObject).find(
            (key) => maxObject[key] === maxValue
          ),
        },
        min: {
          value: minValue,
          date: formatDate(minObject?.created_at),
          name: Object.keys(minObject).find(
            (key) => minObject[key] === minValue
          ),
        },
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

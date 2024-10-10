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
    const account = searchParams.get("account");

    if (!account) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    let query = supabase.from("metrics").select("*");

    if (name) {
      const names = name.split(",");
      query = query.in("name", names);
    }

    if (account) {
      query = query.eq("account", account);
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

    const keys = Object.keys(dataResponse[0]).filter(
      (key) => key !== "created_at"
    );
    keys.forEach((key) => {
      const values = dataResponse.map((item) => item[key]);
      const numericValues = values.filter(
        (value): value is number => typeof value === "number"
      );

      if (numericValues.length > 0) {
        const minValueForKey = Math.min(...numericValues);
        const maxValueForKey = Math.max(...numericValues);

        if (minValueForKey < minValue) {
          minValue = minValueForKey;
          const foundMinObject = dataResponse.find(
            (item) => item[key] === minValue
          );
          if (foundMinObject) {
            minObject = foundMinObject;
          }
        }

        if (maxValueForKey > maxValue) {
          maxValue = maxValueForKey;
          const foundMaxObject = dataResponse.find(
            (item) => item[key] === maxValue
          );
          if (foundMaxObject) {
            maxObject = foundMaxObject;
          }
        }
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
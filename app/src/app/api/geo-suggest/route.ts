import { NextRequest, NextResponse } from "next/server";
import { envConfig } from "@/shared/lib/config";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("text");

    if (!query || query.length < 3) {
      return NextResponse.json(
        { error: "Query too short" },
        { status: 400 }
      );
    }

    const yandexParams = new URLSearchParams({
      text: query,
      lang: "ru_RU",
      results: searchParams.get("results") || "5",
    });

    if (envConfig.GEOSUGGEST_API_KEY) {
      yandexParams.append("apikey", envConfig.GEOSUGGEST_API_KEY);
    }

    const types = searchParams.get("types");
    if (types) {
      yandexParams.append("types", types);
    }

    console.log("Proxying request to Yandex API:", yandexParams.toString());

    const yandexUrl = `https://suggest-maps.yandex.ru/v1/suggest?${yandexParams.toString()}`;
    const response = await fetch(yandexUrl);

    if (!response.ok) {
      console.error("Yandex API error:", response.status, response.statusText);
      return NextResponse.json(
        { error: `Yandex API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Yandex API response:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Geo suggest API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
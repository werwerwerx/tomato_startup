import { NextRequest, NextResponse } from "next/server";
import { envConfig } from "@/shared/lib/config";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json(
        { error: "Coordinates (lat, lon) are required" },
        { status: 400 }
      );
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: "Invalid coordinates format" },
        { status: 400 }
      );
    }

    try {
      const yandexParams = new URLSearchParams({
        geocode: `${longitude},${latitude}`,
        format: "json",
        lang: "ru_RU",
        results: "1",
        kind: "house",
      });

      if (envConfig.GEOSUGGEST_API_KEY) {
        yandexParams.append("apikey", envConfig.GEOSUGGEST_API_KEY);
      }

      const yandexUrl = `https://geocode-maps.yandex.ru/1.x/?${yandexParams.toString()}`;
      const response = await fetch(yandexUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; TomatoApp/1.0)',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const featureMember = data?.response?.GeoObjectCollection?.featureMember?.[0];
        
        if (featureMember) {
          const geoObject = featureMember.GeoObject;
          const address = geoObject?.metaDataProperty?.GeocoderMetaData?.text || 
                         geoObject?.name || 
                         await getFallbackAddress(latitude, longitude);

          return NextResponse.json({
            address,
            coordinates: { latitude, longitude },
            formatted: geoObject?.metaDataProperty?.GeocoderMetaData?.Address?.formatted || address,
            source: "yandex",
          });
        }
      }
    } catch (yandexError) {
      console.warn("Yandex API failed, using fallback:", yandexError);
    }

    const fallbackAddress = await getFallbackAddress(latitude, longitude);
    
    return NextResponse.json({
      address: fallbackAddress,
      coordinates: { latitude, longitude },
      formatted: fallbackAddress,
      source: "fallback",
    });

  } catch (error) {
    console.error("Geo reverse API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getFallbackAddress(latitude: number, longitude: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=ru`,
      {
        headers: {
          'User-Agent': 'TomatoApp/1.0 (contact@example.com)',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.display_name) {
        return data.display_name;
      }
    }
  } catch (error) {
    console.warn("OpenStreetMap fallback failed:", error);
  }

  return `Координаты: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
} 
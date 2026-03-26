import { externalApi } from "@/services/axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data } = await externalApi.get("/GetInnerInternationalData");
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "تعذر جلب بيانات السلع العالمية." },
      { status: 500 },
    );
  }
}

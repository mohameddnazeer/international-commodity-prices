import { externalApi } from "@/services/axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data } = await externalApi.get("/GetGeneralIndicatorAllData/18");
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "تعذر جلب بيانات الحديد والأسمنت." },
      { status: 500 },
    );
  }
}

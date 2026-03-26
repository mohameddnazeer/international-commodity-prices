import { externalApi } from "@/services/axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data } = await externalApi.get("/GetGeneralIndicatorAllData/19");
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "تعذر جلب بيانات الأسمدة." },
      { status: 500 },
    );
  }
}

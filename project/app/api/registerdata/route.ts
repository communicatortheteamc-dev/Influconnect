import { getDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    /* ✅ EXISTING VALIDATION */
    if (!data.pageName?.trim()) {
      return NextResponse.json(
        { error: "Page Name is required" },
        { status: 400 }
      );
    }

    /* ✅ NEW CATEGORY VALIDATION */
    if (!data.category?.trim()) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Always insert into 'registerdata' collection
    const collection = db.collection("registerdata");

    const result = await collection.insertOne({
      ...data,               // ✅ category stored automatically
      pageName: data.pageName.trim(),
      category: data.category.trim(),
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      message: "Data saved successfully in registerdata",
    });
  } catch (err: any) {
    console.error("❌ Error saving data:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import clientPromise, { getDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
   
   
       const db = await getDatabase();

    await db.collection("bookings").insertOne({
      ...body,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save booking" },
      { status: 500 }
    );
  }
}

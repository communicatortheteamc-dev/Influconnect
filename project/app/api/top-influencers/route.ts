import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise; // connect once
    const db = client.db("influconnect");
    const influencers = await db
      .collection("topinfluencers")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(influencers);
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

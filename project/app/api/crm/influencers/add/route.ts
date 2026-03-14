import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {

  const body = await req.json()

  const db = await getDatabase()

  const result = await db.collection("crm_influencers").insertOne({
    influencer_id: body.influencer_id,
    assigned_staff: body.staff_id,
    status: "new",
    createdAt: new Date()
  })

  return NextResponse.json({ success: true })
}
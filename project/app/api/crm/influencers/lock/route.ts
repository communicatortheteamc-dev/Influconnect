import clientPromise, { getDatabase, getRawDataDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {

  const { influencerId, staffId } = await req.json()

  const client = await clientPromise
  const db = await getDatabase()

  // 1️⃣ check if already taken
  const existing = await db.collection("quick_followups").findOne({
    influencer_id: new ObjectId(influencerId),
    status: "active"
  })

  if (existing) {
    return Response.json({ message: "Already taken" }, { status: 400 })
  }

  // 2️⃣ insert followup
  await db.collection("quick_followups").insertOne({
    influencer_id: new ObjectId(influencerId),
    staff_id: staffId,
    status: "active",
    created_at: new Date()
  })

  return Response.json({ success: true })
}
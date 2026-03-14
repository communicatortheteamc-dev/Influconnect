import clientPromise, { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  try {
    const { id, staff } = await req.json()

    const client = await clientPromise
    const db = await getDatabase()
    const collection = db.collection("crm_campaign_influencers")

    const oldRow = await collection.findOne({
      _id: new ObjectId(id)
    })
const profile = await db.collection("full_profiles").findOne({
  _id: oldRow?.influencerId
})
 
    if (!oldRow) {
      return Response.json(
        { message: "Original row not found" },
        { status: 404 }
      )
    }

    if (!oldRow.replacedByInfluencerId) {
      return Response.json(
        { message: "No replacement found for this row" },
        { status: 400 }
      )
    }

    // remove replacement row
    await collection.deleteOne({
      campaignId: oldRow.campaignId,
      influencerId: oldRow.replacedByInfluencerId,
      replacedFromInfluencerId: oldRow.influencerId
    })

    // restore old row
    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isReplaced: false,
          status: "",
          doingOrDrop: "",
          updatedAt: new Date()
        },
        $unset: {
          replacedByInfluencerId: "",
          replacedAt: "",
          replacedByStaff: ""
        }
      }
    )
await db.collection("crm_campaign_activity_logs").insertOne({
  campaignId: oldRow.campaignId,
  campaignRowId: oldRow._id,
  influencerId: oldRow.influencerId,
  action: "restore",
  field: "campaignRow",
  oldValue: "replaced",
  influencerName: profile?.influencerName || "Unknown",
  newValue: "active",
  staff: staff || null,
  createdAt: new Date()
})
    return Response.json({ success: true })
  } catch (error) {
    return Response.json(
      { message: "Failed to restore influencer" },
      { status: 500 }
    )
  }
}
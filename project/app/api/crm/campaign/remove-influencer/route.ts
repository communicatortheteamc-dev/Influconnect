import clientPromise, { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  try {
    const { id, staff } = await req.json()

    const db = await getDatabase()
    const collection = db.collection("crm_campaign_influencers")
    const logsCollection = db.collection("crm_campaign_replacement_logs")

    const row = await collection.findOne({
      _id: new ObjectId(id)
    })
const profile = await db.collection("full_profiles").findOne({
  _id: row?.influencerId
})
    if (!row) {
      return Response.json(
        { message: "Row not found" },
        { status: 404 }
      )
    }
await db.collection("crm_campaign_activity_logs").insertOne({
  campaignId: row.campaignId,
  campaignRowId: row._id,
  influencerId: row.influencerId,
  action: "remove",
  field: "campaignRow",
  oldValue: "active",
  newValue: "removed",
  influencerName: profile?.influencerName || "Unknown",

  staff: staff || null,
  createdAt: new Date()
})
    // CASE 1:
    // deleting NEW replacement row
    // delete new row + its paired old replaced row
    if (row.isReplacementEntry) {
      await collection.deleteOne({
        _id: row._id
      })

      if (row.replacedFromInfluencerId) {
        await collection.deleteOne({
          campaignId: row.campaignId,
          influencerId: row.replacedFromInfluencerId,
          replacedByInfluencerId: row.influencerId
        })
      }

      await logsCollection.deleteMany({
        campaignId: row.campaignId,
        $or: [
          { toInfluencerId: row.influencerId },
          { fromInfluencerId: row.replacedFromInfluencerId }
        ]
      })

      return Response.json({ success: true })
    }

    // CASE 2:
    // deleting OLD replaced row
    // delete ONLY old row, keep new row
    await collection.deleteOne({
      _id: row._id
    })

    await logsCollection.deleteMany({
      campaignId: row.campaignId,
      fromInfluencerId: row.influencerId
    })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json(
      { message: "Failed to remove influencer" },
      { status: 500 }
    )
  }
}
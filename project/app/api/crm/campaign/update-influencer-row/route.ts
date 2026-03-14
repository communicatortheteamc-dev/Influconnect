import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, staff, ...updateData } = body

    const client = await clientPromise
    const db = client.db("influconnect")

    const collection = db.collection("crm_campaign_influencers")
    const logs = db.collection("crm_campaign_activity_logs")

   const oldRow = await collection.findOne({
  _id: new ObjectId(id)
})
 
const profile = await db.collection("full_profiles").findOne({
  _id: oldRow?.influencerId
})

    if (!oldRow) {
      return Response.json({ message: "Row not found" }, { status: 404 })
    }

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    )

    const activityLogs: any[] = []

    Object.keys(updateData).forEach((field) => {
      const oldValue = oldRow[field] ?? ""
      const newValue = updateData[field] ?? ""

      if (String(oldValue) !== String(newValue)) {
        activityLogs.push({
          campaignId: oldRow.campaignId,
          campaignRowId: oldRow._id,
          influencerId: oldRow.influencerId,
          action: "edit",
          field,
          oldValue,
          newValue,
          influencerName: profile?.influencerName || "Unknown",
          staff: staff || null,
          createdAt: new Date()
        })
      }
    })

    if (activityLogs.length > 0) {
      await logs.insertMany(activityLogs)
    }

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ message: "Failed to update row" }, { status: 500 })
  }
}
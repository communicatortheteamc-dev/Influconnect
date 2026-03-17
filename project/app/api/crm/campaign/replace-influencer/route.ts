import clientPromise, { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { campaignRowId, newInfluencerId, staff } = await req.json()

    if (!campaignRowId || !newInfluencerId) {
      return Response.json(
        { message: "campaignRowId and newInfluencerId are required" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = await getDatabase()

    const campaignCollection = db.collection("crm_campaign_influencers")
    const logsCollection = db.collection("crm_campaign_replacement_logs")
    const activityLogsCollection = db.collection("crm_campaign_activity_logs")
    const profilesCollection = db.collection("full_profiles")

    const existingRow = await campaignCollection.findOne({
      _id: new ObjectId(campaignRowId)
    })

    if (!existingRow) {
      return Response.json(
        { message: "Original campaign row not found" },
        { status: 404 }
      )
    }

    const oldProfile = existingRow?.influencerId
      ? await profilesCollection.findOne({
          _id:
            typeof existingRow.influencerId === "string"
              ? new ObjectId(existingRow.influencerId)
              : existingRow.influencerId
        })
      : null

    const newProfile = await profilesCollection.findOne({
      _id: new ObjectId(newInfluencerId)
    })

    if (!newProfile) {
      return Response.json(
        { message: "New influencer profile not found" },
        { status: 404 }
      )
    }

    const duplicate = await campaignCollection.findOne({
      campaignId: existingRow.campaignId,
      influencerId: new ObjectId(newInfluencerId),
      isReplaced: { $ne: true }
    })

    if (duplicate) {
      return Response.json(
        { message: "This influencer is already in the same campaign" },
        { status: 400 }
      )
    }

    const now = new Date()

    await campaignCollection.updateOne(
      { _id: new ObjectId(campaignRowId) },
      {
        $set: {
          isReplaced: true,
          status: "replaced",
          doingOrDrop: "drop",
          replacedByInfluencerId: new ObjectId(newInfluencerId),
          replacedAt: now,
          replacedByStaff: staff || null,
          updatedAt: now
        }
      }
    )

    const insertResult = await campaignCollection.insertOne({
      campaignId: existingRow.campaignId,
      influencerId: new ObjectId(newInfluencerId),
      addedBy: staff || null,
      addedAt: now,
      updatedAt: now,

      city: "",
      contactNumber: "",
      status: "",
      doingOrDrop: "",
      pageLink: "",
      rating: "",
      activityLink: "",
      quotedBudget: "",
      influBudget: "",
      budget: "",
      clientPercent: "",
      paymentStatus: "",
      dateOfPayment: "",
      amountPaid: "",
      reach: "",
      likes: "",
      shares: "",
      remarks: "",

      isReplaced: false,
      isReplacementEntry: true,
      replacedFromInfluencerId: existingRow.influencerId || null,
      replacedByInfluencerId: null,
      replacedAt: null,
      replacedByStaff: null
    })

    await activityLogsCollection.insertMany([
      {
        campaignId: existingRow.campaignId,
        campaignRowId: existingRow._id,
        influencerId: existingRow.influencerId || null,
        action: "replace",
        field: "influencer",
        oldValue: oldProfile?.influencerName || existingRow.influencerId || "Unknown",
        newValue: newProfile?.influencerName || newInfluencerId,
        influencerName: oldProfile?.influencerName || "Unknown",
        staff: staff || null,
        createdAt: now
      },
      {
        campaignId: existingRow.campaignId,
        campaignRowId: insertResult.insertedId,
        influencerId: new ObjectId(newInfluencerId),
        action: "add",
        field: "campaignRow",
        oldValue: "",
        newValue: "Added as replacement influencer",
        influencerName: newProfile?.influencerName || "Unknown",
        staff: staff || null,
        createdAt: now
      }
    ])

    await logsCollection.insertOne({
      campaignId: existingRow.campaignId,
      fromCampaignRowId: existingRow._id,
      toCampaignRowId: insertResult.insertedId,
      fromInfluencerId: existingRow.influencerId || null,
      toInfluencerId: new ObjectId(newInfluencerId),
      staff: staff || null,
      replacedAt: now
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error("replace-influencer error:", error)
    return Response.json(
      { message: "Failed to replace influencer" },
      { status: 500 }
    )
  }
}
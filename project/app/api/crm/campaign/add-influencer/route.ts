import clientPromise, { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(req: Request) {
  try {
    const { campaignId, influencerId, staff } = await req.json()

    const db = await getDatabase()

    const existing = await db.collection("crm_campaign_influencers").findOne({
      campaignId: new ObjectId(campaignId),
      influencerId: new ObjectId(influencerId)
    })

    if (existing) {
      return Response.json(
        { message: "Influencer already added to this campaign" },
        { status: 400 }
      )
    }

    const insert = await db.collection("crm_campaign_influencers").insertOne({
      campaignId: new ObjectId(campaignId),
      influencerId: new ObjectId(influencerId),
      addedBy: staff || null,
      addedAt: new Date(),
      updatedAt: new Date(),

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
      paymentStatus: "",
      dateOfPayment: "",
      clientPercent: "",
      amountPaid: "",
      reach: "",
      likes: "",
      shares: "",
      remarks: "",

      isReplaced: false,
      isReplacementEntry: false,
      replacedFromInfluencerId: null,
      replacedByInfluencerId: null,
      replacedAt: null,
      replacedByStaff: null
    })

    await db.collection("crm_campaign_activity_logs").insertOne({
      campaignId: new ObjectId(campaignId),
      campaignRowId: insert.insertedId,
      influencerId: new ObjectId(influencerId),
      action: "add",
      field: null,
      oldValue: null,
      newValue: "added to campaign",
      staff: staff || null,
      createdAt: new Date()
    })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ message: "Failed to add influencer" }, { status: 500 })
  }
}
import clientPromise, { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(req: Request) {
    try {
        const { campaignRowId, newInfluencerId, staff } = await req.json()

        const client = await clientPromise
        const db = await getDatabase()
        const campaignCollection = db.collection("crm_campaign_influencers")
        const logsCollection = db.collection("crm_campaign_replacement_logs")

        const existingRow = await campaignCollection.findOne({
            _id: new ObjectId(campaignRowId)
        })
const profile = await db.collection("full_profiles").findOne({
  _id: existingRow?.influencerId
})
        if (!existingRow) {
            return Response.json(
                { message: "Original campaign row not found" },
                { status: 404 }
            )
        }

        const duplicate = await campaignCollection.findOne({
            campaignId: existingRow.campaignId,
            influencerId: new ObjectId(newInfluencerId)
        })

        if (duplicate) {
            return Response.json(
                { message: "This influencer is already in the same campaign" },
                { status: 400 }
            )
        }

        await campaignCollection.updateOne(
            { _id: new ObjectId(campaignRowId) },
            {
                $set: {
                    isReplaced: true,
                    status: "replaced",
                    doingOrDrop: "drop",
                    replacedByInfluencerId: new ObjectId(newInfluencerId),
                    replacedAt: new Date(),
                    replacedByStaff: staff || null,
                    updatedAt: new Date()
                }
            }
        )

        const insertResult = await campaignCollection.insertOne({
            campaignId: existingRow.campaignId,
            influencerId: new ObjectId(newInfluencerId),
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
            replacedFromInfluencerId: existingRow.influencerId,
            replacedByInfluencerId: null,
            replacedAt: null,
            replacedByStaff: null
        })
        await db.collection("crm_campaign_activity_logs").insertOne({
            campaignId: existingRow.campaignId,
            campaignRowId: existingRow._id,
            influencerId: existingRow.influencerId,
            action: "replace",
            field: "influencer",
            oldValue: existingRow.influencerId, 
            influencerName: profile?.influencerName || "Unknown",

            newValue: newInfluencerId,
            staff: staff || null,
            createdAt: new Date()
        })
        await logsCollection.insertOne({
            campaignId: existingRow.campaignId,
            fromCampaignRowId: existingRow._id,
            toCampaignRowId: insertResult.insertedId,
            fromInfluencerId: existingRow.influencerId,
            toInfluencerId: new ObjectId(newInfluencerId),
            staff: staff || null,
            replacedAt: new Date()
        })

        return Response.json({ success: true })
    } catch (error) {
        return Response.json(
            { message: "Failed to replace influencer" },
            { status: 500 }
        )
    }
}
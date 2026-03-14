import clientPromise, { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = await getDatabase()  

    const campaignId = new ObjectId(params.id)

    const rows = await db
      .collection("crm_campaign_influencers")
      .aggregate([
        {
          $match: {
            campaignId
          }
        },
        {
          $lookup: {
            from: "full_profiles",
            localField: "influencerId",
            foreignField: "_id",
            as: "profile"
          }
        },
        {
          $unwind: {
            path: "$profile",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "full_profiles",
            localField: "replacedFromInfluencerId",
            foreignField: "_id",
            as: "replacedFromProfile"
          }
        },
        {
          $unwind: {
            path: "$replacedFromProfile",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "full_profiles",
            localField: "replacedByInfluencerId",
            foreignField: "_id",
            as: "replacedByProfile"
          }
        },
        {
          $unwind: {
            path: "$replacedByProfile",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "crm_campaign_replacement_logs",
            localField: "campaignId",
            foreignField: "campaignId",
            as: "replacementLogs"
          }
        },
        {
          $sort: {
            addedAt: 1
          }
        }
      ])
      .toArray()

    return Response.json(rows)
  } catch (error) {
    return Response.json(
      { message: "Failed to load campaign influencers" },
      { status: 500 }
    )
  }
}
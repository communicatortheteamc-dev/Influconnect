import clientPromise, { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

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
            as: "lookupProfile"
          }
        },
        {
          $unwind: {
            path: "$lookupProfile",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            profile: {
              $ifNull: [
                "$lookupProfile",
                {
                  $ifNull: [
                    "$profile",
                    {
                      _id: null,
                      userId: "",
                      userName: "",
                      userUniqueId: "",
                      influencerName: "",
                      instagram_follwers: "",
                      influencerImage: null,
                      category: [],
                      languages: [],
                      location: "",
                      platforms: [
                        {
                          name: "instagram",
                          profileName: "",
                          followers: "",
                          profileLink: ""
                        },
                        {
                          name: "youtube",
                          profileName: "",
                          followers: "",
                          profileLink: ""
                        },
                        {
                          name: "facebook",
                          profileName: "",
                          followers: "",
                          profileLink: ""
                        },
                        {
                          name: "twitter",
                          profileName: "",
                          followers: "",
                          profileLink: ""
                        },
                        {
                          name: "snapchat",
                          profileName: "",
                          followers: "",
                          profileLink: ""
                        },
                        {
                          name: "threads",
                          profileName: "",
                          followers: "",
                          profileLink: ""
                        }
                      ],
                      status: "",
                      createdAt: null,
                      phone: "",
                      email: "",
                      budget: "",
                      negotiableBudget: "",
                      originalId: "",
                      verifiedAt: null
                    }
                  ]
                }
              ]
            }
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
            let: {
              rowInfluencerId: "$influencerId",
              rowCampaignId: "$campaignId"
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$campaignId", "$$rowCampaignId"] },
                      {
                        $or: [
                          { $eq: ["$fromInfluencerId", "$$rowInfluencerId"] },
                          { $eq: ["$toInfluencerId", "$$rowInfluencerId"] }
                        ]
                      }
                    ]
                  }
                }
              },
              {
                $sort: {
                  replacedAt: 1
                }
              }
            ],
            as: "replacementLogs"
          }
        },
        {
          $addFields: {
            replacementLogs: { $ifNull: ["$replacementLogs", []] },
            sortDate: { $ifNull: ["$addedAt", "$createdAt"] }
          }
        },
        {
          $project: {
            lookupProfile: 0
          }
        },
        {
          $sort: {
            sortDate: 1
          }
        }
      ])
      .toArray()

    return Response.json(rows)
  } catch (error) {
    console.error("GET campaign influencers error:", error)
    return Response.json(
      { message: "Failed to load campaign influencers" },
      { status: 500 }
    )
  }
}
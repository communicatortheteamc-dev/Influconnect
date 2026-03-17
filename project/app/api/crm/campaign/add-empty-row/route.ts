import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { campaignId, staff } = body

        if (!campaignId) {
            return Response.json(
                { message: "campaignId is required" },
                { status: 400 }
            )
        }

        const db = await getDatabase()

        const now = new Date()

        const emptyRow = {
            campaignId: new ObjectId(campaignId),
            influencerId: null,
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
            replacedByStaff: null,

            profile: {
                _id: null,
                userId: "",
                userName: "",
                userUniqueId: "",
                influencerName: "",
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
                createdAt: now,
                phone: "",
                email: "",
                budget: "",
                negotiableBudget: "",
                originalId: "",
                verifiedAt: null
            },

            replacementLogs: [],
            sortDate: now
        }

        const result = await db
            .collection("crm_campaign_influencers")
            .insertOne(emptyRow)

        await db.collection("crm_campaign_activity_logs").insertOne({
            campaignId: new ObjectId(campaignId),
            campaignRowId: result.insertedId,
            influencerId: null,
            action: "add",
            field: "campaignRow",
            oldValue: "",
            newValue: "Manual empty row added",
            influencerName: "Manual Entry",
            staff: staff || null,
            createdAt: now
        })

        return Response.json({
            success: true,
            insertedId: result.insertedId
        })
    } catch (error) {
        console.error("add-empty-row error:", error)
        return Response.json(
            { message: "Failed to add empty row" },
            { status: 500 }
        )
    }
}
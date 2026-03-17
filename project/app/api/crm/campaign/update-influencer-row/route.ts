// import clientPromise, { getDatabase } from "@/lib/mongodb"
// import { ObjectId } from "mongodb"

// export const dynamic = "force-dynamic"

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()
//     const { id, staff, ...updateData } = body

//     if (!id) {
//       return Response.json({ message: "Row id is required" }, { status: 400 })
//     }

//     const client = await clientPromise
//     const db = await getDatabase()

//     const collection = db.collection("crm_campaign_influencers")
//     const logs = db.collection("crm_campaign_activity_logs")

//     const oldRow = await collection.findOne({
//       _id: new ObjectId(id),
//     })

//     if (!oldRow) {
//       return Response.json({ message: "Row not found" }, { status: 404 })
//     }

//     let profile: any = null

//     if (oldRow?.influencerId) {
//       profile = await db.collection("full_profiles").findOne({
//         _id:
//           typeof oldRow.influencerId === "string"
//             ? new ObjectId(oldRow.influencerId)
//             : oldRow.influencerId,
//       })
//     }

//     const cleanedUpdateData: Record<string, any> = {
//       influencerName: updateData.influencerName ?? oldRow.influencerName ?? "",
//       city: updateData.city ?? "",
//       contactNumber: updateData.contactNumber ?? "",
//       status: updateData.status ?? "",
//       doingOrDrop: updateData.doingOrDrop ?? "",
//       pageLink: updateData.pageLink ?? "",
//       rating: updateData.rating ?? "",
//       activityLink: updateData.activityLink ?? "",
//       quotedBudget: updateData.quotedBudget ?? "",
//       clientPercent: updateData.clientPercent ?? "",
//       influBudget: updateData.influBudget ?? "",
//       budget: updateData.budget ?? "",
//       paymentStatus: updateData.paymentStatus ?? "",
//       dateOfPayment: updateData.dateOfPayment ?? "",
//       amountPaid: updateData.amountPaid ?? "",
//       reach: updateData.reach ?? "",
//       likes: updateData.likes ?? "",
//       shares: updateData.shares ?? "",
//       remarks: updateData.remarks ?? "",
//     }

//     await collection.updateOne(
//       { _id: new ObjectId(id) },
//       {
//         $set: {
//           ...cleanedUpdateData,
//           updatedAt: new Date(),
//         },
//       }
//     )

//     const logInfluencerName =
//       oldRow?.influencerName ||
//       profile?.influencerName ||
//       cleanedUpdateData.influencerName ||
//       "Manual Entry"

//     const activityLogs: any[] = []

//     Object.keys(cleanedUpdateData).forEach((field) => {
//       const oldValue = oldRow[field] ?? ""
//       const newValue = cleanedUpdateData[field] ?? ""

//       if (String(oldValue) !== String(newValue)) {
//         activityLogs.push({
//           campaignId: oldRow.campaignId,
//           campaignRowId: oldRow._id,
//           influencerId: oldRow.influencerId || null,
//           action: "edit",
//           field,
//           oldValue,
//           newValue,
//           influencerName: logInfluencerName,
//           staff: staff || null,
//           createdAt: new Date(),
//         })
//       }
//     })

//     if (activityLogs.length > 0) {
//       await logs.insertMany(activityLogs)
//     }

//     return Response.json({ success: true })
//   } catch (error) {
//     console.error("update-influencer-row error:", error)
//     return Response.json({ message: "Failed to update row" }, { status: 500 })
//   }
// }

import clientPromise, { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, staff, ...updateData } = body

    if (!id) {
      return Response.json({ message: "Row id is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = await getDatabase()

    const collection = db.collection("crm_campaign_influencers")
    const logs = db.collection("crm_campaign_activity_logs")

    const oldRow = await collection.findOne({
      _id: new ObjectId(id)
    })

    if (!oldRow) {
      return Response.json({ message: "Row not found" }, { status: 404 })
    }

    let profile: any = null

    if (oldRow?.influencerId) {
      profile = await db.collection("full_profiles").findOne({
        _id:
          typeof oldRow.influencerId === "string"
            ? new ObjectId(oldRow.influencerId)
            : oldRow.influencerId
      })
    }

    const cleanedUpdateData: Record<string, any> = {
      influencerName: updateData.influencerName ?? oldRow.influencerName ?? "",
      instagram_follwers: updateData.instagram_follwers ?? profile?.platforms?.find((p: any) => p.name === "instagram")?.followers ?? "",
      city: updateData.city ?? "",
      contactNumber: updateData.contactNumber ?? "",
      status: updateData.status ?? "",
      doingOrDrop: updateData.doingOrDrop ?? "",
      pageLink: updateData.pageLink ?? "",
      rating: updateData.rating ?? "",
      activityLink: updateData.activityLink ?? "",
      quotedBudget: updateData.quotedBudget ?? "",
      clientPercent: updateData.clientPercent ?? "",
      influBudget: updateData.influBudget ?? "",
      budget: updateData.budget ?? "",
      paymentStatus: updateData.paymentStatus ?? "",
      dateOfPayment: updateData.dateOfPayment ?? "",
      amountPaid: updateData.amountPaid ?? "",
      reach: updateData.reach ?? "",
      likes: updateData.likes ?? "",
      shares: updateData.shares ?? "",
      remarks: updateData.remarks ?? ""
    }

    const activityLogs: any[] = []

    Object.keys(cleanedUpdateData).forEach((field) => {
      const oldValue = oldRow[field] ?? ""
      const newValue = cleanedUpdateData[field] ?? ""

      if (String(oldValue) !== String(newValue)) {
        activityLogs.push({
          campaignId: oldRow.campaignId,
          campaignRowId: oldRow._id,
          influencerId: oldRow.influencerId || null,
          action: "edit",
          field,
          oldValue,
          newValue,
          influencerName:
            oldRow.influencerName ||
            profile?.influencerName ||
            cleanedUpdateData.influencerName ||
            "Manual Entry",
          staff: staff || null,
          createdAt: new Date()
        })
      }
    })

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...cleanedUpdateData,
          updatedAt: new Date()
        }
      }
    )

    if (activityLogs.length > 0) {
      await logs.insertMany(activityLogs)
    }

    return Response.json({
      success: true,
      message: "Row updated successfully"
    })
  } catch (error) {
    console.error("update-influencer-row error:", error)
    return Response.json(
      { message: "Failed to update row" },
      { status: 500 }
    )
  }
}
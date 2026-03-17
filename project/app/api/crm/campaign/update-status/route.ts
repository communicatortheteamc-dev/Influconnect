import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

export async function PUT(req: Request) {
  try {
    const { id, status } = await req.json()

    if (!id || !status) {
      return Response.json(
        { error: "Campaign id and status are required" },
        { status: 400 }
      )
    }

    const allowedStatuses = ["running", "completed", "hold", "rejected"]

    if (!allowedStatuses.includes(status)) {
      return Response.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    const result = await db.collection("campaigns").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    )

    if (!result.matchedCount) {
      return Response.json(
        { error: "Campaign not found" },
        { status: 404 }
      )
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error)
    return Response.json(
      { error: "Failed to update status" },
      { status: 500 }
    )
  }
}
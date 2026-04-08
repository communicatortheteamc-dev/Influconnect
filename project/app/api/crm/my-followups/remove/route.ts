

import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    if (!id) {
      return Response.json(
        { error: "Followup id required" },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    const result = await db.collection("quick_followups").deleteOne({
      _id: new ObjectId(id),
    })

    if (!result.deletedCount) {
      return Response.json(
        { error: "Followup not found" },
        { status: 404 }
      )
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("REMOVE FOLLOWUP ERROR:", error)
    return Response.json(
      { error: "Failed to remove followup" },
      { status: 500 }
    )
  }
}
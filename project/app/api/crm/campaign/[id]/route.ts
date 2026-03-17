import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase()

    const campaign = await db.collection("campaigns").findOne({
      _id: new ObjectId(params.id),
    })

    if (!campaign) {
      return Response.json(
        { error: "Campaign not found" },
        { status: 404 }
      )
    }

    return Response.json({ campaign })
  } catch (error) {
    console.error("GET CAMPAIGN ERROR:", error)
    return Response.json(
      { error: "Failed to fetch campaign" },
      { status: 500 }
    )
  }
}
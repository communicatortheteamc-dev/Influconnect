import clientPromise, { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { get } from "node:http"
export const dynamic = 'force-dynamic';
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = await getDatabase()

    const logs = await db
      .collection("crm_campaign_activity_logs")
      .find({
        campaignId: new ObjectId(params.id)
      })
      .sort({ editedAt: -1 })
      .toArray()

    return Response.json(logs)
  } catch (error) {
    return Response.json(
      { message: "Failed to load campaign history" },
      { status: 500 }
    )
  }
}
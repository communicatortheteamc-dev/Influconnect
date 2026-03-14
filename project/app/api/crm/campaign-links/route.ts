// /api/crm/campaign-links/route.ts
import clientPromise, { getDatabase } from "@/lib/mongodb"

export async function GET() {
  const client = await clientPromise
  const db = await getDatabase()

  const links = await db.collection("crm_campaign_influencers").find({}).toArray()

  return Response.json(links)
}
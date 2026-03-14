import clientPromise from "@/lib/mongodb"

export async function POST(req: Request) {

  const { staffId } = await req.json()

  const client = await clientPromise
  const db = client.db("dataentry")

  const influencers = await db
    .collection("influencer_profiles")
    .find({
      locked_by: staffId,
      followup_status: "locked"
    })
    .toArray()

  return Response.json(influencers)
}
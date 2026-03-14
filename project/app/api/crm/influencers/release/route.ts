import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(req: Request) {

  const { influencerId } = await req.json()

  const client = await clientPromise
  const db = client.db("dataentry")

  await db.collection("influencer_profiles").updateOne(
    { _id: new ObjectId(influencerId) },
    {
      $set: {
        followup_status: "available"
      },
      $unset: {
        locked_by: "",
        locked_at: ""
      }
    }
  )

  return Response.json({ success: true })
}
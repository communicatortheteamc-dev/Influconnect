import { NextResponse } from "next/server"
// import { connectDB } from "@/lib/db"
import Influencer from "@/models/CRMInfluencer"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"
import { getDatabase } from "@/lib/mongodb"

export async function POST(req: Request) {
  await getDatabase()

  const token = cookies().get("crm_token")?.value
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user: any = verifyToken(token)
  if (user.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { influencerIds, staffId } = await req.json()

  await Influencer.updateMany(
    { _id: { $in: influencerIds } },
    { assigned_to: staffId }
  )

  return NextResponse.json({ success: true })
}
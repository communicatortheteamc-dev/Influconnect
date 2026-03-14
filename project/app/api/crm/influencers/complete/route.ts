import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase, getRawDataDB } from "@/lib/mongodb"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { _id, verifiedBy, ...profileData } = body
    
    const db = await getDatabase()

    // 1. Create the finalized record
    const finalProfile = {
      ...profileData,
      originalId: new ObjectId(_id),
      verifiedAt: new Date(),
      status: "COMPLETED"
    }

    // 2. Insert into 'full_profiles'
    await db.collection("full_profiles").insertOne(finalProfile)

    // 3. Mark original as verified + add history log
    await db.collection("influencer_profiles").updateOne(
      { _id: new ObjectId(_id) },
      { 
        $set: { 
          isVerified: true, 
          verifiedAt: new Date() 
        },
        $push: {
          editHistory: {
            action: "verify",
            editedBy: verifiedBy || "Unknown",
            date: new Date()
          }
        }as any
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to store profile" }, { status: 500 })
  }
}
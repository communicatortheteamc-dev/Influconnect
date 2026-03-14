import { NextResponse } from "next/server"
// import { connectDB } from "@/lib/db"
import Influencer from "@/models/CRMInfluencer"
import { getDatabase } from "@/lib/mongodb"

// import { Influencer } from "@/models/Influencer"

export async function GET() {
  await getDatabase()

  const staffStats = await Influencer.aggregate([
    {
      $group: {
        _id: "$assigned_to",
        total: { $sum: 1 },
        completed: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0]
          }
        }
      }
    }
  ])

  return NextResponse.json(staffStats)
}
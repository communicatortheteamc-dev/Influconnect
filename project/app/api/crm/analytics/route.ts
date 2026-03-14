import { NextResponse } from "next/server"
// import { connectDB } from "@/lib/db"
import CRMInfluencer from "@/models/CRMInfluencer"
import { getDatabase } from "@/lib/mongodb"
export const dynamic = 'force-dynamic';
// import { Influencer } from "@/models/Influencer"

export async function GET() {
  await getDatabase()

  const staffStats = await CRMInfluencer.aggregate([
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
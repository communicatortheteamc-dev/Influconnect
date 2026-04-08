import clientPromise, { getDatabase, getRawDataDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const staffId = searchParams.get("staffId")

    if (!staffId) {
      return Response.json(
        { error: "staffId is required" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = await getDatabase()
    const rawDB = await getRawDataDB()

    const quickFollowupsCollection = db.collection("quick_followups")
    const remindersCollection = db.collection("reminders")
    const rawInfluencersCollection = rawDB.collection("influencer_profiles")

    const active = await quickFollowupsCollection
      .find({
        staff_id: staffId,
        status: "active",
      })
      .sort({ createdAt: -1 })
      .toArray()

    const completed = await quickFollowupsCollection
      .find({
        staff_id: staffId,
        status: "completed",
      })
      .sort({ completedAt: -1, createdAt: -1 })
      .toArray()

    const reminders = await remindersCollection
      .find({
        staff_id: staffId,
      })
      .sort({ reminderDate: 1, createdAt: -1 })
      .toArray()

    const allFollowups = [...active, ...completed]

    const influencerIds = Array.from(
      new Set(
        allFollowups
          .map((item: any) => item.influencer_id)
          .filter(Boolean)
          .map((id: any) => id.toString())
      )
    )

    const validObjectIds = influencerIds
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id))

    const rawInfluencers = await rawInfluencersCollection
      .find({
        _id: { $in: validObjectIds },
      })
      .toArray()

    const rawInfluencersWithCompletion = rawInfluencers.map((inf: any) => {
      let score = 0
      const totalFields = 7
      const missingFields: string[] = []

      if (inf.influencerName) score++
      else missingFields.push("Name")

      if (inf.location) score++
      else missingFields.push("Location")

      if (inf.category && inf.category.length > 0) score++
      else missingFields.push("Category")

      if (inf.languages && inf.languages.length > 0) score++
      else missingFields.push("Languages")

      if (inf.phone) score++
      else missingFields.push("Phone")

      if (inf.email) score++
      else missingFields.push("Email")

      if (inf.platforms && inf.platforms.length > 0) score++
      else missingFields.push("Platforms")

      const completionPercent = Math.round((score / totalFields) * 100)

      return {
        ...inf,
        completionPercent,
        missingFields,
      }
    })

    const influencerMap = new Map<string, any>()

    for (const inf of rawInfluencersWithCompletion) {
      influencerMap.set(inf._id.toString(), inf)
    }

    const attachInfluencer = (items: any[]) =>
      items.map((item: any) => {
        const influencerId =
          item.influencer_id?.toString?.() || item.influencer_id

        return {
          ...item,
          influencer: influencerMap.get(influencerId) || null,
        }
      })

    return Response.json({
      active: attachInfluencer(active),
      completed: attachInfluencer(completed),
      reminders,
    })
  } catch (error) {
    console.error("STAFF DASHBOARD ERROR:", error)
    return Response.json(
      { error: "Failed to load staff dashboard" },
      { status: 500 }
    )
  }
}
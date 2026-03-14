import { NextResponse } from "next/server"
import { getRawDataDB } from "@/lib/mongodb"

export async function GET(req: Request) {

  try {

    const { searchParams } = new URL(req.url)

    const search = searchParams.get("search") || ""
    const platform = searchParams.get("platform") || ""
    const category = searchParams.get("category") || ""
    const location = searchParams.get("location") || ""
    const language = searchParams.get("language") || ""
    const followers = Number(searchParams.get("followers") || 0)

    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 20)

    const rawDB = await getRawDataDB()
    const collection = rawDB.collection("influencer_profiles")

    let query: any = {}

    /* SEARCH */

    if (search) {
      query.influencerName = {
        $regex: search,
        $options: "i"
      }
    }

    /* CATEGORY */

    if (category) {
      query.category = category
    }

    /* LOCATION */

    if (location) {
      query.location = {
        $regex: location,
        $options: "i"
      }
    }

    /* LANGUAGE */

    if (language) {
      query.languages = { $in: [language] }
    }

    /* PLATFORM + FOLLOWERS */

    if (platform || followers) {

      const elemMatch: any = {}

      if (platform) {
        elemMatch.name = platform
      }

      if (followers) {
        elemMatch.followers = { $gte: followers }
      }

      query.platforms = {
        $elemMatch: elemMatch
      }
    }

    /* FETCH DATA */

    const influencers = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    /* ADD COMPLETION % */

    const influencersWithCompletion = influencers.map((inf: any) => {

  let score = 0
  const totalFields = 7
  const missingFields = []

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
    missingFields
  }
})

    const total = await collection.countDocuments(query)

    return NextResponse.json({
      influencers: influencersWithCompletion,
      total,
      page,
      pages: Math.ceil(total / limit)
    })

  } catch (error) {

    console.error("Influencers API Error:", error)

    return NextResponse.json(
      { error: "Failed to fetch influencers" },
      { status: 500 }
    )

  }

}
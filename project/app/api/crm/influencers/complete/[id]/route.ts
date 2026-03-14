
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase, getRawDataDB } from "@/lib/mongodb"

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

    const rawDB = await getDatabase()
    const collection = rawDB.collection("full_profiles")

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

    /* LANGUAGE (ARRAY SUPPORT) */

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

    const total = await collection.countDocuments(query)

    return NextResponse.json({
      influencers,
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
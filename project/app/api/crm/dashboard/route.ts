import { NextResponse } from "next/server"
import { getDatabase, getRawDataDB } from "@/lib/mongodb"
export const dynamic = 'force-dynamic';
export async function GET() {
  try {

    /* ---------------- DATABASE CONNECTIONS ---------------- */

    const rawDB = await getRawDataDB()
    const crmDB = await getDatabase()

    const rawInfluencers = rawDB.collection("influencer_profiles")
    const crmInfluencers = crmDB.collection("crm_influencers")
    const reminders = crmDB.collection("crm_reminders")
    const staff = crmDB.collection("crm_staff")


    /* ---------------- RAW DATA ANALYTICS ---------------- */

    const totalInfluencers = await rawInfluencers.countDocuments()

    const instagram = await rawInfluencers.countDocuments({
      "platforms.name": "instagram"
    })

    const youtube = await rawInfluencers.countDocuments({
      "platforms.name": "youtube"
    })


    /* ---------------- MISSING CONTACT DATA ---------------- */

    const noPhone = await rawInfluencers.countDocuments({
      $or: [
        { phone: { $exists: false } },
        { phone: null },
        { phone: "" },
        { phone: { $regex: /^\s*$/ } }
      ]
    })

    const noEmail = await rawInfluencers.countDocuments({
      $or: [
        { email: { $exists: false } },
        { email: null },
        { email: "" },
        { email: { $regex: /^\s*$/ } }
      ]
    })


    /* ---------------- PROFILE COMPLETION ---------------- */

    const completionStats = await rawInfluencers.aggregate([

      {
        $project: {

          influencerName: 1,
          location: 1,
          category: 1,
          languages: 1,
          phone: 1,
          email: 1,
          platforms: 1,

          // ADDED
          budget: 1,
          negotiableBudget: 1,

          score: {
            $add: [

              {
                $cond: [
                  { $gt: [{ $strLenCP: { $ifNull: ["$influencerName", ""] } }, 0] },
                  1,
                  0
                ]
              },

              {
                $cond: [
                  { $gt: [{ $strLenCP: { $ifNull: ["$location", ""] } }, 0] },
                  1,
                  0
                ]
              },

              {
                $cond: [
                  {
                    $and: [
                      { $isArray: "$category" },
                      { $gt: [{ $size: "$category" }, 0] }
                    ]
                  },
                  1,
                  0
                ]
              },

              {
                $cond: [
                  {
                    $and: [
                      { $isArray: "$languages" },
                      { $gt: [{ $size: "$languages" }, 0] }
                    ]
                  },
                  1,
                  0
                ]
              },

              {
                $cond: [
                  { $gt: [{ $strLenCP: { $ifNull: ["$phone", ""] } }, 0] },
                  1,
                  0
                ]
              },

              {
                $cond: [
                  { $gt: [{ $strLenCP: { $ifNull: ["$email", ""] } }, 0] },
                  1,
                  0
                ]
              },

              {
                $cond: [
                  { $gt: [{ $size: { $ifNull: ["$platforms", []] } }, 0] },
                  1,
                  0
                ]
              },

              // ADDED FOR BUDGET
              {
                $cond: [
                  { $gt: [{ $ifNull: ["$budget", 0] }, 0] },
                  1,
                  0
                ]
              }

            ]
          }

        }
      },

      {
        $addFields: {
          completionPercent: {
            $multiply: [
              { $divide: ["$score", 8] }, // updated from 7 → 8
              100
            ]
          }
        }
      },

      {
        $group: {
          _id: null,
          avgCompletion: { $avg: "$completionPercent" },

          completedProfiles: {
            $sum: {
              $cond: [{ $gte: ["$completionPercent", 90] }, 1, 0]
            }
          },

          incompleteProfiles: {
            $sum: {
              $cond: [{ $lt: ["$completionPercent", 90] }, 1, 0]
            }
          }
        }
      }

    ]).toArray()


    /* ---------------- LOCATION ANALYTICS ---------------- */

    const locationStats = await rawInfluencers.aggregate([
      {
        $match: {
          location: { $ne: null }
        }
      },
      {
        $group: {
          _id: "$location",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]).toArray()



    /* ---------------- CRM DATA ---------------- */

    const crmInfluencerCount = await crmInfluencers
      .countDocuments()
      .catch(() => 0)

    const pendingReminders = await reminders
      .countDocuments({ status: "pending" })
      .catch(() => 0)

    const totalStaff = await staff
      .countDocuments()
      .catch(() => 0)



    /* ---------------- RECENT INFLUENCERS ---------------- */

    const recentInfluencers = await rawInfluencers
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .project({
        influencerName: 1,
        location: 1,
        category: 1,
        platforms: 1,

        // ADDED
        budget: 1,
        negotiableBudget: 1
      })
      .toArray()



    /* ---------------- RESPONSE ---------------- */

    return NextResponse.json({

      stats: {

        totalInfluencers,
        crmInfluencerCount,
        pendingReminders,
        totalStaff,

        noPhone,
        noEmail,

        avgProfileCompletion:
          completionStats[0]?.avgCompletion || 0,

        completedProfiles:
          completionStats[0]?.completedProfiles || 0,

        incompleteProfiles:
          completionStats[0]?.incompleteProfiles || 0

      },

      platforms: {
        instagram,
        youtube
      },

      locationStats,

      recentInfluencers

    })

  } catch (error) {

    console.error("CRM DASHBOARD ERROR:", error)

    return NextResponse.json(
      { error: "Dashboard failed" },
      { status: 500 }
    )
  }
}
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getRawDataDB } from "@/lib/mongodb"

// GET: Fetch single influencer
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const db = await getRawDataDB()

  const influencer = await db
    .collection("influencer_profiles")
    .findOne({ _id: new ObjectId(params.id) })

  return NextResponse.json({ influencer })
}


// PUT: Update existing profile data
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const db = await getRawDataDB()

    const { _id, editedBy, ...updateData } = body

    const collection = db.collection("influencer_profiles")

    // get previous data
    const existing = await collection.findOne({
      _id: new ObjectId(params.id),
    })

    const editedFields: string[] = []
    const changes: any = {}

    Object.keys(updateData).forEach((key) => {
      if (JSON.stringify(existing?.[key]) !== JSON.stringify(updateData[key])) {
        editedFields.push(key)

        // store old -> new value
        changes[key] = {
          old: existing?.[key] ?? null,
          new: updateData[key] ?? null,
        }
      }
    })

    const historyEntry = {
      action: "edit",
      editedBy: editedBy || "Unknown",
      editedFields,
      changes,
      date: new Date(),
    }

    await collection.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          influencerName: updateData.influencerName,
          location: updateData.location,
          category: updateData.category,
          languages: updateData.languages,
          platforms: updateData.platforms,
          phone: updateData.phone,
          email: updateData.email,

          budget: updateData.budget,
          negotiableBudget: updateData.negotiableBudget,

          updatedAt: new Date(),
        },
        $push: {
          editHistory: historyEntry,
        },
      } as any
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const {
      id,
      status,
      quotationRaised,
      quotationAmount,
      quotationDate,
      invoiceGenerated,
      invoiceAmount,
      invoiceDate,
    } = body

    if (!id) {
      return Response.json(
        { error: "Campaign id is required" },
        { status: 400 }
      )
    }

    const updateData: Record<string, any> = {}

    if (status !== undefined) {
      const allowedStatuses = ["running", "completed", "hold", "rejected"]

      if (!allowedStatuses.includes(status)) {
        return Response.json(
          { error: "Invalid status" },
          { status: 400 }
        )
      }

      updateData.status = status
    }

    if (quotationRaised !== undefined) {
      const allowedYesNo = ["yes", "no", ""]
      if (!allowedYesNo.includes(quotationRaised)) {
        return Response.json(
          { error: "Invalid quotationRaised value" },
          { status: 400 }
        )
      }
      updateData.quotationRaised = quotationRaised
    }

    if (quotationAmount !== undefined) {
      updateData.quotationAmount = quotationAmount === "" ? "" : Number(quotationAmount)
    }

    if (quotationDate !== undefined) {
      updateData.quotationDate = quotationDate
    }

    if (invoiceGenerated !== undefined) {
      const allowedYesNo = ["yes", "no", ""]
      if (!allowedYesNo.includes(invoiceGenerated)) {
        return Response.json(
          { error: "Invalid invoiceGenerated value" },
          { status: 400 }
        )
      }
      updateData.invoiceGenerated = invoiceGenerated
    }

    if (invoiceAmount !== undefined) {
      updateData.invoiceAmount = invoiceAmount === "" ? "" : Number(invoiceAmount)
    }

    if (invoiceDate !== undefined) {
      updateData.invoiceDate = invoiceDate
    }

    if (Object.keys(updateData).length === 0) {
      return Response.json(
        { error: "No fields provided to update" },
        { status: 400 }
      )
    }

    updateData.updatedAt = new Date()

    const db = await getDatabase()

    const result = await db.collection("campaigns").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: updateData,
      }
    )

    if (!result.matchedCount) {
      return Response.json(
        { error: "Campaign not found" },
        { status: 404 }
      )
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("UPDATE CAMPAIGN ERROR:", error)
    return Response.json(
      { error: "Failed to update campaign" },
      { status: 500 }
    )
  }
}
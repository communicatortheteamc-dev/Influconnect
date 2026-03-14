import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/mongodb"
export const dynamic = 'force-dynamic';
export async function GET() {

  try {

    const cookieStore = cookies()
    const token = cookieStore.get("crm_token")?.value

    if (!token) {
      return NextResponse.json({ user: null })
    }

    // verify token
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    )

    const db = await getDatabase()

    const staff = await db.collection("crm_staff").findOne({
      _id: new ObjectId(decoded.id)
    })

    if (!staff) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role
      }
    })

  } catch (error) {

    console.error("ME API ERROR:", error)

    return NextResponse.json({
      user: null
    })

  }

}
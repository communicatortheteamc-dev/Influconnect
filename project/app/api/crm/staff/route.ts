import { NextResponse } from "next/server"
// import { connectDB } from "@/lib/db"
import Staff from "@/models/CRMStaff"
import bcrypt from "bcryptjs"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"
import { getDatabase } from "@/lib/mongodb"
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  await getDatabase()

  const token = cookies().get("crm_token")?.value
  const user: any = verifyToken(token!)

  if (user.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { name, email, password, role } = await req.json()

  const hashed = await bcrypt.hash(password, 10)

  await Staff.create({
    name,
    email,
    password: hashed,
    role
  })

  return NextResponse.json({ success: true })
}
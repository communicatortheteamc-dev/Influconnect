import clientPromise, { getDatabase } from "@/lib/mongodb"
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)
  const staffId = searchParams.get("staffId")

  const client = await clientPromise
  const db = await getDatabase()

  const active = await db.collection("quick_followups").find({
    staff_id: staffId,
    status: "active"
  }).toArray()

  const completed = await db.collection("quick_followups").find({
    staff_id: staffId,
    status: "completed"
  }).toArray()

  const reminders = await db.collection("reminders").find({
    staff_id: staffId
  }).toArray()

  return Response.json({
    active,
    completed,
    reminders
  })
}
import clientPromise, { getDatabase } from "@/lib/mongodb"
export const dynamic = 'force-dynamic';
export async function GET() {
  const db = await getDatabase()

  const running = await db.collection("campaigns").find({ status: "running" }).toArray()
  const completed = await db.collection("campaigns").find({ status: "completed" }).toArray()
  const hold = await db.collection("campaigns").find({ status: "hold" }).toArray()
  const rejected = await db.collection("campaigns").find({ status: "rejected" }).toArray()

  return Response.json({
    running,
    completed,
    hold,
    rejected
  })
}
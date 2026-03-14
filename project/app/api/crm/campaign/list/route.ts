import clientPromise, { getDatabase } from "@/lib/mongodb"
export const dynamic = 'force-dynamic';
export async function GET(){

  const client = await clientPromise
  const db = await getDatabase()

  const running = await db.collection("campaigns").find({
    status:"running"
  }).toArray()

  const completed = await db.collection("campaigns").find({
    status:"completed"
  }).toArray()

  return Response.json({
    running,
    completed
  })
}
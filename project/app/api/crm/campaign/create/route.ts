import clientPromise, { getDatabase } from "@/lib/mongodb"
import { get } from "node:http"

export async function POST(req: Request){

  const { name, client_name, staff } = await req.json()

  const client = await clientPromise
  const db = await getDatabase()

  const result = await db.collection("campaigns").insertOne({
    name,
    client_name,
    status:"running",
    created_by: staff,
    created_at: new Date()
  })

  return Response.json({success:true,id:result.insertedId})
}
import { MongoClient, Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local")
}

const uri = process.env.MONGODB_URI

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri)
    globalWithMongo._mongoClientPromise = client.connect()
  }

  clientPromise = globalWithMongo._mongoClientPromise

} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export default clientPromise

/*
=============================
INFLUCONNECT DB (CRM DATA)
=============================
*/
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db("influconnect")
}

/*
=============================
RAW DATA DB
=============================
*/
export async function getRawDataDB(): Promise<Db> {
  const client = await clientPromise
  return client.db("dataentry")
}
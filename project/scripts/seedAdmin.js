require('dotenv').config()
const bcrypt = require('bcryptjs')
const { MongoClient } = require('mongodb')

async function seed() {
  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()

  const db = client.db('influconnect')

  const existing = await db.collection('crm_staff').findOne({
    email: 'tharun@crm.com'
  })

  if (existing) {
    console.log('Admin already exists')
    process.exit()
  }

  const hashed = await bcrypt.hash('Admin@123', 10)

  await db.collection('crm_staff').insertOne({
   
     name: 'Tharun',
    email: 'tharun@crm.com',
    password: await bcrypt.hash('TharunDEV@123', 10),
    role: 'admin',
    created_at: new Date()
  })

  console.log('Admin created successfully')
  process.exit()
}

seed()
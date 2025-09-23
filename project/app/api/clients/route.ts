import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const collection = db.collection('clients');
    
    const clients = await collection
      .find({})
      .sort({ rating: -1, campaignsCompleted: -1 })
      .toArray();

    return NextResponse.json({
      data: clients,
      total: clients.length
    });

  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const collection = db.collection('clients');
    
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'logo', 'industry', 'description', 'rating', 'testimonial'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }
    
    // Create client document
    const client = {
      ...data,
      campaignsCompleted: data.campaignsCompleted || 0,
      createdAt: new Date().toISOString()
    };
    
    const result = await collection.insertOne(client);
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      message: 'Client added successfully'
    });

  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json({ error: 'Failed to add client' }, { status: 500 });
  }
}
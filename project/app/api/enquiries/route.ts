import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const collection = db.collection('enquiries');
    
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'services'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }
    
    // Create enquiry document
    const enquiry = {
      ...data,
      createdAt: new Date().toISOString()
    };
    
    const result = await collection.insertOne(enquiry);
    
    // Here you would typically send an email notification to admin
    // Using EmailJS or similar service
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      message: 'Enquiry submitted successfully'
    });

  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 });
  }
}
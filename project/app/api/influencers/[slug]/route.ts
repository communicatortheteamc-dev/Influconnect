import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const db = await getDatabase();
    const collection = db.collection('influencers');
    
    const influencer = await collection.findOne({ slug: params.slug });
    
    if (!influencer) {
      return NextResponse.json({ error: 'Influencer not found' }, { status: 404 });
    }
    
    return NextResponse.json(influencer);
  } catch (error) {
    console.error('Error fetching influencer:', error);
    return NextResponse.json({ error: 'Failed to fetch influencer' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const db = await getDatabase();
    const collection = db.collection('influencers');
    
    const updateData = await request.json();
    
    // Remove _id from update data if present
    const { _id, ...dataToUpdate } = updateData;
    
    // Calculate total followers if socials are updated
    if (dataToUpdate.socials) {
      let totalFollowers = 0;
      Object.values(dataToUpdate.socials).forEach((social: any) => {
        if (social && social.followers) {
          totalFollowers += social.followers;
        }
      });
      dataToUpdate.totalFollowers = totalFollowers;
    }
    
    // Update the document
    const result = await collection.updateOne(
      { slug: params.slug },
      { 
        $set: {
          ...dataToUpdate,
          updatedAt: new Date().toISOString()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Influencer not found' }, { status: 404 });
    }
    
    // Fetch and return updated document
    const updatedInfluencer = await collection.findOne({ slug: params.slug });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: updatedInfluencer
    });

  } catch (error) {
    console.error('Error updating influencer:', error);
    return NextResponse.json({ error: 'Failed to update influencer' }, { status: 500 });
  }
}
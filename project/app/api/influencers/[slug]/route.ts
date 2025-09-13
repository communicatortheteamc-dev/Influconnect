import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

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
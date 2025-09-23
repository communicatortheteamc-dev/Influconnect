import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { email, slug } = await request.json();
    
    if (!email || !slug) {
      return NextResponse.json({ 
        verified: false, 
        message: 'Email and slug are required' 
      }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection('influencers');
    
    // Find influencer by slug and email
    const influencer = await collection.findOne({ 
      slug: slug,
      email: email.toLowerCase().trim()
    });
    
    if (influencer) {
      return NextResponse.json({ 
        verified: true, 
        message: 'Email verified successfully',
        influencerId: influencer._id
      });
    } else {
      return NextResponse.json({ 
        verified: false, 
        message: 'Email does not match this profile. Please check your email address.' 
      }, { status: 401 });
    }

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json({ 
      verified: false, 
      message: 'Verification failed. Please try again.' 
    }, { status: 500 });
  }
}
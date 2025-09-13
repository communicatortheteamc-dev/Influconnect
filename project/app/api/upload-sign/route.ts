import { NextRequest, NextResponse } from 'next/server';
import { generateSignature } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const { publicId } = await request.json();
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    const signature = generateSignature(publicId, timestamp);
    
    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error('Error generating signature:', error);
    return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
  }
}
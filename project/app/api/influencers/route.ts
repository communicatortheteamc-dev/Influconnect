import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { FilterParams } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const collection = db.collection('influencers');

    const searchParams = request.nextUrl.searchParams;
    const params: FilterParams = {
      q: searchParams.get('q') || '',
      category: searchParams.get('category') || '',
      location: searchParams.get('location') || '',
      platform: searchParams.get('platform') || '',
      minFollowers: searchParams.get('minFollowers') ? parseInt(searchParams.get('minFollowers')!) : 0,
      maxFollowers: searchParams.get('maxFollowers') ? parseInt(searchParams.get('maxFollowers')!) : 10000000,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '9'),
      sort: searchParams.get('sort') || 'createdAt_desc',
    };

    // Build query
    const query: any = {};

    if (params.q) {
      query.$or = [
        { name: { $regex: params.q, $options: 'i' } },
        { bio: { $regex: params.q, $options: 'i' } },
        { category: { $regex: params.q, $options: 'i' } },
        { location: { $regex: params.q, $options: 'i' } }
      ];
    }

    if (params.category) {
      query.category = params.category;
    }

    if (params.location) {
      query.location = { $regex: params.location, $options: 'i' };
    }

    if (params.platform) {
      query[`socials.${params.platform.toLowerCase()}`] = { $exists: true };
    }

    const minFollowers = params.minFollowers ?? 0;          // default to 0
    const maxFollowers = params.maxFollowers ?? 10_000_000; // default to 10M

    if (minFollowers > 0 || maxFollowers < 10_000_000) {
      query.totalFollowers = {
        $gte: minFollowers,
        $lte: maxFollowers,
      };
    }
    if (
      (params.minFollowers !== undefined && params.minFollowers > 0) ||
      (params.maxFollowers !== undefined && params.maxFollowers < 10000000)
    ) {
      query.totalFollowers = {
        ...(params.minFollowers !== undefined && { $gte: params.minFollowers }),
        ...(params.maxFollowers !== undefined && { $lte: params.maxFollowers }),
      };
    }
    // Sort options
    const sortOptions: any = {};
    switch (params.sort) {
      case 'followers_desc':
        sortOptions.totalFollowers = -1;
        break;
      case 'followers_asc':
        sortOptions.totalFollowers = 1;
        break;
      case 'name_asc':
        sortOptions.name = 1;
        break;
      case 'name_desc':
        sortOptions.name = -1;
        break;
      default:
        sortOptions.createdAt = -1;
    }

    // Execute query with pagination
    const skip = (params.page! - 1) * params.limit!;
    const [data, total] = await Promise.all([
      collection
        .find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(params.limit!)
        .toArray(),
      collection.countDocuments(query)
    ]);

    return NextResponse.json({
      data,
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit!)
    });

  } catch (error) {
    console.error('Error fetching influencers:', error);
    return NextResponse.json({ error: 'Failed to fetch influencers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const collection = db.collection('influencers');

    const data = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'location', 'category', 'photoUrl', 'termsAccepted'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Calculate total followers
    let totalFollowers = 0;
    if (data.socials) {
      Object.values(data.socials).forEach((social: any) => {
        if (social.followers) {
          totalFollowers += social.followers;
        }
      });
    }

    // Create influencer document
    const influencer = {
      ...data,
      totalFollowers,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      createdAt: new Date().toISOString()
    };

    const result = await collection.insertOne(influencer);

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      message: 'Influencer registered successfully'
    });

  } catch (error) {
    console.error('Error creating influencer:', error);
    return NextResponse.json({ error: 'Failed to register influencer' }, { status: 500 });
  }
}
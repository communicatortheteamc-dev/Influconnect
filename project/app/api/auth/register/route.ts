import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, company,pageName,mobile } = await request.json();
    
    // Validate required fields
    if (!name || !email || !password || !mobile) {
      return NextResponse.json({ 
        success: false, 
        message: 'All fields are required' 
      }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection('users');
    
    // Check if user already exists
    const existingUser = await collection.findOne({ 
      email: email.toLowerCase().trim() 
    });
    
    if (existingUser) {
      return NextResponse.json({ 
        success: false, 
        message: 'User with this email already exists' 
      }, { status: 409 });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user document
    const user = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      company: company.trim(),
      pageName: pageName.trim(),
      mobile: mobile,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      loginCount: 0,
      isActive: true
    };
    
    const result = await collection.insertOne(user);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Account created successfully',
      userId: result.insertedId
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Registration failed. Please try again.' 
    }, { status: 500 });
  }
}
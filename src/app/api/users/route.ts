import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, createUser } from '@/lib/auth/user-service';
import { hashPassword } from '@/lib/auth/auth-utils';

export async function GET(request: NextRequest) {
  try {
    // Get all users
    const users = await getAllUsers();
    
    // Return users
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { username, password, role } = body;
    
    // Validate input
    if (!username || !password || !role) {
      return NextResponse.json(
        { error: 'Username, password, and role are required' },
        { status: 400 }
      );
    }
    
    // Validate role
    if (!['admin', 'production', 'staff'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const user = await createUser(username, hashedPassword, role);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Username already exists or an error occurred' },
        { status: 400 }
      );
    }
    
    // Return success response
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating user' },
      { status: 500 }
    );
  }
}

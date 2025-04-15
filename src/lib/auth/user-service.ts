// src/lib/auth/user-service.ts
import { prisma } from '../database';
import { comparePassword, hashPassword } from './auth-utils';
import { User } from '@prisma/client';

// Function to get user by username
export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { username }
    });
  } catch (error) {
    console.error('Get user by username error:', error);
    return null;
  }
}

// Function to authenticate user
export async function authenticateUser(username: string, password: string): Promise<User | null> {
  try {
    const user = await getUserByUsername(username);
    
    if (!user) {
      return null;
    }
    
    const passwordMatch = await comparePassword(password, user.password);
    
    if (!passwordMatch) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Authenticate user error:', error);
    return null;
  }
}

// Function to create user
export async function createUser(
  username: string,
  password: string,
  role: 'admin' | 'production' | 'staff'
): Promise<User | null> {
  try {
    // Check if username already exists
    const existingUser = await getUserByUsername(username);
    
    if (existingUser) {
      return null;
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    return await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    return null;
  }
}

// Function to get all users
export async function getAllUsers(): Promise<User[]> {
  try {
    return await prisma.user.findMany();
  } catch (error) {
    console.error('Get all users error:', error);
    return [];
  }
}

// Function to delete user
export async function deleteUser(userId: number): Promise<boolean> {
  try {
    await prisma.user.delete({
      where: { id: userId }
    });
    return true;
  } catch (error) {
    console.error('Delete user error:', error);
    return false;
  }
}

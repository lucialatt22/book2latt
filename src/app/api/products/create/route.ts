import { NextRequest, NextResponse } from 'next/server';
import { createProduct, updateProduct, deleteProduct } from '@/lib/products/product-service';
import { hashPassword } from '@/lib/auth/auth-utils';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { name, description, category_id, image_url, specifications } = body;
    
    // Validate input
    if (!name || !category_id) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      );
    }
    
    // Create product
    const product = await createProduct(
      name,
      description || '',
      category_id,
      image_url || '',
      specifications || []
    );
    
    if (!product) {
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }
    
    // Return success response
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating product' },
      { status: 500 }
    );
  }
}

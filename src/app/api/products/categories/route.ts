import { NextRequest, NextResponse } from 'next/server';
import { getAllProductCategories } from '@/lib/products/product-service';

export async function GET(request: NextRequest) {
  try {
    // Get all product categories
    const categories = await getAllProductCategories();
    
    // Return categories
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Get product categories error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching product categories' },
      { status: 500 }
    );
  }
}

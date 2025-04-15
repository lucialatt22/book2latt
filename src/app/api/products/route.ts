import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, getProductsByCategory, getProductById } from '@/lib/products/product-service';

export async function GET(request: NextRequest) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const productId = searchParams.get('id');
    
    // Get products based on parameters
    if (productId) {
      // Get single product by ID
      const product = await getProductById(parseInt(productId));
      
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ product });
    } else if (categoryId) {
      // Get products by category
      const products = await getProductsByCategory(parseInt(categoryId));
      return NextResponse.json({ products });
    } else {
      // Get all products
      const products = await getAllProducts();
      return NextResponse.json({ products });
    }
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching products' },
      { status: 500 }
    );
  }
}

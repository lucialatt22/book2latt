import { NextRequest, NextResponse } from 'next/server';
import { updateProduct, deleteProduct } from '@/lib/products/product-service';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = parseInt(params.id);
    
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
    
    // Update product
    const product = await updateProduct(
      productId,
      name,
      description || '',
      category_id,
      image_url || '',
      specifications || []
    );
    
    if (!product) {
      return NextResponse.json(
        { error: 'Failed to update product or product not found' },
        { status: 404 }
      );
    }
    
    // Return success response
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = parseInt(params.id);
    
    // Delete product
    const success = await deleteProduct(productId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete product or product not found' },
        { status: 404 }
      );
    }
    
    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting product' },
      { status: 500 }
    );
  }
}

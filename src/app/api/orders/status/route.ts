import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/orders/order-service';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { orderId, status } = body;
    
    // Validate input
    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }
    
    // Validate status
    if (!['in_attesa', 'in_produzione', 'in_ritardo', 'completato'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }
    
    // Update order status
    const success = await updateOrderStatus(orderId, status);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update order status or order not found' },
        { status: 404 }
      );
    }
    
    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update order status error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating order status' },
      { status: 500 }
    );
  }
}

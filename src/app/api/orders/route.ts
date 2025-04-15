import { NextRequest, NextResponse } from 'next/server';
import { getOrdersByDate, getOrderById, updateOrderStatus } from '@/lib/orders/order-service';

export async function GET(request: NextRequest) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const orderId = searchParams.get('id');
    
    // Get orders based on parameters
    if (orderId) {
      // Get single order by ID
      const order = await getOrderById(parseInt(orderId));
      
      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ order });
    } else if (date) {
      // Get orders by date - convert string date to Date object
      const dateObj = new Date(date);
      const orders = await getOrdersByDate(dateObj);
      return NextResponse.json({ orders });
    } else {
      // Return error if no parameters provided
      return NextResponse.json(
        { error: 'Date or order ID is required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching orders' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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
        { error: 'Failed to update order status' },
        { status: 500 }
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

import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/orders/order-service';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { title, description, client_name, order_type, due_date, items } = body;
    
    // Validate input
    if (!title || !due_date || !order_type) {
      return NextResponse.json(
        { error: 'Title, due date, and order type are required' },
        { status: 400 }
      );
    }
    
    // Validate order type
    if (!['negozio', 'speciale'].includes(order_type)) {
      return NextResponse.json(
        { error: 'Invalid order type' },
        { status: 400 }
      );
    }
    
   // To this:
    const order = await createOrder(
      order_type,
      client_name || null,
      new Date(due_date),
      items || []
    );
    
    if (!order) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }
    
    // Return success response
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating order' },
      { status: 500 }
    );
  }
}
//commento
import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus, getOrderById, updateOrder, deleteOrder } from '@/lib/orders/order-service';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = parseInt(params.id);
    
    // Parse request body
    const body = await request.json();
    const { orderType, customerName, status, dueDate, items } = body;
    
    // Validate input
    if (!orderType || !dueDate || !status) {
      return NextResponse.json(
        { error: 'Order type, due date, and status are required' },
        { status: 400 }
      );
    }
    
    // Validate order type and status
    if (!['store', 'customer'].includes(orderType)) {
      return NextResponse.json(
        { error: 'Invalid order type' },
        { status: 400 }
      );
    }
    
    if (!['pending', 'in_production', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }
    
    // Update order
    const order = await updateOrder(
      orderId,
      orderType,
      customerName,
      new Date(dueDate),
      status,
      items || []
    );
    
    if (!order) {
      return NextResponse.json(
        { error: 'Failed to update order or order not found' },
        { status: 404 }
      );
    }
    
    // Return success response
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating order' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = parseInt(params.id);
    
    // Delete order
    const success = await deleteOrder(orderId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete order or order not found' },
        { status: 404 }
      );
    }
    
    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting order' },
      { status: 500 }
    );
  }
}

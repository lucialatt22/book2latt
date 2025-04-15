// src/lib/orders/order-service.ts
import { prisma } from '../database';
import { Order, OrderItem } from '@prisma/client';

// Define order interface with items
export interface OrderWithItems extends Order {
  items: OrderItem[];
}

// Function to get all orders
export async function getAllOrders(): Promise<OrderWithItems[]> {
  try {
    return await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    return [];
  }
}

// Function to get orders by date
export async function getOrdersByDate(date: Date): Promise<OrderWithItems[]> {
  try {
    // Create date range for the specified date (start of day to end of day)
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    return await prisma.order.findMany({
      where: {
        dueDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    });
  } catch (error) {
    console.error('Get orders by date error:', error);
    return [];
  }
}

// Function to get order by ID
export async function getOrderById(orderId: number): Promise<OrderWithItems | null> {
  try {
    return await prisma.order.findUnique({
      where: {
        id: orderId
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    return null;
  }
}

// Function to create order
export async function createOrder(
  orderType: 'store' | 'customer',
  customerName: string | null,
  dueDate: Date,
  items: { productId: number, quantity: number, notes?: string }[]
): Promise<OrderWithItems | null> {
  try {
    return await prisma.order.create({
      data: {
        orderType,
        customerName,
        status: 'pending',
        dueDate,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            notes: item.notes || null
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    return null;
  }
}

// Function to update order status
export async function updateOrderStatus(
  orderId: number,
  status: 'pending' | 'in_production' | 'completed' | 'cancelled'
): Promise<OrderWithItems | null> {
  try {
    return await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        status
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    return null;
  }
}

// Function to update order
export async function updateOrder(
  orderId: number,
  orderType: 'store' | 'customer',
  customerName: string | null,
  dueDate: Date,
  status: 'pending' | 'in_production' | 'completed' | 'cancelled',
  items: { productId: number, quantity: number, notes?: string }[]
): Promise<OrderWithItems | null> {
  try {
    // Delete existing items
    await prisma.orderItem.deleteMany({
      where: {
        orderId
      }
    });
    
    // Update order and add new items
    return await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        orderType,
        customerName,
        status,
        dueDate,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            notes: item.notes || null
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Update order error:', error);
    return null;
  }
}

// Function to delete order
export async function deleteOrder(orderId: number): Promise<boolean> {
  try {
    await prisma.order.delete({
      where: {
        id: orderId
      }
    });
    
    return true;
  } catch (error) {
    console.error('Delete order error:', error);
    return false;
  }
}

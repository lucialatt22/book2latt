# Book2Latt Vercel Deployment Setup

This file contains the necessary setup for initializing the database with test data to verify the application works correctly.

```javascript
// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      role: 'admin'
    }
  });

  // Create production user
  const prodPassword = await bcrypt.hash('production123', 10);
  await prisma.user.upsert({
    where: { username: 'production' },
    update: {},
    create: {
      username: 'production',
      password: prodPassword,
      role: 'production'
    }
  });

  // Create product categories
  const torteCategory = await prisma.productCategory.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Torte'
    }
  });

  const pasticceriaCategory = await prisma.productCategory.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Pasticceria'
    }
  });

  const specialitaCategory = await prisma.productCategory.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Specialità'
    }
  });

  // Create products
  const tortaClassica = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Torta Classica',
      description: 'Base classica con pan di spagna e crema pasticcera',
      imageUrl: 'https://placehold.co/600x400',
      categoryId: torteCategory.id
    }
  });

  // Add specifications to Torta Classica
  await prisma.productSpecification.createMany({
    data: [
      {
        productId: tortaClassica.id,
        specificationKey: 'Diametri disponibili',
        specificationValue: '18cm, 22cm, 26cm'
      },
      {
        productId: tortaClassica.id,
        specificationKey: 'Personalizzazione decorazioni',
        specificationValue: 'Disponibile'
      }
    ],
    skipDuplicates: true
  });

  const tortaCioccolato = await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Torta al Cioccolato',
      description: 'Base al cioccolato con ganache e decorazioni in cioccolato',
      imageUrl: 'https://placehold.co/600x400',
      categoryId: torteCategory.id
    }
  });

  // Add specifications to Torta al Cioccolato
  await prisma.productSpecification.createMany({
    data: [
      {
        productId: tortaCioccolato.id,
        specificationKey: 'Diametri disponibili',
        specificationValue: '18cm, 22cm'
      },
      {
        productId: tortaCioccolato.id,
        specificationKey: 'Varietà di cioccolato',
        specificationValue: 'fondente, al latte, bianco'
      }
    ],
    skipDuplicates: true
  });

  // Create sample orders
  const storeOrder = await prisma.order.upsert({
    where: { id: 1 },
    update: {},
    create: {
      orderType: 'store',
      status: 'pending',
      dueDate: new Date('2025-02-14T12:48:00Z')
    }
  });

  await prisma.orderItem.create({
    data: {
      orderId: storeOrder.id,
      productId: tortaClassica.id,
      quantity: 1,
      notes: 'yhjh'
    }
  });

  const customerOrder = await prisma.order.upsert({
    where: { id: 2 },
    update: {},
    create: {
      orderType: 'customer',
      customerName: 'ewr',
      status: 'in_production',
      dueDate: new Date('2025-02-14T12:42:00Z')
    }
  });

  await prisma.orderItem.create({
    data: {
      orderId: customerOrder.id,
      productId: tortaCioccolato.id,
      quantity: 1,
      notes: 'ewrjk'
    }
  });

  const completedOrder = await prisma.order.upsert({
    where: { id: 3 },
    update: {},
    create: {
      orderType: 'store',
      status: 'completed',
      dueDate: new Date('2025-02-16T08:01:00Z')
    }
  });

  await prisma.orderItem.create({
    data: {
      orderId: completedOrder.id,
      productId: tortaClassica.id,
      quantity: 2,
      notes: 'Castagnole'
    }
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

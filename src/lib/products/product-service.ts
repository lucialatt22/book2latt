// src/lib/products/product-service.ts
import { prisma } from '../database';
import { Product, ProductSpecification, ProductCategory } from '@prisma/client';

// Define product interface with category and specifications
export interface ProductWithDetails extends Product {
  category: {
    id: number;
    name: string;
  };
  specifications?: ProductSpecification[];
}

// Function to get all product categories
export async function getAllProductCategories(): Promise<ProductCategory[]> {
  try {
    return await prisma.productCategory.findMany();
  } catch (error) {
    console.error('Get all categories error:', error);
    return [];
  }
}

// Function to get all categories
export async function getAllCategories(): Promise<ProductCategory[]> {
  try {
    return await prisma.productCategory.findMany();
  } catch (error) {
    console.error('Get all categories error:', error);
    return [];
  }
}

// Function to get all products
export async function getAllProducts(): Promise<ProductWithDetails[]> {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        specs: true
      }
    });
    
    return products.map(product => ({
      ...product,
      category: {
        id: product.category.id,
        name: product.category.name
      },
      specifications: product.specs
    }));
  } catch (error) {
    console.error('Get all products error:', error);
    return [];
  }
}

// Function to get products by category
export async function getProductsByCategory(categoryId: number): Promise<ProductWithDetails[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId: categoryId
      },
      include: {
        category: true,
        specs: true
      }
    });
    
    return products.map(product => ({
      ...product,
      category: {
        id: product.category.id,
        name: product.category.name
      },
      specifications: product.specs
    }));
  } catch (error) {
    console.error('Get products by category error:', error);
    return [];
  }
}

// Function to get product by ID
export async function getProductById(productId: number): Promise<ProductWithDetails | null> {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId
      },
      include: {
        category: true,
        specs: true
      }
    });
    
    if (!product) {
      return null;
    }
    
    return {
      ...product,
      category: {
        id: product.category.id,
        name: product.category.name
      },
      specifications: product.specs
    };
  } catch (error) {
    console.error('Get product by ID error:', error);
    return null;
  }
}

// Function to create product
export async function createProduct(
  name: string,
  description: string,
  categoryId: number,
  imageUrl: string,
  specifications: { key: string, value: string }[]
): Promise<ProductWithDetails | null> {
  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        categoryId,
        imageUrl,
        specs: {
          create: specifications.map(spec => ({
            specificationKey: spec.key,
            specificationValue: spec.value
          }))
        }
      },
      include: {
        category: true,
        specs: true
      }
    });
    
    return {
      ...product,
      category: {
        id: product.category.id,
        name: product.category.name
      },
      specifications: product.specs
    };
  } catch (error) {
    console.error('Create product error:', error);
    return null;
  }
}

// Function to update product
export async function updateProduct(
  productId: number,
  name: string,
  description: string,
  categoryId: number,
  imageUrl: string,
  specifications: { id?: number, key: string, value: string }[]
): Promise<ProductWithDetails | null> {
  try {
    // Delete existing specifications
    await prisma.productSpecification.deleteMany({
      where: {
        productId
      }
    });
    
    // Update product and add new specifications
    const product = await prisma.product.update({
      where: {
        id: productId
      },
      data: {
        name,
        description,
        categoryId,
        imageUrl,
        specs: {
          create: specifications.map(spec => ({
            specificationKey: spec.key,
            specificationValue: spec.value
          }))
        }
      },
      include: {
        category: true,
        specs: true
      }
    });
    
    return {
      ...product,
      category: {
        id: product.category.id,
        name: product.category.name
      },
      specifications: product.specs
    };
  } catch (error) {
    console.error('Update product error:', error);
    return null;
  }
}

// Function to delete product
export async function deleteProduct(productId: number): Promise<boolean> {
  try {
    await prisma.product.delete({
      where: {
        id: productId
      }
    });
    
    return true;
  } catch (error) {
    console.error('Delete product error:', error);
    return false;
  }
}

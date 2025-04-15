'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  description: string;
  category_id: number;
  image_url: string;
  category?: {
    id: number;
    name: string;
  };
  specifications?: {
    id: number;
    product_id: number;
    specification_key: string;
    specification_value: string;
  }[];
}

interface ProductCategory {
  id: number;
  name: string;
}

export default function ArchivioProdotti() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/products/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories);
        
        // Fetch products
        const productsResponse = await fetch('/api/products');
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        const productsData = await productsResponse.json();
        setProducts(productsData.products);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category?.name === selectedCategory);

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Archivio Prodotti</h1>
        <Link
          href="/archivio/nuovo-prodotto"
          className="flex items-center rounded-md bg-red-700 px-4 py-2 text-white hover:bg-red-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuovo Prodotto
        </Link>
      </div>
      
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Catalogo Prodotti Speciali</h2>
        
        <div className="mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-md px-4 py-2 ${
                selectedCategory === 'all'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Tutti
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`rounded-md px-4 py-2 ${
                  selectedCategory === category.name
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>Caricamento prodotti...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-8 text-center">
            <p>Nessun prodotto trovato.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map(product => (
              <div key={product.id} className="overflow-hidden rounded-lg border bg-white shadow-sm">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gray-200 text-gray-500">
                      <span>600 × 400</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="mb-1 text-lg font-semibold">{product.name}</h3>
                  <p className="mb-3 text-sm text-gray-600">{product.description}</p>
                  
                  <h4 className="mb-2 font-medium">Specifiche:</h4>
                  <ul className="space-y-1 text-sm">
                    {product.specifications?.map(spec => (
                      <li key={spec.id}>
                        <span className="font-medium">{spec.specification_key}:</span>{' '}
                        {spec.specification_value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

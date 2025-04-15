'use client';
// ciao

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type Order = {
  id: number;
  status: string;
  [key: string]: any;
};

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    inProgressOrders: 0,
    completedOrders: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch products
        const productsResponse = await fetch('/api/products');
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        const productsData = await productsResponse.json();
        
        // Fetch today's date for orders
        const today = new Date().toISOString().split('T')[0];
        const ordersResponse = await fetch(`/api/orders?date=${today}`);
        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch orders');
        }
        const ordersData = await ordersResponse.json();
        
        const pendingOrders = ordersData.orders.filter((order: Order) => order.status === 'in_attesa').length;
        const inProgressOrders = ordersData.orders.filter((order: Order) => order.status === 'in_produzione').length;
        const completedOrders = ordersData.orders.filter((order: Order) => order.status === 'completato').length;
        
        setStats({
          totalProducts: productsData.products.length,
          pendingOrders,
          inProgressOrders,
          completedOrders
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Caricamento dati...</p>
        </div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="text-sm font-medium text-gray-500">Prodotti Totali</h2>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
              <div className="mt-4">
                <Link href="/archivio" className="text-sm font-medium text-red-700 hover:text-red-800">
                  Visualizza Catalogo →
                </Link>
              </div>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="text-sm font-medium text-gray-500">Ordini in Attesa</h2>
              <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
              <div className="mt-4">
                <Link href="/calendario" className="text-sm font-medium text-red-700 hover:text-red-800">
                  Visualizza Calendario →
                </Link>
              </div>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="text-sm font-medium text-gray-500">Ordini in Produzione</h2>
              <p className="mt-2 text-3xl font-bold text-blue-600">{stats.inProgressOrders}</p>
              <div className="mt-4">
                <Link href="/calendario" className="text-sm font-medium text-red-700 hover:text-red-800">
                  Visualizza Calendario →
                </Link>
              </div>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="text-sm font-medium text-gray-500">Ordini Completati</h2>
              <p className="mt-2 text-3xl font-bold text-green-600">{stats.completedOrders}</p>
              <div className="mt-4">
                <Link href="/calendario" className="text-sm font-medium text-red-700 hover:text-red-800">
                  Visualizza Calendario →
                </Link>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold">Azioni Rapide</h2>
              <div className="space-y-2">
                <Link
                  href="/nuovo-ordine"
                  className="flex items-center rounded-md bg-red-700 px-4 py-2 text-white hover:bg-red-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nuovo Ordine
                </Link>
                
                <Link
                  href="/archivio/nuovo-prodotto"
                  className="flex items-center rounded-md border border-red-700 px-4 py-2 text-red-700 hover:bg-red-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nuovo Prodotto
                </Link>
              </div>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold">Informazioni Sistema</h2>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Nome Applicazione:</span> Book2Latt</p>
                <p><span className="font-medium">Versione:</span> 1.0.0</p>
                <p><span className="font-medium">Stato:</span> <span className="text-green-600">Attivo</span></p>
                <p><span className="font-medium">Ultimo Aggiornamento:</span> {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

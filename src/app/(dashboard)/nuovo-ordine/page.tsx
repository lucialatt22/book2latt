'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NuovoOrdinePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client_name: '',
    order_type: 'negozio',
    due_date: '',
    due_time: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.due_date || !formData.due_time) {
      setError('Titolo, data e ora di scadenza sono obbligatori');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Combine date and time
      const dueDate = new Date(`${formData.due_date}T${formData.due_time}`);
      
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          due_date: dueDate.toISOString(),
          items: [] // Empty items for now, will be added in a separate step
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }
      
      // Redirect to calendar page
      router.push('/calendario');
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Nuovo Ordine</h1>
      
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      
      <div className="rounded-lg bg-white p-6 shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Titolo
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
              placeholder="Titolo dell'ordine"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descrizione
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
              placeholder="Descrizione dell'ordine"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Tipo Ordine
            </label>
            <div className="mt-2 space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="order_type"
                  value="negozio"
                  checked={formData.order_type === 'negozio'}
                  onChange={handleInputChange}
                  className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2">Ordine Negozio</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="order_type"
                  value="speciale"
                  checked={formData.order_type === 'speciale'}
                  onChange={handleInputChange}
                  className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2">Ordine Speciale</span>
              </label>
            </div>
          </div>
          
          {formData.order_type === 'speciale' && (
            <div className="mb-4">
              <label htmlFor="client_name" className="block text-sm font-medium text-gray-700">
                Nome Cliente
              </label>
              <input
                id="client_name"
                name="client_name"
                type="text"
                value={formData.client_name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
                placeholder="Nome del cliente"
              />
            </div>
          )}
          
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
                Scadenza (Data)
              </label>
              <input
                id="due_date"
                name="due_date"
                type="date"
                value={formData.due_date}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
              />
            </div>
            <div>
              <label htmlFor="due_time" className="block text-sm font-medium text-gray-700">
                Scadenza (Ora)
              </label>
              <input
                id="due_time"
                name="due_time"
                type="time"
                value={formData.due_time}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Crea Ordine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

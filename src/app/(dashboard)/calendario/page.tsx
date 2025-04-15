'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Order {
  id: number;
  title: string;
  description: string;
  client_name: string;
  order_type: 'negozio' | 'speciale';
  status: 'in_attesa' | 'in_produzione' | 'in_ritardo' | 'completato';
  due_date: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  notes: string;
  product_name?: string;
}

export default function CalendarioPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [currentYear, setCurrentYear] = useState<number>(0);
  const [calendarDays, setCalendarDays] = useState<Array<{ day: number, date: string, hasOrders: boolean }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Initialize with current date
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    setCurrentYear(year);
    setCurrentMonth(new Date(year, month, 1).toLocaleString('it-IT', { month: 'long' }));
    setSelectedDate(now.toISOString().split('T')[0]);
  }, []);

  // Fetch orders when selected date changes
  useEffect(() => {
    if (selectedDate) {
      fetchOrders(selectedDate);
      generateCalendar(new Date(selectedDate));
    }
  }, [selectedDate]);

  const fetchOrders = async (date: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/orders?date=${date}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data.orders);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching orders');
    } finally {
      setIsLoading(false);
    }
  };

  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Update current month and year
    setCurrentYear(year);
    setCurrentMonth(new Date(year, month, 1).toLocaleString('it-IT', { month: 'long' }));
    
    // Get first day of month and number of days in month
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Adjust for Sunday being 0 in JavaScript but we want Monday as first day
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    // Generate calendar days
    const days = [];
    
    // Add days from previous month
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(year, month - 1, day).toISOString().split('T')[0];
      days.push({ day, date, hasOrders: false });
    }
    
    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i).toISOString().split('T')[0];
      days.push({ day: i, date, hasOrders: false });
    }
    
    // Add days from next month
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i).toISOString().split('T')[0];
      days.push({ day: i, date, hasOrders: false });
    }
    
    setCalendarDays(days);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const date = new Date(selectedDate);
    const month = date.getMonth();
    const year = date.getFullYear();
    
    if (direction === 'prev') {
      date.setMonth(month - 1);
    } else {
      date.setMonth(month + 1);
    }
    
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const selectDay = (date: string) => {
    setSelectedDate(date);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'in_attesa':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_produzione':
        return 'bg-blue-100 text-blue-800';
      case 'in_ritardo':
        return 'bg-red-100 text-red-800';
      case 'completato':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_attesa':
        return 'In Attesa';
      case 'in_produzione':
        return 'In Produzione';
      case 'in_ritardo':
        return 'In Ritardo';
      case 'completato':
        return 'Completato';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Calendario Ordini</h1>
      
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Panoramica Mensile</h2>
        
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <select
              className="rounded-md border border-gray-300 px-3 py-2"
              value={currentMonth}
              onChange={(e) => {
                const months = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
                const monthIndex = months.indexOf(e.target.value);
                if (monthIndex !== -1) {
                  const newDate = new Date(currentYear, monthIndex, 1);
                  setSelectedDate(newDate.toISOString().split('T')[0]);
                }
              }}
            >
              {['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'].map((month) => (
                <option key={month} value={month}>
                  {month.charAt(0).toUpperCase() + month.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              className="rounded-md border border-gray-300 px-3 py-2"
              value={currentYear}
              onChange={(e) => {
                const year = parseInt(e.target.value);
                const date = new Date(selectedDate);
                date.setFullYear(year);
                setSelectedDate(date.toISOString().split('T')[0]);
              }}
            >
              {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="rounded-md border border-gray-300 p-2 hover:bg-gray-100"
            >
              &lt;
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="rounded-md border border-gray-300 p-2 hover:bg-gray-100"
            >
              &gt;
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="grid grid-cols-7 gap-1 text-center">
            <div className="p-2 font-semibold">lun</div>
            <div className="p-2 font-semibold">mar</div>
            <div className="p-2 font-semibold">mer</div>
            <div className="p-2 font-semibold">gio</div>
            <div className="p-2 font-semibold">ven</div>
            <div className="p-2 font-semibold">sab</div>
            <div className="p-2 font-semibold">dom</div>
            
            {calendarDays.map((day, index) => {
              const isCurrentMonth = day.date.startsWith(selectedDate.substring(0, 7));
              const isSelected = day.date === selectedDate;
              
              return (
                <button
                  key={index}
                  onClick={() => selectDay(day.date)}
                  className={`aspect-square rounded-md p-2 text-center ${
                    isSelected
                      ? 'bg-red-700 text-white'
                      : isCurrentMonth
                      ? 'bg-white hover:bg-gray-100'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {day.day}
                </button>
              );
            })}
          </div>
        </div>
        
        <h2 className="mb-4 text-xl font-semibold">
          Dettaglio Ordini - {new Date(selectedDate).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}
        </h2>
        
        {isLoading ? (
          <div className="py-4 text-center">
            <p>Caricamento ordini...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-medium">Ordini Negozio</h3>
              {orders.filter(order => order.order_type === 'negozio').length === 0 ? (
                <p className="py-2 text-gray-500">Nessun ordine negozio per questa data</p>
              ) : (
                <div className="space-y-2">
                  {orders
                    .filter(order => order.order_type === 'negozio')
                    .map(order => (
                      <div key={order.id} className="rounded-md border p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-medium">{order.title}</h4>
                          <span className={`rounded-md px-2 py-1 text-xs font-medium ${getStatusClass(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span className="mr-4">
                            il {new Date(order.due_date).toLocaleDateString('it-IT')} alle {formatDate(order.due_date)}
                          </span>
                          <span>Ordine Negozio</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            
            <div>
              <h3 className="mb-2 text-lg font-medium">Ordini Speciali</h3>
              {orders.filter(order => order.order_type === 'speciale').length === 0 ? (
                <p className="py-2 text-gray-500">Nessun ordine cliente per questa data</p>
              ) : (
                <div className="space-y-2">
                  {orders
                    .filter(order => order.order_type === 'speciale')
                    .map(order => (
                      <div key={order.id} className="rounded-md border p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-medium">{order.title}</h4>
                          <span className={`rounded-md px-2 py-1 text-xs font-medium ${getStatusClass(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span className="mr-4">
                            il {new Date(order.due_date).toLocaleDateString('it-IT')} alle {formatDate(order.due_date)}
                          </span>
                          <span>{order.client_name}</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

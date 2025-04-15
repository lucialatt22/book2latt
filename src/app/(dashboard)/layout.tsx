'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import AuthMiddleware from './layout-auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthMiddleware>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </AuthMiddleware>
  );
}

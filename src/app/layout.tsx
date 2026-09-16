'use client';
import React from 'react';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { NotificationCenter } from '@/components/NotificationCenter';

function NavContent() {
  const { user, logout } = useAuth();

  const canAccessAdmin = user && ['admin', 'lab_staff'].includes(user.role);

  return (
    <nav className="bg-blue-700 text-white p-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold flex items-center gap-2">
          <span className="bg-white text-blue-700 p-1 rounded">POCT</span>
          <span>รพ.พุทธชินราช</span>
        </Link>
        <div className="flex gap-4 text-sm items-center">
          <Link href="/dashboard" className="hover:underline">หน้าหลัก</Link>
          <Link href="/iqc" className="hover:underline">บันทึก IQC</Link>
          {canAccessAdmin && (
            <>
              <Link href="/equipment" className="hover:underline">ทะเบียนเครื่อง</Link>
              <Link href="/eqa" className="hover:underline">บันทึก EQA</Link>
              <Link href="/competency" className="hover:underline">สมรรถนะ</Link>
              <Link href="/maintenance" className="hover:underline">บำรุงรักษา</Link>
              <Link href="/reports" className="hover:underline">รายงาน</Link>
            </>
          )}
          <NotificationCenter />
          {user && (
            <button
              onClick={logout}
              className="ml-2 px-3 py-1 bg-blue-800 rounded-lg hover:bg-blue-900 transition-colors border border-blue-600"
            >
              ออกจากระบบ ({user.name})
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <NavContent />
        <main className="max-w-6xl mx-auto p-4 pb-20">
          {children}
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 md:hidden">
          <Link href="/dashboard" className="flex flex-col items-center text-xs gap-1 text-slate-600 hover:text-blue-600">
            <div className="w-6 h-6 bg-slate-200 rounded" />
            <span>หน้าหลัก</span>
          </Link>
          <Link href="/equipment" className="flex flex-col items-center text-xs gap-1 text-slate-600 hover:text-blue-600">
            <div className="w-6 h-6 bg-slate-200 rounded" />
            <span>เครื่องมือ</span>
          </Link>
          <Link href="/iqc" className="flex flex-col items-center text-xs gap-1 text-slate-600 hover:text-blue-600">
            <div className="w-6 h-6 bg-slate-200 rounded" />
            <span>บันทึก IQC</span>
          </Link>
        </div>
      </div>
    </AuthProvider>
  );
}

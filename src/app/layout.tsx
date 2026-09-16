import React from 'react';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Mobile Navigation */}
      <nav className="bg-blue-700 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-lg font-bold flex items-center gap-2">
            <span className="bg-white text-blue-700 p-1 rounded">POCT</span>
            <span>รพ.พุทธชินราช</span>
          </Link>
          <div className="flex gap-4 text-sm">
            <Link href="/dashboard" className="hover:underline">หน้าหลัก</Link>
            <Link href="/equipment" className="hover:underline">ทะเบียนเครื่อง</Link>
            <Link href="/iqc" className="hover:underline">บันทึก IQC</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 pb-20">
        {children}
      </main>

      {/* Bottom Navigation for Mobile */}
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
  );
}

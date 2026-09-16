'use client';
import React, { useEffect, useState } from 'react';
import { Card, Badge } from '@/components/ui/Common';
import { poctApi } from '@/lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await poctApi('getDashboardStats');
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <div className="flex justify-center p-10 text-slate-500">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="p-10 text-red-500">เกิดข้อผิดพลาด: {error}</div>;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">ภาพรวมระบบ POCT</h1>
        <p className="text-slate-500">สรุปสถานะการควบคุมคุณภาพและเครื่องมือ</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <div className="text-sm text-slate-500 font-medium">เครื่องมือทั้งหมด</div>
          <div className="text-3xl font-bold text-slate-800">{stats?.total || 0} <span className="text-sm font-normal">เครื่อง</span></div>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <div className="text-sm text-slate-500 font-medium">พร้อมใช้งาน</div>
          <div className="text-3xl font-bold text-slate-800">{stats?.active || 0} <span className="text-sm font-normal">เครื่อง</span></div>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <div className="text-sm text-slate-500 font-medium">ใกล้ครบกำหนดสอบเทียบ</div>
          <div className="text-3xl font-bold text-yellow-600">{stats?.warning || 0} <span className="text-sm font-normal">เครื่อง</span></div>
          <Badge color="yellow">ภายใน 30 วัน</Badge>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <div className="text-sm text-slate-500 font-medium">เลยกำหนดสอบเทียบ</div>
          <div className="text-3xl font-bold text-red-600">{stats?.overdue || 0} <span className="text-sm font-normal">เครื่อง</span></div>
          <Badge color="red">ต้องดำเนินการด่วน</Badge>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            ⚠️ รายการที่ต้องติดตาม
          </h2>
          <div className="space-y-3">
            {stats?.overdue > 0 ? (
              <div className="p-3 bg-red-50 rounded-lg border border-red-100 flex justify-between items-center">
                <span className="text-red-700 text-sm">มีเครื่องมือที่เลยกำหนดสอบเทียบ</span>
                <Badge color="red">{stats.overdue} รายการ</Badge>
              </div>
            ) : (
              <div className="p-3 bg-green-50 rounded-lg border border-green-100 text-green-700 text-sm">
                ไม่มีรายการเลยกำหนดสอบเทียบ
              </div>
            )}
            {stats?.warning > 0 && (
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100 flex justify-between items-center">
                <span className="text-yellow-700 text-sm">มีเครื่องมือที่ใกล้ครบกำหนดสอบเทียบ</span>
                <Badge color="yellow">{stats.warning} รายการ</Badge>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">ทางลัดการทำงาน</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/equipment" className="p-3 bg-slate-100 rounded-lg text-center text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-all">
              จัดการทะเบียนเครื่อง
            </Link>
            <Link href="/iqc" className="p-3 bg-slate-100 rounded-lg text-center text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-all">
              บันทึกผล IQC
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Since I can't use Link without importing it
import Link from 'next/link';

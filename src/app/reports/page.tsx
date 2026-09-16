'use client';
import React, { useEffect, useState } from 'react';
import { Card, Button } from '@/components/ui/Common';
import { poctApi } from '@/lib/api';

export default function ReportsPage() {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const data = await poctApi('getReports');
        setReportData(data);
      } catch (err) {
        alert('โหลดรายงานไม่สำเร็จ');
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const exportToCSV = (data: any, filename: string) => {
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(h => `"${row[h]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    link.click();
  };

  if (loading) return <div className="flex justify-center p-10 text-slate-500">กำลังโหลดรายงาน...</div>;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">รายงานและส่งออกข้อมูล</h1>
          <p className="text-slate-500">สรุปผลการดำเนินงานประจำเดือน/ไตรมาส</p>
        </div>
        <Button onClick={() => alert('กำลังเตรียมข้อมูล Export...')} variant="secondary">
          Export All CSV
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">สถานะเครื่องมือ</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>ทั้งหมด:</span>
              <span className="font-bold">{reportData?.equipmentSummary.total} เครื่อง</span>
            </div>
            <div className="flex justify-between text-sm text-red-600">
              <span>เลยกำหนดสอบเทียบ:</span>
              <span className="font-bold">{reportData?.equipmentSummary.overdue} เครื่อง</span>
            </div>
            <div className="flex justify-between text-sm text-yellow-600">
              <span>ใกล้ครบกำหนด:</span>
              <span className="font-bold">{reportData?.equipmentSummary.warning} เครื่อง</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">คุณภาพภายใน (IQC) 30 วัน</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>จำนวนการทดสอบ:</span>
              <span className="font-bold">{reportData?.iqcSummary.totalTests} ครั้ง</span>
            </div>
            <div className="flex justify-between text-sm text-red-600">
              <span>ผลผิดปกติ:</span>
              <span className="font-bold">{reportData?.iqcSummary.fails} ครั้ง</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-blue-600 border-t pt-2">
              <span>อัตราการผ่าน:</span>
              <span>{reportData?.iqcSummary.passRate}%</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">คุณภาพภายนอก (EQA)</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>จำนวนรายการทั้งหมด:</span>
              <span className="font-bold">{reportData?.eqaSummary.total} รายการ</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>ผ่าน:</span>
              <span className="font-bold">{reportData?.eqaSummary.pass} รายการ</span>
            </div>
            <div className="flex justify-between text-sm text-red-600">
              <span>ไม่ผ่าน:</span>
              <span className="font-bold">{reportData?.eqaSummary.fail} รายการ</span>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-4">สรุปเพื่อนำเสนอคณะกรรมการ POCT</h2>
        <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-600 leading-relaxed">
          ในรอบ 30 วันที่ผ่านมา ระบบมีการบันทึกผล IQC ทั้งหมด {reportData?.iqcSummary.totalTests} ครั้ง
          โดยมีผลการทดสอบที่ผิดปกติ {reportData?.iqcSummary.fails} ครั้ง
          คิดเป็นอัตราการผ่าน {reportData?.iqcSummary.passRate}%
          ในส่วนของเครื่องมือ มีเครื่องที่เลยกำหนดสอบเทียบ {reportData?.equipmentSummary.overdue} เครื่อง
          ซึ่งจำเป็นต้องได้รับการดำเนินการตรวจสอบและสอบเทียบใหม่โดยด่วน
        </div>
      </Card>
    </div>
  );
}

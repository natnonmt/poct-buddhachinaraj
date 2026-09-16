'use client';
import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Badge } from '@/components/ui/Common';
import { poctApi } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function MaintenanceContent() {
  const [equipment, setEquipment] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    equipment_id: '',
    maintenance_date: new Date().toISOString().split('T')[0],
    performed_by: '',
    findings: '',
    next_due_date: '',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await poctApi('getEquipment');
        setEquipment(data);
      } catch (err) {
        alert('โหลดข้อมูลไม่สำเร็จ');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function handleSave() {
    if (!selectedId) return alert('กรุณาเลือกเครื่องมือ');
    try {
      await poctApi('addMaintenance', { ...formData, equipment_id: selectedId });
      alert('บันทึกการบำรุงรักษาสำเร็จ');
      setFormData({
        ...formData,
        findings: '',
        next_due_date: '',
      });
    } catch (err: any) {
      alert('บันทึกไม่สำเร็จ: ' + err.message);
    }
  }

  if (loading) return <div className="flex justify-center p-10 text-slate-500">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">บันทึกบำรุงรักษาเชิงป้องกัน (PM)</h1>
        <p className="text-slate-500">ติดตามการบำรุงรักษาเครื่องมือให้พร้อมใช้งานตามมาตรฐาน</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">เลือกเครื่องมือ</h2>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {equipment.map((item: any) => (
              <div
                key={item.equipment_id}
                onClick={() => {
                  setSelectedId(item.equipment_id);
                  setFormData({...formData, equipment_id: item.equipment_id});
                }}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedId === item.equipment_id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-medium text-sm">{item.test_program}</div>
                <div className="text-xs text-slate-500">{item.serial_number} - {item.department}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          {selectedId ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">แบบฟอร์มบันทึก PM</h2>
                <Badge color="blue">{equipment.find((e: any) => e.equipment_id === selectedId)?.test_program}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <Input label="วันที่บำรุงรักษา" type="date" value={formData.maintenance_date} onChange={(e: any) => setFormData({...formData, maintenance_date: e.target.value})} />
                <Input label="ผู้ดำเนินการ" value={formData.performed_by} onChange={(e: any) => setFormData({...formData, performed_by: e.target.value})} />
                <Input label="กำหนดบำรุงรักษาครั้งถัดไป" type="date" value={formData.next_due_date} onChange={(e: any) => setFormData({...formData, next_due_date: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-600">รายละเอียดการตรวจพบ/การดำเนินการ (Findings)</label>
                <textarea
                  className="px-3 py-2 border border-slate-300 rounded-lg outline-none h-32"
                  value={formData.findings}
                  onChange={(e) => setFormData({...formData, findings: e.target.value})}
                  placeholder="ระบุสิ่งที่ตรวจพบและสิ่งที่ได้ดำเนินการแก้ไข..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setFormData({...formData, findings: '', next_due_date: ''})}>ล้างข้อมูล</Button>
                <Button onClick={handleSave}>บันทึกข้อมูล PM</Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20 text-center">
              <div className="text-4xl mb-4">🛠️</div>
              <p>กรุณาเลือกเครื่องมือจากรายการด้านซ้ายเพื่อเริ่มบันทึกการบำรุงรักษา</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <MaintenanceContent />
    </ProtectedRoute>
  );
}

'use client';
import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Badge } from '@/components/ui/Common';
import { poctApi } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function IQCContent() {
  const [equipment, setEquipment] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    equipment_id: '',
    test_date: new Date().toISOString().split('T')[0],
    material_code: '',
    material_level: 'Level 1',
    material_expiry: '',
    measured_value: '',
    target_range: '',
    rule_evaluation: 'ผ่าน',
    operator: '',
    corrective_action: '',
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
      await poctApi('addIQC', { ...formData, equipment_id: selectedId });
      alert('บันทึกผล IQC สำเร็จ');
      setFormData({
        ...formData,
        measured_value: '',
        corrective_action: '',
      });
    } catch (err: any) {
      alert('บันทึกไม่สำเร็จ: ' + err.message);
    }
  }

  if (loading) return <div className="flex justify-center p-10 text-slate-500">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">บันทึกผล IQC</h1>
        <p className="text-slate-500">บันทึกการควบคุมคุณภาพภายในรายวัน</p>
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
                <h2 className="text-lg font-semibold">แบบฟอร์มบันทึกผล</h2>
                <Badge color="blue">{equipment.find((e: any) => e.equipment_id === selectedId)?.test_program}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <Input label="วันที่ทดสอบ" type="date" value={formData.test_date} onChange={(e: any) => setFormData({...formData, test_date: e.target.value})} />
                <Input label="รหัสวัสดุ QC (Lot)" value={formData.material_code} onChange={(e: any) => setFormData({...formData, material_code: e.target.value})} />
                <div className="flex flex-col gap-1 mb-4">
                  <label className="text-sm font-medium text-slate-600">ระดับ QC</label>
                  <select
                    className="px-3 py-2 border border-slate-300 rounded-lg outline-none"
                    value={formData.material_level}
                    onChange={(e) => setFormData({...formData, material_level: e.target.value})}
                  >
                    <option>Level 1</option>
                    <option>Level 2</option>
                    <option>Level 3</option>
                  </select>
                </div>
                <Input label="วันหมดอายุวัสดุ" type="date" value={formData.material_expiry} onChange={(e: any) => setFormData({...formData, material_expiry: e.target.value})} />
                <Input label="ค่าที่วัดได้ (Measured Value)" type="number" value={formData.measured_value} onChange={(e: any) => setFormData({...formData, measured_value: e.target.value})} />
                <Input label="ช่วงค่าที่ยอมรับ (Target Range)" placeholder="เช่น 90-110" value={formData.target_range} onChange={(e: any) => setFormData({...formData, target_range: e.target.value})} />
                <div className="flex flex-col gap-1 mb-4">
                  <label className="text-sm font-medium text-slate-600">การประเมินผล</label>
                  <select
                    className="px-3 py-2 border border-slate-300 rounded-lg outline-none"
                    value={formData.rule_evaluation}
                    onChange={(e) => setFormData({...formData, rule_evaluation: e.target.value})}
                  >
                    <option value="ผ่าน">ผ่าน (In Control)</option>
                    <option value="ผิดกฎ 1-2s">ผิดกฎ 1-2s (Warning)</option>
                    <option value="ผิดกฎ 1-3s">ผิดกฎ 1-3s (Out of Control)</option>
                    <option value="ผิดกฎ 2-2s">ผิดกฎ 2-2s (Out of Control)</option>
                    <option value="ผิดกฎ R-4s">ผิดกฎ R-4s (Out of Control)</option>
                    <option value="ผิดกฎ 4-1s">ผิดกฎ 4-1s (Out of Control)</option>
                    <option value="ผิดกฎ 10-x">ผิดกฎ 10-x (Out of Control)</option>
                  </select>
                </div>
                <Input label="ผู้ปฏิบัติงาน" value={formData.operator} onChange={(e: any) => setFormData({...formData, operator: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-600">การแก้ไขเมื่อผลผิดปกติ (Corrective Action)</label>
                <textarea
                  className="px-3 py-2 border border-slate-300 rounded-lg outline-none h-24"
                  value={formData.corrective_action}
                  onChange={(e) => setFormData({...formData, corrective_action: e.target.value})}
                  placeholder="ระบุสาเหตุและการแก้ไข..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setFormData({...formData, measured_value: '', corrective_action: ''})}>ล้างข้อมูล</Button>
                <Button onClick={handleSave}>บันทึกข้อมูล IQC</Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20 text-center">
              <div className="text-4xl mb-4">📋</div>
              <p>กรุณาเลือกเครื่องมือจากรายการด้านซ้ายเพื่อเริ่มบันทึกข้อมูล</p>
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
      <IQCContent />
    </ProtectedRoute>
  );
}

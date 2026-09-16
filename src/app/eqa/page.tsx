'use client';
import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Badge } from '@/components/ui/Common';
import { poctApi } from '@/lib/api';

export default function EQAPage() {
  const [equipment, setEquipment] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    equipment_id: '',
    test_program: '',
    provider: '',
    round_date: '',
    due_date: '',
    result: '',
    score: '',
    pass_fail: 'ผ่าน',
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
      await poctApi('addEQA', { ...formData, equipment_id: selectedId });
      alert('บันทึกผล EQA สำเร็จ');
      setFormData({
        ...formData,
        result: '',
        score: '',
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
        <h1 className="text-2xl font-bold text-slate-800">บันทึกผล EQA</h1>
        <p className="text-slate-500">การประเมินคุณภาพภายนอก (External Quality Assessment)</p>
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
                  setFormData({...formData, equipment_id: item.equipment_id, test_program: item.test_program});
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
                <h2 className="text-lg font-semibold">แบบฟอร์มบันทึกผล EQA</h2>
                <Badge color="blue">{equipment.find((e: any) => e.equipment_id === selectedId)?.test_program}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <Input label="หน่วยงานผู้จัดโปรแกรม (Provider)" value={formData.provider} onChange={(e: any) => setFormData({...formData, provider: e.target.value})} />
                <div className="hidden">
                  <Input label="โปรแกรมการทดสอบ" value={formData.test_program} />
                </div>
                <Input label="วันที่รับรอบ (Round Date)" type="date" value={formData.round_date} onChange={(e: any) => setFormData({...formData, round_date: e.target.value})} />
                <Input label="วันที่ต้องส่งผล (Due Date)" type="date" value={formData.due_date} onChange={(e: any) => setFormData({...formData, due_date: e.target.value})} />
                <Input label="ผลการทดสอบ (Result)" value={formData.result} onChange={(e: any) => setFormData({...formData, result: e.target.value})} />
                <Input label="คะแนน (Score)" type="number" value={formData.score} onChange={(e: any) => setFormData({...formData, score: e.target.value})} />
                <div className="flex flex-col gap-1 mb-4">
                  <label className="text-sm font-medium text-slate-600">ผลประเมิน</label>
                  <select
                    className="px-3 py-2 border border-slate-300 rounded-lg outline-none"
                    value={formData.pass_fail}
                    onChange={(e) => setFormData({...formData, pass_fail: e.target.value})}
                  >
                    <option value="ผ่าน">ผ่าน (Pass)</option>
                    <option value="ไม่ผ่าน">ไม่ผ่าน (Fail)</option>
                    <option value="ก้ำกึ่ง">ก้ำกึ่ง (Borderline)</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-600">การแก้ไขเมื่อไม่ผ่าน (Corrective Action)</label>
                <textarea
                  className="px-3 py-2 border border-slate-300 rounded-lg outline-none h-24"
                  value={formData.corrective_action}
                  onChange={(e) => setFormData({...formData, corrective_action: e.target.value})}
                  placeholder="ระบุสาเหตุและการแก้ไข..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setFormData({...formData, result: '', score: '', corrective_action: ''})}>ล้างข้อมูล</Button>
                <Button onClick={handleSave}>บันทึกข้อมูล EQA</Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20 text-center">
              <div className="text-4xl mb-4">📊</div>
              <p>กรุณาเลือกเครื่องมือจากรายการด้านซ้ายเพื่อเริ่มบันทึกข้อมูล EQA</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

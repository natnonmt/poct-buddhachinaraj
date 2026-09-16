'use client';
import React, { useEffect, useState } from 'react';
import { Card, Button, Badge, Input } from '@/components/ui/Common';
import { poctApi } from '@/lib/api';

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    test_program: '',
    brand: '',
    model: '',
    serial_number: '',
    asset_no: '',
    department: '',
    responsible_person: '',
    received_date: '',
    warranty_expiry: '',
    last_calibration_date: '',
    calibration_interval_months: '12',
    calibrated_by: '',
    calibration_result: 'ผ่าน',
    status: 'ใช้งาน',
  });

  async function loadEquipment() {
    setLoading(true);
    try {
      const data = await poctApi('getEquipment');
      setEquipment(data);
    } catch (err) {
      alert('โหลดข้อมูลไม่สำเร็จ: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEquipment();
  }, []);

  async function handleSave() {
    try {
      await poctApi('addEquipment', formData);
      setIsAdding(false);
      setFormData({
        test_program: '', brand: '', model: '', serial_number: '', asset_no: '',
        department: '', responsible_person: '', received_date: '', warranty_expiry: '',
        last_calibration_date: '', calibration_interval_months: '12',
        calibrated_by: '', calibration_result: 'ผ่าน', status: 'ใช้งาน',
      });
      await loadEquipment();
    } catch (err: any) {
      alert('บันทึกไม่สำเร็จ: ' + err.message);
    }
  }

  if (loading) return <div className="flex justify-center p-10 text-slate-500">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <header>
          <h1 className="text-2xl font-bold text-slate-800">ทะเบียนเครื่องมือ POCT</h1>
          <p className="text-slate-500">จัดการรายการเครื่องมือและสถานะการสอบเทียบ</p>
        </header>
        <Button onClick={() => setIsAdding(true)} className="hidden sm:block">
          + เพิ่มเครื่องมือ
        </Button>
      </div>

      {isAdding && (
        <Card className="animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">เพิ่มเครื่องมือใหม่</h2>
            <Button variant="secondary" onClick={() => setIsAdding(false)}>ยกเลิก</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
            <Input label="โปรแกรมทดสอบ" placeholder="เช่น Glucose" value={formData.test_program} onChange={(e: any) => setFormData({...formData, test_program: e.target.value})} />
            <Input label="ยี่ห้อ" placeholder="Brand" value={formData.brand} onChange={(e: any) => setFormData({...formData, brand: e.target.value})} />
            <Input label="รุ่น" placeholder="Model" value={formData.model} onChange={(e: any) => setFormData({...formData, model: e.target.value})} />
            <Input label="Serial Number" value={formData.serial_number} onChange={(e: any) => setFormData({...formData, serial_number: e.target.value})} />
            <Input label="หมายเลขครุภัณฑ์" value={formData.asset_no} onChange={(e: any) => setFormData({...formData, asset_no: e.target.value})} />
            <Input label="หน่วยงาน" value={formData.department} onChange={(e: any) => setFormData({...formData, department: e.target.value})} />
            <Input label="ผู้รับผิดชอบ" value={formData.responsible_person} onChange={(e: any) => setFormData({...formData, responsible_person: e.target.value})} />
            <Input label="วันที่ได้รับ" type="date" value={formData.received_date} onChange={(e: any) => setFormData({...formData, received_date: e.target.value})} />
            <Input label="วันหมดประกัน" type="date" value={formData.warranty_expiry} onChange={(e: any) => setFormData({...formData, warranty_expiry: e.target.value})} />
            <Input label="วันที่สอบเทียบล่าสุด" type="date" value={formData.last_calibration_date} onChange={(e: any) => setFormData({...formData, last_calibration_date: e.target.value})} />
            <Input label="รอบสอบเทียบ (เดือน)" type="number" value={formData.calibration_interval_months} onChange={(e: any) => setFormData({...formData, calibration_interval_months: e.target.value})} />
            <Input label="ผู้สอบเทียบ" value={formData.calibrated_by} onChange={(e: any) => setFormData({...formData, calibrated_by: e.target.value})} />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={() => setIsAdding(false)}>ยกเลิก</Button>
            <Button onClick={handleSave}>บันทึกข้อมูล</Button>
          </div>
        </Card>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse bg-white rounded-xl shadow-sm overflow-hidden">
          <thead className="bg-slate-100 text-slate-600 text-sm">
            <tr>
              <th className="p-4 font-semibold">โปรแกรม</th>
              <th className="p-4 font-semibold">Serial Number</th>
              <th className="p-4 font-semibold">หน่วยงาน</th>
              <th className="p-4 font-semibold">กำหนดสอบเทียบถัดไป</th>
              <th className="p-4 font-semibold">สถานะ</th>
              <th className="p-4 font-semibold">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {equipment.map((item: any) => {
              const nextDue = new Date(item.next_calibration_due);
              const now = new Date();
              let badgeColor = 'green';
              if (nextDue < now) badgeColor = 'red';
              else if (nextDue < new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)) badgeColor = 'yellow';

              return (
                <tr key={item.equipment_id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium">{item.test_program}</td>
                  <td className="p-4 text-slate-500">{item.serial_number}</td>
                  <td className="p-4 text-slate-500">{item.department}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {item.next_calibration_due ? new Date(item.next_calibration_due).toLocaleDateString('th-TH') : '-'}
                      <Badge color={badgeColor}>{badgeColor === 'red' ? 'เลยกำหนด' : badgeColor === 'yellow' ? 'ใกล้ครบ' : 'ปกติ'}</Badge>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge color={item.status === 'ใช้งาน' ? 'green' : 'red'}>{item.status}</Badge>
                  </td>
                  <td className="p-4">
                    <Button variant="secondary" className="text-xs px-2 py-1">แก้ไข</Button>
                  </td>
                </tr>
              );
            })}
            {equipment.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-slate-400">ไม่พบข้อมูลเครื่องมือ</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Add Button */}
      <div className="sm:hidden fixed bottom-20 right-6">
        <Button onClick={() => setIsAdding(true)} className="shadow-lg rounded-full w-14 h-14 flex items-center justify-center text-2xl">+</Button>
      </div>
    </div>
  );
}

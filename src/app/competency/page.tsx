'use client';
import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Badge } from '@/components/ui/Common';
import { poctApi } from '@/lib/api';

export default function CompetencyPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    staff_name: '',
    department: '',
    test_program: '',
    training_date: '',
    assessor: '',
    result: 'ผ่าน',
    next_due_date: '',
  });

  async function loadCompetencies() {
    setLoading(true);
    try {
      const data = await poctApi('getCompetency');
      setRecords(data);
    } catch (err) {
      alert('โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCompetencies();
  }, []);

  async function handleSave() {
    try {
      await poctApi('addCompetency', formData);
      setIsAdding(false);
      setFormData({
        staff_name: '', department: '', test_program: '',
        training_date: '', assessor: '', result: 'ผ่าน', next_due_date: '',
      });
      await loadCompetencies();
    } catch (err: any) {
      alert('บันทึกไม่สำเร็จ: ' + err.message);
    }
  }

  if (loading) return <div className="flex justify-center p-10 text-slate-500">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <header>
          <h1 className="text-2xl font-bold text-slate-800">ประเมินสมรรถนะผู้ปฏิบัติงาน</h1>
          <p className="text-slate-500">ติดตามการฝึกอบรมและการประเมินความสามารถรายปี</p>
        </header>
        <Button onClick={() => setIsAdding(true)} className="hidden sm:block">
          + เพิ่มบันทึก
        </Button>
      </div>

      {isAdding && (
        <Card className="animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">บันทึกการประเมินสมรรถนะ</h2>
            <Button variant="secondary" onClick={() => setIsAdding(false)}>ยกเลิก</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
            <Input label="ชื่อ-นามสกุล ผู้รับการประเมิน" value={formData.staff_name} onChange={(e: any) => setFormData({...formData, staff_name: e.target.value})} />
            <Input label="หน่วยงาน/หอผู้ป่วย" value={formData.department} onChange={(e: any) => setFormData({...formData, department: e.target.value})} />
            <Input label="โปรแกรมการทดสอบ" placeholder="เช่น Glucose" value={formData.test_program} onChange={(e: any) => setFormData({...formData, test_program: e.target.value})} />
            <Input label="วันที่ฝึกอบรม/ประเมิน" type="date" value={formData.training_date} onChange={(e: any) => setFormData({...formData, training_date: e.target.value})} />
            <Input label="ผู้ประเมิน" value={formData.assessor} onChange={(e: any) => setFormData({...formData, assessor: e.target.value})} />
            <div className="flex flex-col gap-1 mb-4">
              <label className="text-sm font-medium text-slate-600">ผลการประเมิน</label>
              <select
                className="px-3 py-2 border border-slate-300 rounded-lg outline-none"
                value={formData.result}
                onChange={(e) => setFormData({...formData, result: e.target.value})}
              >
                <option value="ผ่าน">ผ่าน</option>
                <option value="ไม่ผ่าน">ไม่ผ่าน</option>
              </select>
            </div>
            <Input label="กำหนดประเมินครั้งถัดไป" type="date" value={formData.next_due_date} onChange={(e: any) => setFormData({...formData, next_due_date: e.target.value})} />
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
              <th className="p-4 font-semibold">ชื่อ-นามสกุล</th>
              <th className="p-4 font-semibold">หน่วยงาน</th>
              <th className="p-4 font-semibold">โปรแกรม</th>
              <th className="p-4 font-semibold">วันที่ประเมิน</th>
              <th className="p-4 font-semibold">ผลลัพธ์</th>
              <th className="p-4 font-semibold">กำหนดครั้งถัดไป</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {records.map((record: any) => {
              const nextDue = new Date(record.next_due_date);
              const now = new Date();
              let badgeColor = 'green';
              if (nextDue < now) badgeColor = 'red';
              else if (nextDue < new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)) badgeColor = 'yellow';

              return (
                <tr key={record.competency_id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium">{record.staff_name}</td>
                  <td className="p-4 text-slate-500">{record.department}</td>
                  <td className="p-4 text-slate-500">{record.test_program}</td>
                  <td className="p-4">{record.training_date ? new Date(record.training_date).toLocaleDateString('th-TH') : '-'}</td>
                  <td className="p-4">
                    <Badge color={record.result === 'ผ่าน' ? 'green' : 'red'}>{record.result}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {record.next_due_date ? new Date(record.next_due_date).toLocaleDateString('th-TH') : '-'}
                      <Badge color={badgeColor}>{badgeColor === 'red' ? 'เลยกำหนด' : badgeColor === 'yellow' ? 'ใกล้ครบ' : 'ปกติ'}</Badge>
                    </div>
                  </td>
                </tr>
              );
            })}
            {records.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-slate-400">ไม่พบข้อมูลการประเมินสมรรถนะ</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden fixed bottom-20 right-6">
        <Button onClick={() => setIsAdding(true)} className="shadow-lg rounded-full w-14 h-14 flex items-center justify-center text-2xl">+</Button>
      </div>
    </div>
  );
}

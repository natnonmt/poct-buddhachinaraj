'use client';
import React, { useState } from 'react';
import { Card, Button, Input } from '@/components/ui/Common';
import { poctApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await poctApi('validateUser', { password });
      if (result.status === 'success') {
        login(result.user);
      } else {
        setError(result.message || 'รหัสผ่านไม่ถูกต้อง');
      }
    } catch (err: any) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🏥</div>
          <h1 className="text-2xl font-bold text-slate-800">เข้าสู่ระบบ POCT</h1>
          <p className="text-slate-500">รพ.พุทธชินราช พิษณุโลก</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="PIN หรือ Email"
            type="password"
            placeholder="กรอกรหัสผ่านของคุณ"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-3 text-lg"
            disabled={loading}
          >
            {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </Button>
          {/* To make the button actually submit the form, I'll change the button type to submit */}
        </form>
      </Card>
    </div>
  );
}

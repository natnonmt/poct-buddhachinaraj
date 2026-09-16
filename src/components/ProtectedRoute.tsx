'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      router.push('/dashboard'); // Redirect to dashboard if role is not allowed
    }
  }, [user, isLoading, router, allowedRoles]);

  if (isLoading || !user) {
    return <div className="flex justify-center p-10 text-slate-500">กำลังตรวจสอบสิทธิ์...</div>;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div className="flex justify-center p-10 text-red-500">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</div>;
  }

  return <>{children}</>;
}

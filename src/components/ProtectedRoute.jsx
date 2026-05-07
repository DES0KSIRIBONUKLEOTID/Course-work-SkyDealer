import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user } = useAuth();

  // 1. Якщо користувач взагалі не увійшов у систему -> відправляємо на сторінку логіну
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Якщо сторінка тільки для Адміна, а зайшов звичайний юзер -> відправляємо на Головну
  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />; // Можна також зробити сторінку "Доступ заборонено"
  }
  
  return children;
}
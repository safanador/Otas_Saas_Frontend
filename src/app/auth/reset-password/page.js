// app/reset-password/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { fetchData } from '@/services/api';
import endpoints from '@/lib/endpoints';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();


  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {

      let form = {
        "token": token,
        "newPassword": newPassword
      }
      const response = await fetchData(endpoints.auth_reset_password(), {
        method: 'POST',
        body: JSON.stringify(form),
      });

      setSuccess(response.data.message || 'Contraseña restablecida con éxito');
    } catch (err) {
      setError(err.response?.data?.message || 'Ocurrió un error al restablecer la contraseña');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-md p-6">
        <h1 className="text-xl font-semibold text-center mb-4">Restablecer Contraseña</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              Nueva Contraseña
            </label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Escribe tu nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Confirmar Contraseña
            </label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirma tu nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Restablecer Contraseña
          </Button>
        </form>
        <div className='my-4'>
        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="mb-4">
            {success}
          </Alert>
        )}
        </div>
        <div className='flex justify-center my-4'>
          <Button variant="link" onClick={() => router.push("/auth/login")}>
            Volver a Iniciar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}

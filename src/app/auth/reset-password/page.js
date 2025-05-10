'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { fetchData } from '@/services/api';
import endpoints from '@/lib/endpoints';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';
import landingAssets from '@/lib/landingAssets';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    newPassword: null,
    confirmPassword: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({
      newPassword: null,
      confirmPassword: null
    });

    if (newPassword !== confirmPassword) {
      setFieldErrors({
        ...fieldErrors,
        confirmPassword: 'Las contraseñas no coinciden'
      });
      setLoading(false);
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

      if(response.error) {
        console.log(response.error);
        setError(typeof response.error === 'string' ? response.error : 'Error al restablecer la contraseña');
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error("Error during password reset: ", err);
      setError('Ocurrió un error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  // Si no hay token, mostrar mensaje de error
  if (!token) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-teal-500 to-teal-700 items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-2xl bg-white rounded-xl border-0">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-t-xl"></div>
          
          <CardHeader className="pt-8 pb-4">
            <div className="flex justify-center mb-6">
              <div onClick={() => router.push('/')} className="relative cursor-pointer w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <Image 
                  src={landingAssets.logo} 
                  alt="Cloudnel Logo" 
                  width={40} 
                  height={40} 
                  className="rounded-md"
                />
              </div>
            </div>
            <h1 className="text-center text-2xl font-bold text-gray-800">Enlace inválido</h1>
            <p className="text-center text-gray-500 mt-2">El enlace para restablecer la contraseña no es válido o ha expirado</p>
          </CardHeader>
          
          <CardContent className="pb-2">
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
              </svg>
              <span>Se requiere un token válido para restablecer la contraseña</span>
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={() => router.push('/auth/forgot-password')}  
                className="w-full py-6 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                Solicitar nuevo enlace
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="pt-2 pb-8 flex flex-col items-center">
            <p className="text-sm text-gray-600 mt-6">
              <Link href="/auth/login" className="text-teal-600 hover:text-teal-800 font-medium transition-colors flex items-center">
                <ArrowLeft size={16} className="mr-1" />
                Volver a iniciar sesión
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-teal-500 to-teal-700">
      {/* Left side: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-2xl bg-white rounded-xl border-0">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-t-xl"></div>
          
          <CardHeader className="pt-8 pb-4">
            <div className="flex justify-center mb-6">
              <div onClick={() => router.push('/')} className="relative cursor-pointer w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <Image 
                  src={landingAssets.logo} 
                  alt="Cloudnel Logo" 
                  width={40} 
                  height={40} 
                  className="rounded-md"
                />
              </div>
            </div>
            <h1 className="text-center text-2xl font-bold text-gray-800">Restablecer contraseña</h1>
            <p className="text-center text-gray-500 mt-2">Crea una nueva contraseña segura para tu cuenta</p>
          </CardHeader>
          
          <CardContent className="pb-2">
            {success ? (
              <div className="space-y-6">
                <div className="bg-green-50 text-green-700 px-4 py-4 rounded-lg text-sm flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>¡Tu contraseña ha sido restablecida con éxito!</span>
                </div>
                <Button 
                  onClick={() => router.push('/auth/login')}  
                  className="w-full py-6 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Ir a iniciar sesión
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 pl-1">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className={`${fieldErrors.newPassword ? "text-red-400" : "text-gray-400"}`} />
                    </div>
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Escribe tu nueva contraseña"
                      className={`pl-10 py-6 ${fieldErrors.newPassword 
                        ? "bg-red-50 border-red-300 focus:ring-red-500 focus:border-red-500" 
                        : "bg-gray-50 border-gray-200 focus:ring-teal-500 focus:border-teal-500"} 
                        rounded-lg`}
                      required
                    />
                    <div 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                      )}
                    </div>
                  </div>
                  {fieldErrors.newPassword && (
                    <p className="text-red-600 text-xs mt-1 pl-1">
                      {fieldErrors.newPassword}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 pl-1">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className={`${fieldErrors.confirmPassword ? "text-red-400" : "text-gray-400"}`} />
                    </div>
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirma tu nueva contraseña"
                      className={`pl-10 py-6 ${fieldErrors.confirmPassword 
                        ? "bg-red-50 border-red-300 focus:ring-red-500 focus:border-red-500" 
                        : "bg-gray-50 border-gray-200 focus:ring-teal-500 focus:border-teal-500"} 
                        rounded-lg`}
                      required
                    />
                    <div 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                      )}
                    </div>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-red-600 text-xs mt-1 pl-1">
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>
                
                {error && (
                  <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                    </svg>
                    <span>{error}</span>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full py-6 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      <span>Procesando...</span>
                    </div>
                  ) : "Restablecer contraseña"}
                </Button>
              </form>
            )}
          </CardContent>
          
          <CardFooter className="pt-2 pb-8 flex flex-col items-center">
            <p className="text-sm text-gray-600 mt-6">
              <Link href="/auth/login" className="text-teal-600 hover:text-teal-800 font-medium transition-colors flex items-center">
                <ArrowLeft size={16} className="mr-1" />
                Volver a iniciar sesión
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right side: Image and information (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-teal-600 rounded-l-3xl overflow-hidden relative">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
          <h2 className="text-4xl font-bold mb-6">Casi has terminado</h2>
          <p className="text-lg mb-8">Crea una contraseña segura para mantener protegida tu cuenta en Cloudnel y continuar gestionando tus tours de manera eficiente.</p>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-teal-400 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl">Contraseña segura</h3>
                <p className="text-teal-100">Utiliza al menos 8 caracteres, incluyendo números y símbolos.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-teal-400 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl">Protección de datos</h3>
                <p className="text-teal-100">Tus datos personales y de negocio están protegidos con nosotros.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-teal-400 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl">¿Necesitas más ayuda?</h3>
                <p className="text-teal-100">Nuestro equipo de soporte está disponible 24/7 para asistirte.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decoration elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-teal-400 rounded-full opacity-20"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-teal-400 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-teal-400 rounded-full opacity-10"></div>
      </div>
    </div>
  );
}
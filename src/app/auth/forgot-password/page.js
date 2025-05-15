"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import landingAssets from "@/lib/landingAssets";
import { useTranslation } from "react-i18next";

export default function ForgotPasswordPage() {

  const [currentLanguage, setCurrentLanguage] = useState('en');
      const { t, i18n } = useTranslation();  
      
      useEffect(() => {
        // 1. Primero intenta cargar el idioma guardado en localStorage
        const savedLanguage = localStorage.getItem('unauthenticatedUserLanguage');
        
        if (savedLanguage && ['es', 'en', 'pt'].includes(savedLanguage)) {
          setCurrentLanguage(savedLanguage);
          return; // Si hay un idioma guardado, no uses el del navegador
        }
    
        // 2. Si no hay idioma guardado, usa el del navegador
        const browserLanguage = navigator.language || (navigator).userLanguage;
        const primaryLanguage = browserLanguage.split('-')[0];
        
        if (['es', 'en', 'pt'].includes(primaryLanguage)) {
          setCurrentLanguage(primaryLanguage);
        }
      }, []);
    
      useEffect(() => {
        // Actualiza i18n y guarda en localStorage cuando cambia el idioma
        if (currentLanguage) {
          i18n.changeLanguage(currentLanguage);
          localStorage.setItem('unauthenticatedUserLanguage', currentLanguage);
        }
      }, [currentLanguage, i18n]);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let form = {
        "email": email,
      }
      
      const response = await fetchData(endpoints.auth_forgot_password(), {
        method: 'POST',
        body: JSON.stringify(form),
      });

      if(response.error) {
        console.log(response.error);
        setError(response.error);
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error("Error during forgot password api call: ", err);
      setError("Hubo un error al enviar la solicitud. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-center text-2xl font-bold text-gray-800">{t("forgotPassword.title")}</h1>
            <p className="text-center text-gray-500 mt-2">{t("forgotPassword.subtitle")}</p>
          </CardHeader>
          
          <CardContent className="pb-2">
            {success ? (
              <div className="space-y-6">
                <div className="bg-green-50 text-green-700 px-4 py-4 rounded-lg text-sm flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>{t("forgotPassword.success.message")}</span>
                </div>
                <Button 
                  onClick={() => router.push('/auth/login')}  
                  className="w-full py-6 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  {t("forgotPassword.success.backToLogin")}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 pl-1">
                    {t("forgotPassword.form.email.label")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("forgotPassword.form.email.placeholder")}
                      className="pl-10 py-6 bg-gray-50 border-gray-200 focus:ring-teal-500 focus:border-teal-500 rounded-lg"
                      required
                    />
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                    </svg>
                    <span>{typeof error === 'string' ? error : "Error al procesar tu solicitud"}</span>
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
                      <span>{t("forgotPassword.form.loading")}</span>
                    </div>
                  ) : t("forgotPassword.form.submit")}
                </Button>
              </form>
            )}
          </CardContent>
          
          <CardFooter className="pt-2 pb-8 flex flex-col items-center">
            <p className="text-sm text-gray-600 mt-6">
              <Link href="/auth/login" className="text-teal-600 hover:text-teal-800 font-medium transition-colors flex items-center">
                <ArrowLeft size={16} className="mr-1" />
                {t("forgotPassword.backLink")}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right side: Image and information (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-teal-600 rounded-l-3xl overflow-hidden relative">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
          <h2 className="text-4xl font-bold mb-6">{t("forgotPassword.sidebar.title")}</h2>
          <p className="text-lg mb-8">{t("forgotPassword.sidebar.description")}</p>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-teal-400 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl">{t("forgotPassword.sidebar.feature1.title")}</h3>
                <p className="text-teal-100">{t("forgotPassword.sidebar.feature1.description")}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-teal-400 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl">{t("forgotPassword.sidebar.feature2.title")}</h3>
                <p className="text-teal-100">{t("forgotPassword.sidebar.feature2.description")}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-teal-400 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl">{t("forgotPassword.sidebar.feature3.title")}</h3>
                <p className="text-teal-100">{t("forgotPassword.sidebar.feature3.description")}</p>
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
"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/GlobalRedux/Features/auth/authSlice";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import landingAssets from "@/lib/landingAssets";
import { useTranslation } from "react-i18next";

export default function LoginPage() {

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
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    email: null,
    password: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let form = {
        "email": email,
        "password": password
      }
      
      // Resetear errores antes de hacer la petición
      setError(null);
      setFieldErrors({
        email: null,
        password: null
      });
      
      const response = await fetchData(endpoints.auth_login(), {
        method: 'POST',
        body: JSON.stringify(form),
      });
      if (response.error) {
        console.log("Errores en el if: ", response.error);
        if (response.error && Array.isArray(response.error)) {
          // Procesar errores de validación de campo
          const newFieldErrors = { email: null, password: null };
          let hasErrors = false;
          
          response.error.forEach(fieldError => {
            if (fieldError.property === 'email' || fieldError.property === 'password') {
              newFieldErrors[fieldError.property] = fieldError.message;
              hasErrors = true;
            }
          });
          
          if (hasErrors) {
            setFieldErrors(newFieldErrors);
          } else {
            // Si hay mensajes pero ninguno corresponde a campos conocidos
            setError(response.error || "Error de validación");
          }
        } else {
          // Errores generales
          const errorMessage = response?.error;        
          setError(errorMessage);
        }
        return;
      }
    
      //actualiza el estado global con la información del usuario
      dispatch(setUser(response.user));

      //Redirige al usuario a la ruta adecuada
      if (response.user.role.scope === 'global') {
        router.push('/admin/dashboard');
      } else if (response.user.role.scope === 'agency') {
        router.push(`/agency/dashboard/${response.user.role.agency.id}`);
      }
    } catch (err) {
      console.error("Error during login api call: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-teal-500 to-teal-700">
      {/* Left side: Login form */}
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
            <h1 className="text-center text-2xl font-bold text-gray-800">{t("login.title")}</h1>
            <p className="text-center text-gray-500 mt-2">{t("login.subtitle")}</p>
          </CardHeader>
          
          <CardContent className="pb-2">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 pl-1">
                  {t("login.form.email.label")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className={`${fieldErrors.email ? "text-red-400" : "text-gray-400"}`} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("login.form.email.placeholder")}
                    className={`pl-10 py-6 ${fieldErrors.email
                      ? "bg-red-50 border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "bg-gray-50 border-gray-200 focus:ring-teal-500 focus:border-teal-500"}
                      rounded-lg`}
                    required
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-red-600 text-xs mt-1 pl-1">
                    {fieldErrors.email}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 pl-1">
                    {t("login.form.password.label")}
                  </label>
                  <Link 
                    href="/auth/forgot-password"
                    className="text-sm text-teal-600 hover:text-teal-800 transition-colors"
                  >
                    {t("login.form.password.forgot")}
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className={`${fieldErrors.password ? "text-red-400" : "text-gray-400"}`} />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("login.form.password.placeholder")}
                    className={`pl-10 py-6 ${fieldErrors.password
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
                {fieldErrors.password && (
                  <p className="text-red-600 text-xs mt-1 pl-1">
                    {fieldErrors.password}
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
                  </div>
                ) : "Iniciar sesión"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="pt-2 pb-8 flex flex-col items-center">
            <p className="text-sm text-gray-600 mt-6">
              {t("login.footer.noAccount")} {" "}
              <Link href={`https://wa.me/57${landingAssets.contact}?text=${encodeURIComponent('Saludos! me gustaría crear una cuenta con ustedes')}`} target="_blank" className="text-teal-600 hover:text-teal-800 font-medium transition-colors">
                {t("login.footer.contact")}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right side: Image and information (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-teal-600 rounded-l-3xl overflow-hidden relative">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
          <h2 className="text-4xl font-bold mb-6">{t("login.sidebar.title")}</h2>
          <p className="text-lg mb-8">{t("login.sidebar.description")}</p>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-teal-400 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl">{t("login.sidebar.feature1.title")}</h3>
                <p className="text-teal-100">{t("login.sidebar.feature1.description")}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-teal-400 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl">{t("login.sidebar.feature2.title")}</h3>
                <p className="text-teal-100">{t("login.sidebar.feature2.description")}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-teal-400 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl">{t("login.sidebar.feature3.title")}</h3>
                <p className="text-teal-100">{t("login.sidebar.feature3.description")}</p>
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
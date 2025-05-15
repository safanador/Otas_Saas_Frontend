"use client";
import landingAssets from "@/lib/landingAssets";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./admin/components/LanguageSelector";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLanguageChange = (newLanguage) => {
    setCurrentLanguage(newLanguage);
  };


  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 md:px-16 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image 
              src={landingAssets.logo} 
              alt="Cloudnel.com Logo" 
              width={40} 
              height={40} 
              className="rounded-md"
            />
            <span className="text-2xl font-bold text-teal-600">{t("landing.navbar.logo")}</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-teal-600 transition-colors">{t("landing.navbar.links.features")}</a>
            <a href="#benefits" className="text-gray-600 hover:text-teal-600 transition-colors">{t("landing.navbar.links.benefits")}</a>
            <a href="#pricing" className="text-gray-600 hover:text-teal-600 transition-colors">{t("landing.navbar.links.plans")}</a>
            <a href="#testimonials" className="text-gray-600 hover:text-teal-600 transition-colors">{t("landing.navbar.links.testimonials")}</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth/login">
              <button className="bg-white border border-teal-600 text-teal-600 px-5 py-2 rounded-md hover:bg-teal-50 transition-colors">
                {t("landing.buttons.login")}
              </button>
            </Link>
            <Link href={`https://wa.me/57${landingAssets.contact}?text=${encodeURIComponent('Saludos! quiero saber más sobre la prueba gratuita')}`} target="_blank">
              <button className="bg-teal-600 text-white px-5 py-2 rounded-md hover:bg-teal-700 transition-colors">
                {t("landing.buttons.freeTrial")}
              </button>
            </Link>
            {/* Language Selector */}
            <LanguageSelector 
              currentLanguage={currentLanguage} 
              setCurrentLanguage={handleLanguageChange}
            />
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white p-4 rounded-lg shadow-lg">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-gray-600 hover:text-teal-600 transition-colors" onClick={toggleMenu}>{t("landing.navbar.links.features")}</a>
              <a href="#benefits" className="text-gray-600 hover:text-teal-600 transition-colors" onClick={toggleMenu}>{t("landing.navbar.links.benefits")}</a>
              <a href="#pricing" className="text-gray-600 hover:text-teal-600 transition-colors" onClick={toggleMenu}>{t("landing.navbar.links.plans")}</a>
              <a href="#testimonials" className="text-gray-600 hover:text-teal-600 transition-colors" onClick={toggleMenu}>{t("landing.navbar.links.testimonials")}</a>
              <hr className="my-2" />
              <div className="flex flex-col gap-2">
                <Link href="/auth/login" onClick={toggleMenu}>
                  <button className="w-full bg-white border border-teal-600 text-teal-600 px-4 py-2 rounded-md hover:bg-teal-50 transition-colors">
                    {t("landing.buttons.login")}
                  </button>
                </Link>
                <Link href={`https://wa.me/57${landingAssets.contact}?text=${encodeURIComponent('Saludos! quiero saber más sobre la prueba gratuita')}`} target="_blank"onClick={toggleMenu}>
                  <button className="w-full bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors">
                    {t("landing.buttons.freeTrial")}
                  </button>
                </Link>
                {/* Language Selector */}
                <LanguageSelector 
                  currentLanguage={currentLanguage} 
                  setCurrentLanguage={handleLanguageChange}
                />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-500 to-teal-700 text-white py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {t("landing.hero.title")}
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              {t("landing.hero.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href={`https://wa.me/57${landingAssets.contact}?text=${encodeURIComponent('Saludos! quiero saber más sobre la prueba gratuita')}`} target="_blank">
                <button className="bg-white text-teal-700 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors shadow-lg">
                  {t("landing.buttons.startFreeTrialDays")}
                </button>
              </Link>
              <a href="#demo-video" className="flex items-center justify-center gap-2 bg-transparent border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
                {t("landing.buttons.watchDemo")}
              </a>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <p className="text-sm opacity-90">{t("landing.hero.features.noCard")}</p>
              <div className="w-1 h-1 rounded-full bg-white/50"></div>
              <p className="text-sm opacity-90">{t("landing.hero.features.quickSetup")}</p>
            </div>
          </div>
          <div className="hidden md:block">
            <Image
              src="/api/placeholder/600/400" 
              alt="Plataforma Cloudnel.com en acción"
              width={600}
              height={400}
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="bg-gray-50 py-10 px-6 md:px-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 font-medium mb-8">{t("landing.trustedBy")}</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60">
            <Image src="/api/placeholder/120/40" alt="Logo Cliente 1" width={120} height={40} />
            <Image src="/api/placeholder/120/40" alt="Logo Cliente 2" width={120} height={40} />
            <Image src="/api/placeholder/120/40" alt="Logo Cliente 3" width={120} height={40} />
            <Image src="/api/placeholder/120/40" alt="Logo Cliente 4" width={120} height={40} />
            <Image src="/api/placeholder/120/40" alt="Logo Cliente 5" width={120} height={40} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t("landing.features.title")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("landing.features.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-teal-100 p-3 rounded-lg inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("landing.features.items.item1.title")}</h3>
              <p className="text-gray-600">
                {t("landing.features.items.item1.description")}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-teal-100 p-3 rounded-lg inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("landing.features.items.item2.title")}</h3>
              <p className="text-gray-600">
                {t("landing.features.items.item2.description")}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-teal-100 p-3 rounded-lg inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("landing.features.items.item3.title")}</h3>
              <p className="text-gray-600">
                {t("landing.features.items.item3.description")}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-teal-100 p-3 rounded-lg inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("landing.features.items.item4.title")}</h3>
              <p className="text-gray-600">
                {t("landing.features.items.item4.description")}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-teal-100 p-3 rounded-lg inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("landing.features.items.item5.title")}</h3>
              <p className="text-gray-600">
                {t("landing.features.items.item5.description")}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-teal-100 p-3 rounded-lg inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("landing.features.items.item6.title")}</h3>
              <p className="text-gray-600">
                {t("landing.features.items.item6.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section with Image */}
      <section id="benefits" className="py-20 px-6 md:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t("landing.benefits.title")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("landing.benefits.description")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Image 
                src="/api/placeholder/500/400" 
                alt="Dashboard de Cloudnel.com" 
                width={500} 
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-8">
              {/* Benefit 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-teal-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{t("landing.benefits.items.item1.title")}</h3>
                  <p className="text-gray-600">
                    {t("landing.benefits.items.item1.description")}
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-teal-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">                    {t("landing.benefits.items.item2.title")}</h3>
                  <p className="text-gray-600">
                    {t("landing.benefits.items.item2.description")}
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-teal-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{t("landing.benefits.items.item3.title")}</h3>
                  <p className="text-gray-600">
                    {t("landing.benefits.items.item3.description")}
                  </p>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 bg-teal-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{t("landing.benefits.items.item4.title")}</h3>
                  <p className="text-gray-600">
                    {t("landing.benefits.items.item4.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo-video" className="py-20 px-6 md:px-16">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{t("landing.demo.title")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">
            {t("landing.demo.description")}
          </p>
          <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl aspect-video max-w-4xl mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-white/20 hover:bg-white/30 p-4 rounded-full backdrop-blur transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
            </div>
            <Image
              src="/api/placeholder/960/540"
              alt="Video demo de Cloudnel.com"
              width={960}
              height={540}
              className="opacity-70"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 md:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t("landing.pricing.title")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("landing.pricing.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Plan 1 */}
            <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{t("landing.pricing.plans.item1.name")}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-gray-800">{t("landing.pricing.plans.item1.price")}</span>
                  <span className="text-gray-600">{t("landing.pricing.monthly")}</span>
                </div>
                <p className="text-gray-600 mb-6">
                  {t("landing.pricing.plans.item1.description")}
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">{t("landing.pricing.plans.item1.first")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">{t("landing.pricing.plans.item1.second")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">{t("landing.pricing.plans.item1.third")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">{t("landing.pricing.plans.item1.fourth")}</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <Link href={`https://wa.me/57${landingAssets.contact}?text=${encodeURIComponent('Saludos! estoy interesado en el plan starter para mi empresa')}`} target="_blank">
                  <button className="w-full bg-white border border-teal-600 text-teal-600 px-4 py-3 rounded-md font-medium hover:bg-teal-50 transition-colors">
                    {t("landing.buttons.startFreeTrial")}
                  </button>
                </Link>
              </div>
            </div>

            {/* Plan 2 - Featured */}
            <div className="bg-white rounded-lg shadow-xl border-2 border-teal-600 overflow-hidden transform scale-105">
              <div className="bg-teal-600 text-white text-center py-2">
                <p className="font-medium">{t("landing.pricing.popular")}</p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{t("landing.pricing.plans.item2.name")}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-gray-800">{t("landing.pricing.plans.item2.price")}</span>
                  <span className="text-gray-600">{t("landing.pricing.monthly")}</span>
                </div>
                <p className="text-gray-600 mb-6">
                  {t("landing.pricing.plans.item2.description")}
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">{t("landing.pricing.plans.item2.first")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">{t("landing.pricing.plans.item2.second")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">{t("landing.pricing.plans.item2.third")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">{t("landing.pricing.plans.item2.fourth")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">{t("landing.pricing.plans.item2.fifth")}</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <Link href={`https://wa.me/57${landingAssets.contact}?text=${encodeURIComponent('Saludos! estoy interesado en el plan profesional para mi empresa')}`} target="_blank">
                  <button className="w-full bg-teal-600 text-white px-4 py-3 rounded-md font-medium hover:bg-teal-700 transition-colors">
                    {t("landing.buttons.startFreeTrial")}
                  </button>
                </Link>
              </div>
            </div>

            {/* Plan 3 */}
            <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{t("landing.pricing.plans.item3.name")}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-gray-800">{t("landing.pricing.plans.item3.price")}</span>
                  <span className="text-gray-600">{t("landing.pricing.monthly")}</span>
                </div>
                <p className="text-gray-600 mb-6">
                  {t("landing.pricing.plans.item3.description")}
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">{t("landing.pricing.plans.item3.first")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">{t("landing.pricing.plans.item3.second")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">{t("landing.pricing.plans.item3.third")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">{t("landing.pricing.plans.item3.fourth")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">{t("landing.pricing.plans.item3.fifth")}</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <Link href={`https://wa.me/57${landingAssets.contact}?text=${encodeURIComponent('Saludos! estoy interesado en el plan enterprise para mi empresa')}`} target="_blank">
                  <button className="w-full bg-white border border-teal-600 text-teal-600 px-4 py-3 rounded-md font-medium hover:bg-teal-50 transition-colors">
                    {t("landing.buttons.startFreeTrial")}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t("landing.testimonials.title")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("landing.testimonials.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <Image 
                  src="/api/placeholder/60/60" 
                  alt="Foto de cliente" 
                  width={60} 
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{t("landing.testimonials.items1.name")}</h4>
                  <p className="text-gray-600 text-sm">{t("landing.testimonials.items1.company")}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                {t("landing.testimonials.items1.quote")}
              </p>
              <div className="flex text-yellow-400 mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <Image 
                  src="/api/placeholder/60/60" 
                  alt="Foto de cliente" 
                  width={60} 
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{t("landing.testimonials.items2.name")}</h4>
                  <p className="text-gray-600 text-sm">{t("landing.testimonials.items2.company")}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                {t("landing.testimonials.items2.quote")}
              </p>
              <div className="flex text-yellow-400 mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <Image 
                  src="/api/placeholder/60/60" 
                  alt="Foto de cliente" 
                  width={60} 
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{t("landing.testimonials.items3.name")}</h4>
                  <p className="text-gray-600 text-sm">{t("landing.testimonials.items3.company")}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                {t("landing.testimonials.items3.quote")}
              </p>
              <div className="flex text-yellow-400 mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 md:px-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t("landing.faq.title")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("landing.faq.description")}
            </p>
          </div>

          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("landing.faq.item1.question")}</h3>
              <p className="text-gray-600">
                {t("landing.faq.item1.answer")}
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("landing.faq.item2.question")}</h3>
              <p className="text-gray-600">
                {t("landing.faq.item2.answer")}
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("landing.faq.item3.question")}</h3>
              <p className="text-gray-600">
                {t("landing.faq.item3.answer")}
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("landing.faq.item4.question")}</h3>
              <p className="text-gray-600">
                {t("landing.faq.item4.answer")}
              </p>
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("landing.faq.item5.question")}</h3>
              <p className="text-gray-600">
                {t("landing.faq.item5.answer")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-20 px-6 md:px-16">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("landing.cta.title")}</h2>
          <p className="text-xl opacity-90 mb-10 max-w-3xl mx-auto">
            {t("landing.cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`https://wa.me/573002730186?text=${encodeURIComponent('Saludos! quiero iniciar mi prueba gratuita')}`} target="_blank">
              <button className="bg-white text-teal-700 px-8 py-4 rounded-md font-medium hover:bg-gray-100 transition-colors shadow-lg text-lg">
                {t("landing.buttons.startFreeTrial")}
              </button>
            </Link>
            <a href="#demo-video" className="flex items-center justify-center gap-2 bg-transparent border border-white text-white px-8 py-4 rounded-md font-medium hover:bg-white/10 transition-colors text-lg">
              {t("landing.buttons.watchDemo")}
            </a>
          </div>
          <p className="mt-6 text-sm opacity-80">
            {t("landing.noCardRequired")}
          </p>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Image 
                  src={landingAssets.logo} 
                  alt="Cloudnel.com Logo" 
                  width={40} 
                  height={40} 
                  className="rounded-md"
                />
                <span className="text-2xl font-bold text-teal-400">{t("landing.navbar.logo")}</span>
              </div>
              <p className="text-gray-400 mb-6">
                {t("landing.footer.description")}
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">{t("landing.footer.quickLinks")}</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-teal-400 transition-colors">{t("landing.footer.features")}</a></li>
                <li><a href="#benefits" className="text-gray-400 hover:text-teal-400 transition-colors">{t("landing.footer.benefits")}</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-teal-400 transition-colors">{t("landing.footer.pricing")}</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-teal-400 transition-colors">{t("landing.footer.testimonials")}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">{t("landing.footer.blog")}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">{t("landing.footer.legal")}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">{t("landing.footer.terms")}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">{t("landing.footer.privacy")}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">{t("landing.footer.cookies")}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">{t("landing.footer.gdpr")}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">{t("landing.footer.contact")}</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{t("landing.footer.address")}</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>+57 {landingAssets.contact}</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>{t("landing.footer.email")}</span>
                </li>
              </ul>
              <div className="mt-6">
                <a href="/auth/login" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  {t("landing.buttons.login")}
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} {t("landing.footer.copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
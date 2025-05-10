"use client";
import landingAssets from "@/lib/landingAssets";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
            <span className="text-2xl font-bold text-teal-600">Cloudnel.com</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-teal-600 transition-colors">Características</a>
            <a href="#benefits" className="text-gray-600 hover:text-teal-600 transition-colors">Beneficios</a>
            <a href="#pricing" className="text-gray-600 hover:text-teal-600 transition-colors">Planes</a>
            <a href="#testimonials" className="text-gray-600 hover:text-teal-600 transition-colors">Testimonios</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth/login">
              <button className="bg-white border border-teal-600 text-teal-600 px-5 py-2 rounded-md hover:bg-teal-50 transition-colors">
                Iniciar Sesión
              </button>
            </Link>
            <Link href={`https://wa.me/57${landingAssets.contact}?text=${encodeURIComponent('Saludos! quiero saber más sobre la prueba gratuita')}`} target="_blank">
              <button className="bg-teal-600 text-white px-5 py-2 rounded-md hover:bg-teal-700 transition-colors">
                Prueba Gratuita
              </button>
            </Link>
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
              <a href="#features" className="text-gray-600 hover:text-teal-600 transition-colors" onClick={toggleMenu}>Características</a>
              <a href="#benefits" className="text-gray-600 hover:text-teal-600 transition-colors" onClick={toggleMenu}>Beneficios</a>
              <a href="#pricing" className="text-gray-600 hover:text-teal-600 transition-colors" onClick={toggleMenu}>Planes</a>
              <a href="#testimonials" className="text-gray-600 hover:text-teal-600 transition-colors" onClick={toggleMenu}>Testimonios</a>
              <hr className="my-2" />
              <div className="flex flex-col gap-2">
                <Link href="/auth/login" onClick={toggleMenu}>
                  <button className="w-full bg-white border border-teal-600 text-teal-600 px-4 py-2 rounded-md hover:bg-teal-50 transition-colors">
                    Iniciar Sesión
                  </button>
                </Link>
                <Link href={`https://wa.me/57${landingAssets.contact}?text=${encodeURIComponent('Saludos! quiero saber más sobre la prueba gratuita')}`} target="_blank"onClick={toggleMenu}>
                  <button className="w-full bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors">
                    Prueba Gratuita
                  </button>
                </Link>
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
              Todas tus reservas en un solo lugar
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Simplifica la gestión de tu agencia de tours con nuestra plataforma integral. Ahorra tiempo, evita errores y aumenta tus ventas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href={`https://wa.me/57${landingAssets.contact}?text=${encodeURIComponent('Saludos! quiero saber más sobre la prueba gratuita')}`} target="_blank">
                <button className="bg-white text-teal-700 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors shadow-lg">
                  Prueba Gratuita por 14 días
                </button>
              </Link>
              <a href="#demo-video" className="flex items-center justify-center gap-2 bg-transparent border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
                Ver Demo
              </a>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <p className="text-sm opacity-90">Sin tarjeta de crédito</p>
              <div className="w-1 h-1 rounded-full bg-white/50"></div>
              <p className="text-sm opacity-90">Configuración en minutos</p>
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
          <p className="text-gray-500 font-medium mb-8">CONFÍAN EN NOSOTROS</p>
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
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Una solución completa para tu agencia</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cloudnel.com centraliza todas tus operaciones en una única plataforma intuitiva, liberándote para enfocarte en lo que realmente importa: crear experiencias inolvidables.
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
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Gestión de Reservas Unificada</h3>
              <p className="text-gray-600">
                Centraliza todas tus reservas de diferentes fuentes en un solo calendario intuitivo.
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
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Gestión de Clientes</h3>
              <p className="text-gray-600">
                Mantén un registro detallado de tus clientes y sus preferencias para personalizar sus experiencias.
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
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Pagos Integrados</h3>
              <p className="text-gray-600">
                Acepta pagos en línea con múltiples métodos y gestiona fácilmente devoluciones y facturas.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-teal-100 p-3 rounded-lg inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Reportes Analíticos</h3>
              <p className="text-gray-600">
                Obtén insights valiosos sobre el rendimiento de tus tours y el comportamiento de tus clientes.
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
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Acceso Móvil</h3>
              <p className="text-gray-600">
                Gestiona tu negocio desde cualquier lugar con nuestra aplicación móvil responsiva.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-teal-100 p-3 rounded-lg inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Integraciones</h3>
              <p className="text-gray-600">
                Conecta con tus herramientas favoritas: Stripe, PayPal, Mailchimp, y más.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section with Image */}
      <section id="benefits" className="py-20 px-6 md:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">¿Por qué elegir Cloudnel.com?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nuestra plataforma está diseñada específicamente para resolver los desafíos diarios de las agencias de tours.
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
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">Ahorra hasta 15 horas semanales</h3>
                  <p className="text-gray-600">
                    Automatiza tareas repetitivas y elimina la necesidad de gestionar múltiples sistemas.
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
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">Reduce errores en un 95%</h3>
                  <p className="text-gray-600">
                    Elimina reservas duplicadas y errores humanos con nuestro sistema de verificación automática.
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
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">Aumenta tus ventas hasta un 30%</h3>
                  <p className="text-gray-600">
                    Mejora la experiencia del cliente con confirmaciones instantáneas y comunicación fluida.
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
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">Escalabilidad sin preocupaciones</h3>
                  <p className="text-gray-600">
                    Crece tu negocio sin limitaciones tecnológicas. Nuestra plataforma se adapta a ti.
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
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ve Cloudnel.com en acción</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">
            Observa cómo nuestra plataforma simplifica cada aspecto de la gestión de tu agencia de tours.
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
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Planes adaptados a tu negocio</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ofrecemos planes flexibles que crecen contigo. Sin contratos largos, sin complicaciones.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Plan 1 */}
            <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">Inicio</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-gray-800">$49</span>
                  <span className="text-gray-600">/mes</span>
                </div>
                <p className="text-gray-600 mb-6">
                  Perfecto para agencias pequeñas que están comenzando.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">Hasta 100 reservas/mes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">2 usuarios</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">Integraciones básicas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">Soporte por email</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <Link href={`https://wa.me/57${landingAssets.contact}?text=${encodeURIComponent('Saludos! estoy interesado en el plan starter para mi empresa')}`} target="_blank">
                  <button className="w-full bg-white border border-teal-600 text-teal-600 px-4 py-3 rounded-md font-medium hover:bg-teal-50 transition-colors">
                    Comenzar prueba gratuita
                  </button>
                </Link>
              </div>
            </div>

            {/* Plan 2 - Featured */}
            <div className="bg-white rounded-lg shadow-xl border-2 border-teal-600 overflow-hidden transform scale-105">
              <div className="bg-teal-600 text-white text-center py-2">
                <p className="font-medium">Más popular</p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">Profesional</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-gray-800">$99</span>
                  <span className="text-gray-600">/mes</span>
                </div>
                <p className="text-gray-600 mb-6">
                  Ideal para agencias en crecimiento con múltiples destinos.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">Reservas ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">5 usuarios</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">Todas las integraciones</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">Soporte prioritario</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">Reportes avanzados</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <Link href={`https://wa.me/57${landingAssets.contact}?text=${encodeURIComponent('Saludos! estoy interesado en el plan profesional para mi empresa')}`} target="_blank">
                  <button className="w-full bg-teal-600 text-white px-4 py-3 rounded-md font-medium hover:bg-teal-700 transition-colors">
                    Comenzar prueba gratuita
                  </button>
                </Link>
              </div>
            </div>

            {/* Plan 3 */}
            <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">Empresarial</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-gray-800">$199</span>
                  <span className="text-gray-600">/mes</span>
                </div>
                <p className="text-gray-600 mb-6">
                  Para agencias grandes con múltiples destinos y equipos.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">Reservas ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">Usuarios ilimitados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">API personalizada</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">Soporte 24/7</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-gray-700">Marca personalizada</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <Link href={`https://wa.me/57${landingAssets.contact}?text=${encodeURIComponent('Saludos! estoy interesado en el plan enterprise para mi empresa')}`} target="_blank">
                  <button className="w-full bg-white border border-teal-600 text-teal-600 px-4 py-3 rounded-md font-medium hover:bg-teal-50 transition-colors">
                    Comenzar prueba gratuita
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
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Agencias de tours de todo el mundo confían en Cloudnel.com para simplificar sus operaciones.
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
                  <h4 className="font-semibold text-gray-800">Carlos Ramírez</h4>
                  <p className="text-gray-600 text-sm">Adventure Tours, México</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Desde que implementamos Cloudnel.com, redujimos los errores de reserva en un 98%. Nuestros guías tienen toda la información en tiempo real y nuestros clientes están más satisfechos que nunca."
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
                  <h4 className="font-semibold text-gray-800">Luisa García</h4>
                  <p className="text-gray-600 text-sm">Barcelona City Tours, España</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Cloudnel.com cambió completamente nuestra forma de operar. Ahora procesamos el doble de reservas con la mitad del personal administrativo. La integración con nuestro sitio web fue sorprendentemente fácil."
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
                  <h4 className="font-semibold text-gray-800">John Miller</h4>
                  <p className="text-gray-600 text-sm">NYC Guided Tours, EE.UU.</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Después de probar tres plataformas diferentes, Cloudnel.com es la única que realmente entendió nuestras necesidades. Los reportes analíticos nos han ayudado a optimizar nuestros tours más populares."
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
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Preguntas frecuentes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Respuestas a las preguntas más comunes sobre Cloudnel.com.
            </p>
          </div>

          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">¿Cuánto tiempo toma implementar Cloudnel.com?</h3>
              <p className="text-gray-600">
                La mayoría de nuestros clientes están operando completamente en Cloudnel.com en menos de una semana. Nuestro equipo de soporte te guiará en cada paso del proceso de migración de datos y configuración.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">¿Puedo integrar Cloudnel.com con mi sistema actual?</h3>
              <p className="text-gray-600">
                Sí, Cloudnel.com ofrece API robustas y conectores prediseñados para integrarse con la mayoría de los sistemas de reservas, sitios web, CRMs y plataformas de pago populares.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">¿Qué pasa si necesito ayuda o soporte?</h3>
              <p className="text-gray-600">
                Todos los planes incluyen soporte por email. Los planes Profesional y Empresarial incluyen soporte prioritario y acceso a nuestro equipo de éxito del cliente. Además, ofrecemos una extensa biblioteca de recursos y webinars.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">¿Puedo cancelar mi suscripción en cualquier momento?</h3>
              <p className="text-gray-600">
                Absolutamente. No hay contratos a largo plazo. Puedes cancelar tu suscripción en cualquier momento sin penalizaciones. Siempre puedes exportar tus datos si decides dejar Cloudnel.com.
              </p>
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">¿Es seguro Cloudnel.com para mis datos y pagos?</h3>
              <p className="text-gray-600">
                La seguridad es nuestra prioridad. Cloudnel.com cumple con los estándares PCI DSS para procesamiento de pagos y GDPR para protección de datos. Todas las comunicaciones están encriptadas y realizamos auditorías de seguridad regularmente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-20 px-6 md:px-16">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Transforma la gestión de tu agencia de tours hoy</h2>
          <p className="text-xl opacity-90 mb-10 max-w-3xl mx-auto">
            Únete a cientos de agencias de tours que ya están aprovechando el poder de Cloudnel.com para simplificar sus operaciones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`https://wa.me/573002730186?text=${encodeURIComponent('Saludos! quiero iniciar mi prueba gratuita')}`} target="_blank">
              <button className="bg-white text-teal-700 px-8 py-4 rounded-md font-medium hover:bg-gray-100 transition-colors shadow-lg text-lg">
                Comienza tu prueba gratuita
              </button>
            </Link>
            <a href="#demo-video" className="flex items-center justify-center gap-2 bg-transparent border border-white text-white px-8 py-4 rounded-md font-medium hover:bg-white/10 transition-colors text-lg">
              Ver demostración
            </a>
          </div>
          <p className="mt-6 text-sm opacity-80">
            No se requiere tarjeta de crédito. 14 días de prueba gratis.
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
                <span className="text-2xl font-bold text-teal-400">Cloudnel.com</span>
              </div>
              <p className="text-gray-400 mb-6">
                La plataforma todo-en-uno para agencias de tours. Simplifica tu negocio, maximiza tus ganancias.
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
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-teal-400 transition-colors">Características</a></li>
                <li><a href="#benefits" className="text-gray-400 hover:text-teal-400 transition-colors">Beneficios</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-teal-400 transition-colors">Planes y Precios</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-teal-400 transition-colors">Testimonios</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Términos de Servicio</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Política de Privacidad</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Cookies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">GDPR</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>Av. Insurgentes 123, CDMX</span>
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
                  <span>contacto@Cloudnel.com.com</span>
                </li>
              </ul>
              <div className="mt-6">
                <a href="/auth/login" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  Iniciar Sesión
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Cloudnel.com. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
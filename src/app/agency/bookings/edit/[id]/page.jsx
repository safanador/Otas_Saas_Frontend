"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  CreditCard,
  User,
  Mail,
  Phone,
  ChevronRight,
  ChevronLeft,
  Check,
  Star,
  Heart,
  Share2,
  Info,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
  Globe,
  Shield,
} from "lucide-react";
import Layout from "@/app/agency/components/layout/layout";

export default function BookingEdit() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTour, setSelectedTour] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    // Datos del tour
    tourId: "",
    fecha: "",
    hora: "",

    // Participantes
    adultos: 2,
    niños: 0,
    participantes: [],

    // Datos del cliente
    nombre: "",
    email: "",
    telefono: "",
    documento: "",
    direccion: "",
    comentarios: "",

    // Pago
    metodoPago: "tarjeta",
    numeroTarjeta: "",
    fechaVencimiento: "",
    cvv: "",
    nombreTitular: "",

    // Términos
    aceptaTerminos: false,
    recibirPromociones: true,
  });

  // Datos de ejemplo de tours disponibles
  const tours = [
    {
      id: 1,
      nombre: "City Tour Premium",
      descripcion:
        "Descubre los lugares más emblemáticos de la ciudad con nuestro tour premium",
      duracion: "4 horas",
      precio: 75,
      precioNiño: 45,
      imagen:
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop",
      puntoEncuentro: "Plaza Mayor",
      rating: 4.8,
      reviews: 234,
      incluye: [
        "Guía profesional",
        "Transporte",
        "Entrada a monumentos",
        "Seguro",
      ],
      horarios: ["09:00", "14:00", "16:00"],
      disponible: true,
    },
    {
      id: 2,
      nombre: "Tour Gastronómico",
      descripcion:
        "Experimenta los sabores locales en un recorrido culinario único",
      duracion: "3 horas",
      precio: 95,
      precioNiño: 60,
      imagen:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=250&fit=crop",
      puntoEncuentro: "Mercado Central",
      rating: 4.9,
      reviews: 156,
      incluye: ["Guía gastronómico", "Degustaciones", "Bebidas", "Recetas"],
      horarios: ["11:00", "17:00"],
      disponible: true,
    },
    {
      id: 3,
      nombre: "Tour Nocturno",
      descripcion: "Vive la magia de la ciudad al atardecer y durante la noche",
      duracion: "2.5 horas",
      precio: 65,
      precioNiño: 35,
      imagen:
        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=250&fit=crop",
      puntoEncuentro: "Plaza de la Catedral",
      rating: 4.7,
      reviews: 189,
      incluye: [
        "Guía nocturno",
        "Iluminación especial",
        "Fotografías",
        "Bebida de bienvenida",
      ],
      horarios: ["19:00", "20:30"],
      disponible: true,
    },
  ];

  const steps = [
    { id: 1, title: "Seleccionar Tour", icon: MapPin },
    { id: 2, title: "Fecha y Hora", icon: Calendar },
    { id: 3, title: "Participantes", icon: Users },
    { id: 4, title: "Datos Personales", icon: User },
    { id: 5, title: "Pago", icon: CreditCard },
    { id: 6, title: "Confirmación", icon: CheckCircle },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTourSelect = (tour) => {
    setSelectedTour(tour);
    handleInputChange("tourId", tour.id);
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateTotal = () => {
    if (!selectedTour) return { subtotal: 0, impuestos: 0, total: 0 };
    const adultosTotal = formData.adultos * selectedTour.precio;
    const niñosTotal = formData.niños * selectedTour.precioNiño;
    const subtotal = adultosTotal + niñosTotal;
    const impuestos = subtotal * 0.21;
    return {
      subtotal,
      impuestos,
      total: subtotal + impuestos,
    };
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return selectedTour !== null;
      case 2:
        return formData.fecha && formData.hora;
      case 3:
        return formData.adultos > 0 || formData.niños > 0;
      case 4:
        return formData.nombre && formData.email && formData.telefono;
      case 5:
        return formData.metodoPago && formData.aceptaTerminos;
      default:
        return true;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    nextStep();
  };

  return (
    <Layout title="Editar Reserva">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Edita tu Reserva
              </h1>
              <p className="text-gray-600">
                Completa los siguientes pasos para editar tu experiencia
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex flex-col items-center ${
                      index < steps.length - 1 ? "flex-1" : ""
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                        currentStep === step.id
                          ? "bg-blue-500 border-blue-500 text-white"
                          : currentStep > step.id
                          ? "bg-green-500 border-green-500 text-white"
                          : "bg-white border-gray-300 text-gray-400"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <step.icon className="w-6 h-6" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium mt-2 text-center ${
                        currentStep >= step.id
                          ? "text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        currentStep > step.id ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Step 1: Seleccionar Tour */}
            {currentStep === 1 && (
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Selecciona tu Tour
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tours.map((tour) => (
                    <div
                      key={tour.id}
                      onClick={() => handleTourSelect(tour)}
                      className={`cursor-pointer rounded-xl border-2 transition-all hover:shadow-lg ${
                        selectedTour?.id === tour.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={tour.imagen}
                          alt={tour.nombre}
                          className="w-full h-48 object-cover rounded-t-xl"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                            <Heart className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                            <Share2 className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {tour.nombre}
                          </h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-gray-700">
                              {tour.rating}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({tour.reviews})
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4">{tour.descripcion}</p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{tour.duracion}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{tour.puntoEncuentro}</span>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-2xl font-bold text-gray-900">
                                €{tour.precio}
                              </p>
                              <p className="text-sm text-gray-600">
                                por adulto
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-700">
                                €{tour.precioNiño}
                              </p>
                              <p className="text-sm text-gray-600">por niño</p>
                            </div>
                          </div>
                        </div>

                        {selectedTour?.id === tour.id && (
                          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-800">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                Tour seleccionado
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Fecha y Hora */}
            {currentStep === 2 && (
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Selecciona Fecha y Hora
                </h2>

                {selectedTour && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedTour.imagen}
                        alt={selectedTour.nombre}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {selectedTour.nombre}
                        </h3>
                        <p className="text-gray-600">
                          {selectedTour.duracion} • €{selectedTour.precio} por
                          adulto
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha del Tour
                    </label>
                    <input
                      type="date"
                      value={formData.fecha}
                      onChange={(e) =>
                        handleInputChange("fecha", e.target.value)
                      }
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.fecha && (
                      <p className="mt-2 text-sm text-blue-600">
                        {formatDate(formData.fecha)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora de Inicio
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedTour?.horarios.map((horario) => (
                        <button
                          key={horario}
                          onClick={() => handleInputChange("hora", horario)}
                          className={`p-3 text-left border rounded-lg transition-colors ${
                            formData.hora === horario
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{horario}</span>
                            {formData.hora === horario && (
                              <CheckCircle className="w-5 h-5 text-blue-500" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedTour && (
                  <div className="mt-8 bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Lo que incluye este tour:
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedTour.incluye.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Participantes */}
            {currentStep === 3 && (
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  ¿Cuántos participantes?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Adultos
                          </h3>
                          <p className="text-sm text-gray-600">13 años o más</p>
                          <p className="text-lg font-bold text-blue-600">
                            €{selectedTour?.precio}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handleInputChange(
                                "adultos",
                                Math.max(0, formData.adultos - 1)
                              )
                            }
                            className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-xl font-bold text-gray-900 w-8 text-center">
                            {formData.adultos}
                          </span>
                          <button
                            onClick={() =>
                              handleInputChange("adultos", formData.adultos + 1)
                            }
                            className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Niños
                          </h3>
                          <p className="text-sm text-gray-600">2-12 años</p>
                          <p className="text-lg font-bold text-green-600">
                            €{selectedTour?.precioNiño}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handleInputChange(
                                "niños",
                                Math.max(0, formData.niños - 1)
                              )
                            }
                            className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-xl font-bold text-gray-900 w-8 text-center">
                            {formData.niños}
                          </span>
                          <button
                            onClick={() =>
                              handleInputChange("niños", formData.niños + 1)
                            }
                            className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Resumen de tu reserva
                    </h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">
                          {selectedTour?.nombre}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">
                          {formatDate(formData.fecha)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">{formData.hora}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">
                          {formData.adultos + formData.niños} participantes
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      {formData.adultos > 0 && (
                        <div className="flex justify-between">
                          <span>
                            {formData.adultos} Adulto
                            {formData.adultos > 1 ? "s" : ""}
                          </span>
                          <span>
                            €{formData.adultos * (selectedTour?.precio || 0)}
                          </span>
                        </div>
                      )}
                      {formData.niños > 0 && (
                        <div className="flex justify-between">
                          <span>
                            {formData.niños} Niño{formData.niños > 1 ? "s" : ""}
                          </span>
                          <span>
                            €{formData.niños * (selectedTour?.precioNiño || 0)}
                          </span>
                        </div>
                      )}
                      <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>Subtotal</span>
                        <span>€{calculateTotal().subtotal}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Datos Personales */}
            {currentStep === 4 && (
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Datos Personales
                </h2>

                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) =>
                          handleInputChange("nombre", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ingresa tu nombre completo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) =>
                          handleInputChange("telefono", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+34 666 123 456"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Documento de Identidad
                      </label>
                      <input
                        type="text"
                        value={formData.documento}
                        onChange={(e) =>
                          handleInputChange("documento", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="DNI, Pasaporte, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={formData.direccion}
                      onChange={(e) =>
                        handleInputChange("direccion", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Calle, ciudad, país"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comentarios o Solicitudes Especiales
                    </label>
                    <textarea
                      value={formData.comentarios}
                      onChange={(e) =>
                        handleInputChange("comentarios", e.target.value)
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="¿Alguna solicitud especial o información adicional?"
                    />
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">
                          Información importante
                        </h4>
                        <p className="text-sm text-blue-700">
                          Recibirás un email de confirmación con todos los
                          detalles de tu reserva. Por favor, verifica que todos
                          los datos sean correctos antes de continuar.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Pago */}
            {currentStep === 5 && (
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Información de Pago
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Método de Pago */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Método de Pago
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="metodoPago"
                            value="tarjeta"
                            checked={formData.metodoPago === "tarjeta"}
                            onChange={(e) =>
                              handleInputChange("metodoPago", e.target.value)
                            }
                            className="mr-3"
                          />
                          <CreditCard className="w-5 h-5 text-gray-500 mr-3" />
                          <span>Tarjeta de Crédito/Débito</span>
                        </label>

                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="metodoPago"
                            value="paypal"
                            checked={formData.metodoPago === "paypal"}
                            onChange={(e) =>
                              handleInputChange("metodoPago", e.target.value)
                            }
                            className="mr-3"
                          />
                          <Globe className="w-5 h-5 text-gray-500 mr-3" />
                          <span>PayPal</span>
                        </label>
                      </div>
                    </div>

                    {/* Datos de Tarjeta */}
                    {formData.metodoPago === "tarjeta" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número de Tarjeta
                          </label>
                          <input
                            type="text"
                            value={formData.numeroTarjeta}
                            onChange={(e) =>
                              handleInputChange("numeroTarjeta", e.target.value)
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Fecha de Vencimiento
                            </label>
                            <input
                              type="text"
                              value={formData.fechaVencimiento}
                              onChange={(e) =>
                                handleInputChange(
                                  "fechaVencimiento",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="MM/AA"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              value={formData.cvv}
                              onChange={(e) =>
                                handleInputChange("cvv", e.target.value)
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="123"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del Titular
                          </label>
                          <input
                            type="text"
                            value={formData.nombreTitular}
                            onChange={(e) =>
                              handleInputChange("nombreTitular", e.target.value)
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Como aparece en la tarjeta"
                          />
                        </div>
                      </div>
                    )}

                    {/* Términos y condiciones */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="terminos"
                          checked={formData.aceptaTerminos}
                          onChange={(e) =>
                            handleInputChange(
                              "aceptaTerminos",
                              e.target.checked
                            )
                          }
                          className="mt-1"
                        />
                        <label
                          htmlFor="terminos"
                          className="text-sm text-gray-700"
                        >
                          Acepto los{" "}
                          <span className="text-blue-600 hover:underline cursor-pointer">
                            términos y condiciones
                          </span>{" "}
                          y la{" "}
                          <span className="text-blue-600 hover:underline cursor-pointer">
                            política de privacidad
                          </span>
                        </label>
                      </div>

                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="promociones"
                          checked={formData.recibirPromociones}
                          onChange={(e) =>
                            handleInputChange(
                              "recibirPromociones",
                              e.target.checked
                            )
                          }
                          className="mt-1"
                        />
                        <label
                          htmlFor="promociones"
                          className="text-sm text-gray-700"
                        >
                          Quiero recibir promociones y ofertas especiales por
                          email
                        </label>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800 mb-1">
                            Pago Seguro
                          </h4>
                          <p className="text-sm text-yellow-700">
                            Tu información de pago está protegida con
                            encriptación SSL de 256 bits. No guardamos los datos
                            de tu tarjeta en nuestros servidores.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resumen del Pedido */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Resumen del Pedido
                    </h3>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedTour?.imagen}
                          alt={selectedTour?.nombre}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {selectedTour?.nombre}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(formData.fecha)} • {formData.hora}
                          </p>
                        </div>
                      </div>

                      <div className="border-t pt-4 space-y-2">
                        {formData.adultos > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>
                              {formData.adultos} Adulto
                              {formData.adultos > 1 ? "s" : ""}
                            </span>
                            <span>
                              €{formData.adultos * (selectedTour?.precio || 0)}
                            </span>
                          </div>
                        )}
                        {formData.niños > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>
                              {formData.niños} Niño
                              {formData.niños > 1 ? "s" : ""}
                            </span>
                            <span>
                              €
                              {formData.niños * (selectedTour?.precioNiño || 0)}
                            </span>
                          </div>
                        )}

                        <div className="border-t pt-2">
                          <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>€{calculateTotal().subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Impuestos (21%)</span>
                            <span>
                              €{calculateTotal().impuestos.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between font-bold text-lg pt-2 border-t">
                            <span>Total</span>
                            <span>€{calculateTotal().total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-gray-600">
                      <p>• Cancelación gratuita hasta 24h antes</p>
                      <p>• Confirmación inmediata</p>
                      <p>• Soporte 24/7</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Confirmación */}
            {currentStep === 6 && (
              <div className="p-8 text-center">
                <div className="max-w-2xl mx-auto">
                  <div className="mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      ¡Reserva Confirmada!
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Tu reserva ha sido procesada exitosamente. Recibirás un
                      email de confirmación en breve.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 text-left">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Detalles de tu Reserva
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Número de Reserva:
                        </span>
                        <span className="font-semibold">
                          #TR-{Date.now().toString().slice(-6)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tour:</span>
                        <span className="font-semibold">
                          {selectedTour?.nombre}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fecha:</span>
                        <span className="font-semibold">
                          {formatDate(formData.fecha)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hora:</span>
                        <span className="font-semibold">{formData.hora}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Participantes:</span>
                        <span className="font-semibold">
                          {formData.adultos + formData.niños}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Pagado:</span>
                        <span className="font-bold text-lg text-green-600">
                          €{calculateTotal().total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <Mail className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Email de Confirmación
                      </h4>
                      <p className="text-sm text-gray-600">
                        Enviado a {formData.email}
                      </p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <Phone className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Contacto
                      </h4>
                      <p className="text-sm text-gray-600">+34 900 123 456</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      Ver Mis Reservas
                    </button>
                    <button
                      onClick={() => {
                        setCurrentStep(1);
                        setSelectedTour(null);
                        setFormData({
                          tourId: "",
                          fecha: "",
                          hora: "",
                          adultos: 2,
                          niños: 0,
                          participantes: [],
                          nombre: "",
                          email: "",
                          telefono: "",
                          documento: "",
                          direccion: "",
                          comentarios: "",
                          metodoPago: "tarjeta",
                          numeroTarjeta: "",
                          fechaVencimiento: "",
                          cvv: "",
                          nombreTitular: "",
                          aceptaTerminos: false,
                          recibirPromociones: true,
                        });
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Nueva Reserva
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="border-t bg-gray-50 px-8 py-6">
              <div className="flex justify-between items-center">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1 || currentStep === 6}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    currentStep === 1 || currentStep === 6
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>

                <div className="text-sm text-gray-600">
                  Paso {currentStep} de {steps.length}
                </div>

                {currentStep < 5 && (
                  <button
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                      isStepValid()
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {currentStep === 5 && (
                  <button
                    onClick={handleSubmit}
                    disabled={!isStepValid() || isProcessing}
                    className={`flex items-center gap-2 px-8 py-3 rounded-lg transition-colors ${
                      isStepValid() && !isProcessing
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Confirmar Pago
                      </>
                    )}
                  </button>
                )}

                {currentStep === 6 && <div></div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

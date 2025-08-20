"use client";

import { useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Users,
  MapPin,
  CreditCard,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Globe,
  Smartphone,
} from "lucide-react";
import Layout from "@/app/agency/components/layout/layout";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";

const BookingDetails = () => {
  const [activeTab, setActiveTab] = useState("informacion");

  // Datos de ejemplo de la reserva
  const reserva = {
    id: "R001",
    codigo: "RSV-2025-001",
    tour: "City Tour Premium",
    fecha: "2025-05-28",
    hora: "09:00",
    duracion: "4 horas",
    estado: "confirmada",
    canal: "Web",
    fechaCreacion: "2025-05-20",
    cliente: {
      nombre: "María García Rodríguez",
      email: "maria.garcia@email.com",
      telefono: "+34 666 123 456",
      documento: "DNI: 12345678A",
      direccion: "Calle Mayor 123, Madrid, España",
    },
    participantes: {
      adultos: 3,
      niños: 1,
      total: 4,
      detalles: [
        { nombre: "María García", edad: 35, tipo: "adulto" },
        { nombre: "Juan García", edad: 38, tipo: "adulto" },
        { nombre: "Ana García", edad: 16, tipo: "adulto" },
        { nombre: "Luis García", edad: 8, tipo: "niño" },
      ],
    },
    pago: {
      subtotal: 280,
      descuentos: 20,
      impuestos: 60,
      total: 320,
      moneda: "EUR",
      metodo: "Tarjeta de Crédito",
      estado: "Pagado",
      referencia: "TXN-2025-001234",
      fechaPago: "2025-05-20",
    },
    tour_detalles: {
      puntoEncuentro: "Plaza Mayor, Madrid",
      instrucciones:
        "Favor llegar 15 minutos antes. Llevar documento de identidad.",
      incluye: [
        "Guía profesional",
        "Transporte",
        "Entrada a monumentos",
        "Seguro",
      ],
      noIncluye: ["Comidas", "Bebidas", "Gastos personales"],
    },
    historial: [
      {
        fecha: "2025-05-20 10:30",
        accion: "Reserva creada",
        usuario: "Sistema",
        detalles: "Reserva creada a través del sitio web",
      },
      {
        fecha: "2025-05-20 10:35",
        accion: "Pago procesado",
        usuario: "Sistema",
        detalles: "Pago de €320 procesado exitosamente",
      },
      {
        fecha: "2025-05-20 11:00",
        accion: "Confirmación enviada",
        usuario: "Admin",
        detalles: "Email de confirmación enviado al cliente",
      },
      {
        fecha: "2025-05-22 14:20",
        accion: "Recordatorio enviado",
        usuario: "Sistema",
        detalles: "Recordatorio automático enviado 6 días antes del tour",
      },
    ],
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case "confirmada":
        return "bg-green-100 text-green-800 border-green-200";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelada":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (estado) => {
    switch (estado) {
      case "Pagado":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Fallido":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getChannelIcon = (canal) => {
    switch (canal) {
      case "Web":
        return <Globe className="w-5 h-5" />;
      case "WhatsApp":
        return <Smartphone className="w-5 h-5" />;
      case "Teléfono":
        return <Phone className="w-5 h-5" />;
      case "Presencial":
        return <MapPin className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  const getActionIcon = (accion) => {
    switch (accion) {
      case "Reserva creada":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Pago procesado":
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      case "Confirmación enviada":
        return <Mail className="w-4 h-4 text-purple-500" />;
      case "Recordatorio enviado":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout title="Detalles de reserva">
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Detalle de Reserva
                  </h1>
                  <p className="text-gray-600 mt-1">Código: {reserva.codigo}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getChannelIcon(reserva.canal)}
                  <span className="text-sm font-medium text-gray-700">
                    {reserva.canal}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                    reserva.estado
                  )}`}
                >
                  {reserva.estado.charAt(0).toUpperCase() +
                    reserva.estado.slice(1)}
                </span>
              </div>
            </div>

            {/* Información básica del tour */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <MapPin className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Tour</p>
                  <p className="text-lg font-bold text-gray-900">
                    {reserva.tour}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <Calendar className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Fecha</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatDate(reserva.fecha)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl">
                <Clock className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Hora</p>
                  <p className="text-lg font-bold text-gray-900">
                    {reserva.hora}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                <Users className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Participantes
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {reserva.participantes.total}
                  </p>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <Edit className="w-4 h-4" />
                Editar Reserva
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                <Eye className="w-4 h-4" />
                Imprimir Voucher
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
                Cancelar Reserva
              </button>
            </div>
          </div>

          {/* Tabs de navegación */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  {
                    id: "informacion",
                    label: "Información del Cliente",
                    icon: User,
                  },
                  { id: "participantes", label: "Participantes", icon: Users },
                  { id: "pago", label: "Datos de Pago", icon: CreditCard },
                  { id: "historial", label: "Historial", icon: Clock },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors relative ${
                      activeTab === tab.id
                        ? "text-purple-600 bg-purple-50 border-b-2 border-purple-600"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-8">
              {/* Tab Información del Cliente */}
              {activeTab === "informacion" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Información del Cliente
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <User className="w-6 h-6 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Nombre Completo
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {reserva.cliente.nombre}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <Mail className="w-6 h-6 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Email
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {reserva.cliente.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <Phone className="w-6 h-6 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Teléfono
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {reserva.cliente.telefono}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          Documento
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {reserva.cliente.documento}
                        </p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          Dirección
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {reserva.cliente.direccion}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Información del tour */}
                  <div className="mt-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      Detalles del Tour
                    </h4>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">
                            Punto de Encuentro
                          </p>
                          <p className="text-gray-900 font-medium">
                            {reserva.tour_detalles.puntoEncuentro}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">
                            Duración
                          </p>
                          <p className="text-gray-900 font-medium">
                            {reserva.duracion}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          Instrucciones Especiales
                        </p>
                        <p className="text-gray-900">
                          {reserva.tour_detalles.instrucciones}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">
                            Incluye
                          </p>
                          <ul className="space-y-1">
                            {reserva.tour_detalles.incluye.map(
                              (item, index) => (
                                <li
                                  key={index}
                                  className="flex items-center gap-2 text-gray-900"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  {item}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">
                            No Incluye
                          </p>
                          <ul className="space-y-1">
                            {reserva.tour_detalles.noIncluye.map(
                              (item, index) => (
                                <li
                                  key={index}
                                  className="flex items-center gap-2 text-gray-900"
                                >
                                  <XCircle className="w-4 h-4 text-red-500" />
                                  {item}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Participantes */}
              {activeTab === "participantes" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Participantes
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {reserva.participantes.adultos}
                        </p>
                        <p className="text-sm text-gray-600">Adultos</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {reserva.participantes.niños}
                        </p>
                        <p className="text-sm text-gray-600">Niños</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          {reserva.participantes.total}
                        </p>
                        <p className="text-sm text-gray-600">Total</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reserva.participantes.detalles.map(
                      (participante, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {participante.nombre}
                            </h4>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                participante.tipo === "adulto"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {participante.tipo === "adulto"
                                ? "Adulto"
                                : "Niño"}
                            </span>
                          </div>
                          <p className="text-gray-600">
                            Edad: {participante.edad} años
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Tab Datos de Pago */}
              {activeTab === "pago" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Datos de Pago
                    </h3>
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getPaymentStatusColor(
                        reserva.pago.estado
                      )}`}
                    >
                      {reserva.pago.estado}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Desglose de Costos
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">
                              €{reserva.pago.subtotal}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Descuentos</span>
                            <span className="font-medium text-green-600">
                              -€{reserva.pago.descuentos}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Impuestos</span>
                            <span className="font-medium">
                              €{reserva.pago.impuestos}
                            </span>
                          </div>
                          <div className="border-t pt-3 flex justify-between">
                            <span className="text-lg font-bold text-gray-900">
                              Total
                            </span>
                            <span className="text-lg font-bold text-gray-900">
                              €{reserva.pago.total}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Información de Pago
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Método de Pago
                              </p>
                              <p className="font-semibold text-gray-900">
                                {reserva.pago.metodo}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Referencia
                              </p>
                              <p className="font-semibold text-gray-900">
                                {reserva.pago.referencia}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Fecha de Pago
                              </p>
                              <p className="font-semibold text-gray-900">
                                {formatDate(reserva.pago.fechaPago)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Moneda
                              </p>
                              <p className="font-semibold text-gray-900">
                                {reserva.pago.moneda}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Historial */}
              {activeTab === "historial" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Historial de Cambios
                  </h3>

                  <div className="space-y-4">
                    {reserva.historial.map((evento, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {getActionIcon(evento.accion)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {evento.accion}
                              </h4>
                              <span className="text-sm text-gray-500">
                                {formatDateTime(evento.fecha)}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-2">
                              {evento.detalles}
                            </p>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-600">
                                Por: {evento.usuario}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Información adicional */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Información de Creación
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Fecha de Creación
                        </p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(reserva.fechaCreacion)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Canal de Reserva
                        </p>
                        <div className="flex items-center gap-2">
                          {getChannelIcon(reserva.canal)}
                          <span className="font-semibold text-gray-900">
                            {reserva.canal}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withAuth( BookingDetails, '');


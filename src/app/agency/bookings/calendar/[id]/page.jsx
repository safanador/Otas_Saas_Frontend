"use client";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Filter,
  MapPin,
  Users,
  Clock,
} from "lucide-react";
import Layout from "@/app/agency/components/layout/layout";
import permissions from "@/lib/permissions";
import withAuth from "@/app/middleware/withAuth";

const BookingCalendar = ()=>  {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("monthly"); // monthly, weekly, daily
  const [filters, setFilters] = useState({
    tour: "",
    canal: "",
    estado: "",
  });

  // Datos de ejemplo
  const reservas = [
    {
      id: "R001",
      tour: "City Tour Premium",
      fecha: "2025-05-28",
      hora: "09:00",
      participantes: 4,
      canal: "Web",
      estado: "confirmada",
      cliente: "María García",
      total: 320,
    },
    {
      id: "R002",
      tour: "Tour Gastronómico",
      fecha: "2025-05-28",
      hora: "14:00",
      participantes: 2,
      canal: "WhatsApp",
      estado: "pendiente",
      cliente: "Carlos López",
      total: 180,
    },
    {
      id: "R003",
      tour: "Aventura Extrema",
      fecha: "2025-05-29",
      hora: "10:30",
      participantes: 6,
      canal: "Teléfono",
      estado: "confirmada",
      cliente: "Ana Martínez",
      total: 480,
    },
  ];

  const tours = ["City Tour Premium", "Tour Gastronómico", "Aventura Extrema"];
  const canales = ["Web", "WhatsApp", "Teléfono", "Presencial"];
  const estados = ["confirmada", "pendiente", "cancelada"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Días del mes anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }

    // Días del siguiente mes para completar la grilla
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const getReservasForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return reservas.filter((reserva) => reserva.fecha === dateStr);
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
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

  const filteredReservas = reservas.filter((reserva) => {
    return (
      (!filters.tour || reserva.tour === filters.tour) &&
      (!filters.canal || reserva.canal === filters.canal) &&
      (!filters.estado || reserva.estado === filters.estado)
    );
  });

  return (
    <Layout title="Calendario de Reservas">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Calendario de Reservas
                </h1>
                <p className="text-gray-600">
                  Gestiona y visualiza todas tus reservas
                </p>
              </div>
              <Calendar className="w-12 h-12 text-blue-500" />
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tour
                </label>
                <select
                  value={filters.tour}
                  onChange={(e) =>
                    setFilters({ ...filters, tour: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los tours</option>
                  {tours.map((tour) => (
                    <option key={tour} value={tour}>
                      {tour}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canal
                </label>
                <select
                  value={filters.canal}
                  onChange={(e) =>
                    setFilters({ ...filters, canal: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los canales</option>
                  {canales.map((canal) => (
                    <option key={canal} value={canal}>
                      {canal}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={filters.estado}
                  onChange={(e) =>
                    setFilters({ ...filters, estado: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los estados</option>
                  {estados.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vista
                </label>
                <div className="flex rounded-xl border border-gray-300 overflow-hidden">
                  {["monthly", "weekly", "daily"].map((viewType) => (
                    <button
                      key={viewType}
                      onClick={() => setView(viewType)}
                      className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                        view === viewType
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {viewType === "monthly"
                        ? "Mes"
                        : viewType === "weekly"
                        ? "Semana"
                        : "Día"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Calendario */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Navegación del calendario */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold">
                {currentDate.toLocaleDateString("es-ES", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>

              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Vista mensual */}
            {view === "monthly" && (
              <div className="p-6">
                {/* Días de la semana */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(
                    (day) => (
                      <div
                        key={day}
                        className="p-3 text-center font-semibold text-gray-600 text-sm"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                {/* Días del mes */}
                <div className="grid grid-cols-7 gap-2">
                  {getDaysInMonth(currentDate).map((day, index) => {
                    const dayReservas = getReservasForDate(day.date).filter(
                      (reserva) => {
                        return (
                          (!filters.tour || reserva.tour === filters.tour) &&
                          (!filters.canal || reserva.canal === filters.canal) &&
                          (!filters.estado || reserva.estado === filters.estado)
                        );
                      }
                    );

                    return (
                      <div
                        key={index}
                        className={`min-h-24 p-2 border rounded-lg transition-all hover:shadow-md ${
                          day.isCurrentMonth
                            ? "bg-white border-gray-200"
                            : "bg-gray-50 border-gray-100"
                        } ${
                          dayReservas.length > 0 ? "ring-2 ring-blue-200" : ""
                        }`}
                      >
                        <div
                          className={`text-sm font-medium mb-1 ${
                            day.isCurrentMonth
                              ? "text-gray-900"
                              : "text-gray-400"
                          }`}
                        >
                          {day.date.getDate()}
                        </div>

                        {dayReservas.slice(0, 2).map((reserva) => (
                          <div
                            key={reserva.id}
                            className={`text-xs p-1 rounded mb-1 border cursor-pointer hover:shadow-sm transition-shadow ${getStatusColor(
                              reserva.estado
                            )}`}
                            title={`${reserva.tour} - ${reserva.cliente}`}
                          >
                            <div className="font-medium truncate">
                              {reserva.tour}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              <span>{reserva.hora}</span>
                              <Users className="w-3 h-3 ml-1" />
                              <span>{reserva.participantes}</span>
                            </div>
                          </div>
                        ))}

                        {dayReservas.length > 2 && (
                          <div className="text-xs text-blue-600 font-medium">
                            +{dayReservas.length - 2} más
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Resumen de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Reservas
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {filteredReservas.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Confirmadas
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {
                      filteredReservas.filter((r) => r.estado === "confirmada")
                        .length
                    }
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pendientes
                  </p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {
                      filteredReservas.filter((r) => r.estado === "pendiente")
                        .length
                    }
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ingresos</p>
                  <p className="text-3xl font-bold text-purple-600">
                    $
                    {filteredReservas
                      .reduce((sum, r) => sum + r.total, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withAuth( BookingCalendar,'');
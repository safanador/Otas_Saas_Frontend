"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  X,
  Calendar,
  Users,
  Phone,
  Globe,
  Smartphone,
  MapPin,
  Pencil,
} from "lucide-react";
import Layout from "@/app/agency/components/layout/layout";
import { useRouter } from "next/navigation";

export default function ListadoReservas() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    fechaInicio: "",
    fechaFin: "",
    estado: "",
    busqueda: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Datos de ejemplo expandidos
  const reservas = [
    {
      id: "R001",
      codigo: "RSV-2025-001",
      tour: "City Tour Premium",
      fecha: "2025-05-28",
      hora: "09:00",
      participantes: { adultos: 3, niños: 1 },
      total: 320,
      canal: "Web",
      estado: "confirmada",
      cliente: "María García",
      email: "maria.garcia@email.com",
      telefono: "+34 666 123 456",
    },
    {
      id: "R002",
      codigo: "RSV-2025-002",
      tour: "Tour Gastronómico",
      fecha: "2025-05-28",
      hora: "14:00",
      participantes: { adultos: 2, niños: 0 },
      total: 180,
      canal: "WhatsApp",
      estado: "pendiente",
      cliente: "Carlos López",
      email: "carlos.lopez@email.com",
      telefono: "+34 666 234 567",
    },
    {
      id: "R003",
      codigo: "RSV-2025-003",
      tour: "Aventura Extrema",
      fecha: "2025-05-29",
      hora: "10:30",
      participantes: { adultos: 4, niños: 2 },
      total: 480,
      canal: "Teléfono",
      estado: "confirmada",
      cliente: "Ana Martínez",
      email: "ana.martinez@email.com",
      telefono: "+34 666 345 678",
    },
    {
      id: "R004",
      codigo: "RSV-2025-004",
      tour: "Tour Nocturno",
      fecha: "2025-05-30",
      hora: "20:00",
      participantes: { adultos: 2, niños: 0 },
      total: 150,
      canal: "Presencial",
      estado: "cancelada",
      cliente: "Pedro Sánchez",
      email: "pedro.sanchez@email.com",
      telefono: "+34 666 456 789",
    },
    {
      id: "R005",
      codigo: "RSV-2025-005",
      tour: "Excursión Familiar",
      fecha: "2025-06-01",
      hora: "11:00",
      participantes: { adultos: 2, niños: 3 },
      total: 275,
      canal: "Web",
      estado: "confirmada",
      cliente: "Laura Rodríguez",
      email: "laura.rodriguez@email.com",
      telefono: "+34 666 567 890",
    },
  ];

  const estados = ["confirmada", "pendiente", "cancelada"];

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

  const getChannelIcon = (canal) => {
    switch (canal) {
      case "Web":
        return <Globe className="w-4 h-4" />;
      case "WhatsApp":
        return <Smartphone className="w-4 h-4" />;
      case "Teléfono":
        return <Phone className="w-4 h-4" />;
      case "Presencial":
        return <MapPin className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const filteredReservas = reservas.filter((reserva) => {
    const fechaReserva = new Date(reserva.fecha);
    const fechaInicio = filters.fechaInicio
      ? new Date(filters.fechaInicio)
      : null;
    const fechaFin = filters.fechaFin ? new Date(filters.fechaFin) : null;

    return (
      (!fechaInicio || fechaReserva >= fechaInicio) &&
      (!fechaFin || fechaReserva <= fechaFin) &&
      (!filters.estado || reserva.estado === filters.estado) &&
      (!filters.busqueda ||
        reserva.codigo.toLowerCase().includes(filters.busqueda.toLowerCase()) ||
        reserva.cliente
          .toLowerCase()
          .includes(filters.busqueda.toLowerCase()) ||
        reserva.tour.toLowerCase().includes(filters.busqueda.toLowerCase()))
    );
  });

  const totalPages = Math.ceil(filteredReservas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReservas = filteredReservas.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleCancelReserva = (id) => {
    if (confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
      console.log("Cancelando reserva:", id);
      // Aquí iría la lógica para cancelar la reserva
    }
  };

  const clearFilters = () => {
    setFilters({
      fechaInicio: "",
      fechaFin: "",
      estado: "",
      busqueda: "",
    });
    setCurrentPage(1);
  };

  return (
    <Layout title="Listado de reservas">
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Listado de Reservas
                </h1>
                <p className="text-gray-600">
                  Administra todas tus reservas de manera eficiente
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total de reservas</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {filteredReservas.length}
                  </p>
                </div>
                <Users className="w-12 h-12 text-indigo-500" />
              </div>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={filters.fechaInicio}
                  onChange={(e) =>
                    setFilters({ ...filters, fechaInicio: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={filters.fechaFin}
                  onChange={(e) =>
                    setFilters({ ...filters, fechaFin: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
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
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Todos los estados</option>
                  {estados.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar por código, cliente o tour..."
                    value={filters.busqueda}
                    onChange={(e) =>
                      setFilters({ ...filters, busqueda: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Botón limpiar filtros */}
            {(filters.fechaInicio ||
              filters.fechaFin ||
              filters.estado ||
              filters.busqueda) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Tabla de reservas */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Código
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Tour
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Cliente
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Participantes
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Canal
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedReservas.map((reserva, index) => (
                    <tr
                      key={reserva.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {reserva.codigo}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {reserva.tour}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reserva.hora}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {reserva.cliente}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reserva.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-900">
                          <Calendar className="w-4 h-4" />
                          {new Date(reserva.fecha).toLocaleDateString("es-ES")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-900">
                          <Users className="w-4 h-4" />
                          {reserva.participantes.adultos +
                            reserva.participantes.niños}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reserva.participantes.adultos}A,{" "}
                          {reserva.participantes.niños}N
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          ${reserva.total.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getChannelIcon(reserva.canal)}
                          <span className="text-sm text-gray-700">
                            {reserva.canal}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            reserva.estado
                          )}`}
                        >
                          {reserva.estado.charAt(0).toUpperCase() +
                            reserva.estado.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => 
                              router.push(`/agency/bookings/show/${reserva.id}`)
                            }
                            className="flex items-center gap-1 px-3 py-2 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Ver detalle"
                          >
                            <Eye className="w-4 h-4" />
                            Ver
                          </button>
                          
                          <button
                            onClick={() => 
                              router.push(`/agency/bookings/edit/${reserva.id}`)
                            }
                            className="flex items-center gap-1 px-3 py-2 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Editar reserva"
                          >
                            <Pencil className="w-4 h-4" />
                            Editar
                          </button>
                          
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredReservas.length === 0 && (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron reservas
                </h3>
                <p className="text-gray-500">
                  Intenta ajustar los filtros de búsqueda.
                </p>
              </div>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-700">
                  Mostrando {startIndex + 1} a{" "}
                  {Math.min(startIndex + itemsPerPage, filteredReservas.length)}{" "}
                  de {filteredReservas.length} reservas
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg ${
                            page === currentPage
                              ? "bg-indigo-500 text-white"
                              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Estadísticas resumidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
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
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Canceladas
                  </p>
                  <p className="text-3xl font-bold text-red-600">
                    {
                      filteredReservas.filter((r) => r.estado === "cancelada")
                        .length
                    }
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <X className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Ingresos Total
                  </p>
                  <p className="text-3xl font-bold text-indigo-600">
                    $
                    {filteredReservas
                      .filter((r) => r.estado === "confirmada")
                      .reduce((sum, r) => sum + r.total, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-full">
                  <Filter className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

"use client";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  Users,
  Calendar,
  TrendingUp,
  Filter,
  Download,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Layout from "@/app/agency/components/layout/layout";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";

const OccupancyReport = () => {
  const [dateRange, setDateRange] = useState({
    start: "2024-05-01",
    end: "2024-05-30",
  });
  const [selectedTour, setSelectedTour] = useState("all");
  const [viewType, setViewType] = useState("daily"); // daily, weekly, monthly

  // Datos de ocupación diaria
  const dailyOccupancyData = [
    { date: "01/05", ocupacion: 75, capacidad: 120, reservas: 90 },
    { date: "02/05", ocupacion: 42, capacidad: 120, reservas: 50 },
    { date: "03/05", ocupacion: 88, capacidad: 150, reservas: 132 },
    { date: "04/05", ocupacion: 65, capacidad: 140, reservas: 91 },
    { date: "05/05", ocupacion: 78, capacidad: 160, reservas: 125 },
    { date: "06/05", ocupacion: 85, capacidad: 140, reservas: 119 },
    { date: "07/05", ocupacion: 92, capacidad: 130, reservas: 120 },
    { date: "08/05", ocupacion: 71, capacidad: 180, reservas: 128 },
    { date: "09/05", ocupacion: 66, capacidad: 150, reservas: 99 },
    { date: "10/05", ocupacion: 82, capacidad: 140, reservas: 115 },
  ];

  // Datos de ocupación por tour
  const tourOccupancyData = [
    {
      tour: "City Walking Tour",
      ocupacion: 85,
      capacidadTotal: 840,
      reservasTotal: 714,
      diasActivo: 30,
      ocupacionPromedio: 85,
      trend: "up",
    },
    {
      tour: "Cathedral & Museums",
      ocupacion: 72,
      capacidadTotal: 600,
      reservasTotal: 432,
      diasActivo: 25,
      ocupacionPromedio: 72,
      trend: "down",
    },
    {
      tour: "Food & Wine Experience",
      ocupacion: 91,
      capacidadTotal: 420,
      reservasTotal: 382,
      diasActivo: 21,
      ocupacionPromedio: 91,
      trend: "up",
    },
    {
      tour: "Historical District",
      ocupacion: 65,
      capacidadTotal: 720,
      reservasTotal: 468,
      diasActivo: 30,
      ocupacionPromedio: 65,
      trend: "stable",
    },
    {
      tour: "Sunset Photography",
      ocupacion: 58,
      capacidadTotal: 360,
      reservasTotal: 209,
      diasActivo: 18,
      ocupacionPromedio: 58,
      trend: "down",
    },
  ];

  // Datos de ocupación por canal
  const channelOccupancyData = [
    { canal: "Viator", ocupacion: 78, reservas: 425, capacidad: 545 },
    { canal: "GetYourGuide", ocupacion: 82, reservas: 356, capacidad: 434 },
    { canal: "Directo", ocupacion: 74, reservas: 288, capacidad: 389 },
    { canal: "Airbnb", ocupacion: 69, reservas: 198, capacidad: 287 },
  ];

  // Datos para gráfico radial de ocupación general
  const radialData = [{ name: "Ocupación", value: 76, fill: "#8884d8" }];

  const tours = [
    "all",
    "city-walking",
    "cathedral-museums",
    "food-wine",
    "historical",
    "sunset-photography",
  ];

  // Cálculos de KPIs
  const avgOccupancy =
    dailyOccupancyData.reduce((sum, day) => sum + day.ocupacion, 0) /
    dailyOccupancyData.length;
  const totalCapacity = dailyOccupancyData.reduce(
    (sum, day) => sum + day.capacidad,
    0
  );
  const totalReservations = dailyOccupancyData.reduce(
    (sum, day) => sum + day.reservas,
    0
  );
  const capacityUtilization = (totalReservations / totalCapacity) * 100;

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="text-green-500" size={16} />;
      case "down":
        return <TrendingUp className="text-red-500 rotate-180" size={16} />;
      default:
        return <div className="w-4 h-0.5 bg-gray-400 rounded"></div>;
    }
  };

  const getOccupancyColor = (occupancy) => {
    if (occupancy >= 80) return "text-green-600 bg-green-100";
    if (occupancy >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <Layout title="Reporte de Ocupación">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Users className="text-blue-600" />
                  Reporte de Ocupación
                </h1>
                <p className="text-gray-600 mt-2">
                  Análisis de capacidad y utilización de tours
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex bg-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => setViewType("daily")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewType === "daily"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600"
                    }`}
                  >
                    Diario
                  </button>
                  <button
                    onClick={() => setViewType("weekly")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewType === "weekly"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600"
                    }`}
                  >
                    Semanal
                  </button>
                  <button
                    onClick={() => setViewType("monthly")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewType === "monthly"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600"
                    }`}
                  >
                    Mensual
                  </button>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download size={20} />
                  Exportar
                </button>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-gray-500" />
                <span className="font-medium text-gray-700">Período:</span>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-500" />
                <span className="font-medium text-gray-700">Tour:</span>
                <select
                  value={selectedTour}
                  onChange={(e) => setSelectedTour(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos los tours</option>
                  <option value="city-walking">City Walking Tour</option>
                  <option value="cathedral-museums">Cathedral & Museums</option>
                  <option value="food-wine">Food & Wine Experience</option>
                  <option value="historical">Historical District</option>
                  <option value="sunset-photography">Sunset Photography</option>
                </select>
              </div>
            </div>
          </div>

          {/* KPIs Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Ocupación Promedio
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {avgOccupancy.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="text-green-500" size={16} />
                <span className="text-green-500 text-sm font-medium ml-1">
                  +4.2%
                </span>
                <span className="text-gray-500 text-sm ml-2">
                  vs período anterior
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Utilización Capacidad
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {capacityUtilization.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Calendar className="text-purple-600" size={24} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="text-green-500" size={16} />
                <span className="text-green-500 text-sm font-medium ml-1">
                  +2.8%
                </span>
                <span className="text-gray-500 text-sm ml-2">
                  vs período anterior
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Días Completos
                  </p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-gray-500 text-sm">40% del período</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Baja Ocupación
                  </p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <AlertCircle className="text-orange-600" size={24} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-gray-500 text-sm">
                  Tours &lt;60% ocupación
                </span>
              </div>
            </div>
          </div>

          {/* Gráficos principales */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Gráfico de ocupación diaria */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ocupación Diaria
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyOccupancyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "ocupacion" ? `${value}%` : value,
                      name === "ocupacion"
                        ? "Ocupación"
                        : name === "capacidad"
                        ? "Capacidad"
                        : "Reservas",
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="ocupacion" fill="#8884d8" name="Ocupación %" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Medidor de ocupación general */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ocupación General
              </h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="90%"
                    data={radialData}
                  >
                    <RadialBar
                      dataKey="value"
                      cornerRadius={10}
                      fill="#8884d8"
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">76%</div>
                    <div className="text-sm text-gray-500">Ocupación</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ocupación por canal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Ocupación por Canal
              </h3>
              <div className="space-y-4">
                {channelOccupancyData.map((channel, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="font-medium text-gray-900">
                        {channel.canal}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-600">
                        {channel.reservas}/{channel.capacidad}
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getOccupancyColor(
                          channel.ocupacion
                        )}`}
                      >
                        {channel.ocupacion}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tendencia de ocupación */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tendencia de Ocupación
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dailyOccupancyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, "Ocupación"]} />
                  <Line
                    type="monotone"
                    dataKey="ocupacion"
                    stroke="#8884d8"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tabla detallada de tours */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Análisis Detallado por Tour
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Tour
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">
                      Ocupación
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Reservas
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Capacidad
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Días Activo
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">
                      Tendencia
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Promedio/Día
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tourOccupancyData.map((tour, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">
                          {tour.tour}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getOccupancyColor(
                              tour.ocupacion
                            )}`}
                          >
                            {tour.ocupacion}%
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-gray-900">
                        {tour.reservasTotal.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-600">
                        {tour.capacidadTotal.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-600">
                        {tour.diasActivo}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center">
                          {getTrendIcon(tour.trend)}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right text-gray-600">
                        {Math.round(tour.reservasTotal / tour.diasActivo)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recomendaciones */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="text-blue-600" size={20} />
              Recomendaciones de Optimización
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  📈 Oportunidades de Crecimiento
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    • Aumentar capacidad en "Food & Wine Experience" (91%
                    ocupación)
                  </li>
                  <li>
                    • Promocionar "Sunset Photography" en canales con mejor
                    conversión
                  </li>
                  <li>
                    • Considerar horarios adicionales para tours populares
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  ⚠️ Áreas de Atención
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    • Revisar estrategia de "Historical District" (65%
                    ocupación)
                  </li>
                  <li>• Analizar días con baja ocupación (&lt;50%)</li>
                  <li>• Optimizar distribución entre canales</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth( OccupancyReport,'');

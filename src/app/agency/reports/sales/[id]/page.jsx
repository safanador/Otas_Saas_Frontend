"use client";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Filter,
  Download,
  Eye,
} from "lucide-react";
import Layout from "@/app/agency/components/layout/layout";

const SalesReport = () => {
  const [dateRange, setDateRange] = useState({
    start: "2024-05-01",
    end: "2024-05-30",
  });
  const [selectedChannel, setSelectedChannel] = useState("all");

  // Datos de ejemplo para ventas diarias
  const dailySalesData = [
    { date: "01/05", ventas: 2400, reservas: 15 },
    { date: "02/05", ventas: 1398, reservas: 8 },
    { date: "03/05", ventas: 9800, reservas: 45 },
    { date: "04/05", ventas: 3908, reservas: 22 },
    { date: "05/05", ventas: 4800, reservas: 28 },
    { date: "06/05", ventas: 3800, reservas: 21 },
    { date: "07/05", ventas: 4300, reservas: 25 },
    { date: "08/05", ventas: 5200, reservas: 32 },
    { date: "09/05", ventas: 6100, reservas: 35 },
    { date: "10/05", ventas: 4900, reservas: 29 },
  ];

  // Datos de tours más vendidos
  const topToursData = [
    { tour: "City Walking Tour", ventas: 25400, reservas: 142, ocupacion: 85 },
    { tour: "Cathedral & Museums", ventas: 18200, reservas: 96, ocupacion: 72 },
    {
      tour: "Food & Wine Experience",
      ventas: 15800,
      reservas: 78,
      ocupacion: 91,
    },
    { tour: "Historical District", ventas: 12600, reservas: 68, ocupacion: 65 },
    { tour: "Sunset Photography", ventas: 9400, reservas: 45, ocupacion: 58 },
  ];

  // Datos de ventas por canal
  const channelData = [
    { name: "Viator", value: 35, color: "#8884d8" },
    { name: "GetYourGuide", value: 28, color: "#82ca9d" },
    { name: "Directo", value: 22, color: "#ffc658" },
    { name: "Airbnb", value: 15, color: "#ff7c7c" },
  ];

  const channels = ["all", "viator", "getyourguide", "directo", "airbnb"];

  // KPIs calculados
  const totalSales = dailySalesData.reduce((sum, day) => sum + day.ventas, 0);
  const totalReservations = dailySalesData.reduce(
    (sum, day) => sum + day.reservas,
    0
  );
  const avgTicket = totalSales / totalReservations;
  const growth = 12.5; // Crecimiento vs período anterior

  return (
    <Layout title="Reporte de Ventas">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <DollarSign className="text-green-600" />
                  Reporte de Ventas
                </h1>
                <p className="text-gray-600 mt-2">
                  Análisis detallado de ingresos y performance
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download size={20} />
                  Exportar PDF
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
                <span className="font-medium text-gray-700">Canal:</span>
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos los canales</option>
                  <option value="viator">Viator</option>
                  <option value="getyourguide">GetYourGuide</option>
                  <option value="directo">Reservas Directas</option>
                  <option value="airbnb">Airbnb</option>
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
                    Ventas Totales
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalSales.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="text-green-600" size={24} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="text-green-500" size={16} />
                <span className="text-green-500 text-sm font-medium ml-1">
                  +{growth}%
                </span>
                <span className="text-gray-500 text-sm ml-2">
                  vs período anterior
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Reservas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalReservations}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calendar className="text-blue-600" size={24} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="text-green-500" size={16} />
                <span className="text-green-500 text-sm font-medium">
                  +8.2%
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
                    Ticket Promedio
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${avgTicket.toFixed(0)}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <TrendingUp className="text-purple-600" size={24} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="text-green-500" size={16} />
                <span className="text-green-500 text-sm font-medium">
                  +3.8%
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
                    Tasa Conversión
                  </p>
                  <p className="text-2xl font-bold text-gray-900">24.8%</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Eye className="text-orange-600" size={24} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="text-green-500" size={16} />
                <span className="text-green-500 text-sm font-medium">
                  +2.1%
                </span>
                <span className="text-gray-500 text-sm ml-2">
                  vs período anterior
                </span>
              </div>
            </div>
          </div>

          {/* Gráficos principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Gráfico de ventas diarias */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Evolución de Ventas
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "ventas" ? `$${value.toLocaleString()}` : value,
                      name === "ventas" ? "Ventas" : "Reservas",
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ventas"
                    stroke="#8884d8"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="reservas"
                    stroke="#82ca9d"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Distribución por canales */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ventas por Canal
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tabla de tours más vendidos */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Tours Más Vendidos
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Tour
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Ventas
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Reservas
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Ocupación
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Ticket Promedio
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topToursData.map((tour, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm mr-3">
                            {index + 1}
                          </div>
                          <span className="font-medium text-gray-900">
                            {tour.tour}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-gray-900">
                        ${tour.ventas.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-600">
                        {tour.reservas}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tour.ocupacion >= 80
                              ? "bg-green-100 text-green-800"
                              : tour.ocupacion >= 60
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {tour.ocupacion}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-gray-600">
                        ${Math.round(tour.ventas / tour.reservas)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SalesReport;

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
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  Globe,
  TrendingUp,
  Users,
  DollarSign,
  Filter,
  Download,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Settings,
  Eye,
  MousePointer,
  ShoppingCart,
} from "lucide-react";
import Layout from "@/app/agency/components/layout/layout";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";

const ChannelAnalysisReport = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [comparisonMode, setComparisonMode] = useState(false);

  // Datos de performance por canal
  const channelPerformanceData = [
    {
      channel: "Viator",
      revenue: 45200,
      bookings: 342,
      avgTicket: 132,
      conversion: 3.2,
      commission: 15,
      netRevenue: 38420,
      growth: 12.5,
      status: "connected",
      lastSync: "2024-05-27 14:30",
      topTour: "City Walking Tour",
    },
    {
      channel: "GetYourGuide",
      revenue: 38600,
      bookings: 285,
      avgTicket: 135,
      conversion: 4.1,
      commission: 18,
      netRevenue: 31652,
      growth: -2.3,
      status: "connected",
      lastSync: "2024-05-27 14:25",
      topTour: "Food & Wine Experience",
    },
    {
      channel: "Directo",
      revenue: 32400,
      bookings: 198,
      avgTicket: 164,
      conversion: 8.5,
      commission: 0,
      netRevenue: 32400,
      growth: 28.7,
      status: "active",
      lastSync: "Tiempo real",
      topTour: "Cathedral & Museums",
    },
    {
      channel: "Airbnb Experiences",
      revenue: 24800,
      bookings: 156,
      avgTicket: 159,
      conversion: 2.8,
      commission: 20,
      netRevenue: 19840,
      growth: 5.2,
      status: "connected",
      lastSync: "2024-05-27 13:45",
      topTour: "Historical District",
    },
    {
      channel: "TripAdvisor",
      revenue: 18200,
      bookings: 124,
      avgTicket: 147,
      conversion: 2.1,
      commission: 12,
      netRevenue: 16016,
      growth: -8.4,
      status: "warning",
      lastSync: "2024-05-26 16:20",
      topTour: "Sunset Photography",
    },
  ];

  // Evolución temporal por canal
  const timeSeriesData = [
    {
      date: "01/05",
      Viator: 1800,
      GetYourGuide: 1650,
      Directo: 1200,
      Airbnb: 950,
      TripAdvisor: 720,
    },
    {
      date: "08/05",
      Viator: 2100,
      GetYourGuide: 1450,
      Directo: 1350,
      Airbnb: 1100,
      TripAdvisor: 680,
    },
    {
      date: "15/05",
      Viator: 1950,
      GetYourGuide: 1580,
      Directo: 1480,
      Airbnb: 980,
      TripAdvisor: 750,
    },
    {
      date: "22/05",
      Viator: 2250,
      GetYourGuide: 1720,
      Directo: 1620,
      Airbnb: 1200,
      TripAdvisor: 630,
    },
    {
      date: "29/05",
      Viator: 2400,
      GetYourGuide: 1680,
      Directo: 1750,
      Airbnb: 1050,
      TripAdvisor: 590,
    },
  ];

  // Análisis de tours por canal
  const tourChannelMatrix = [
    {
      tour: "City Walking Tour",
      Viator: 95,
      GetYourGuide: 78,
      Directo: 65,
      Airbnb: 45,
      TripAdvisor: 32,
    },
    {
      tour: "Cathedral & Museums",
      Viator: 72,
      GetYourGuide: 68,
      Directo: 85,
      Airbnb: 38,
      TripAdvisor: 28,
    },
    {
      tour: "Food & Wine Experience",
      Viator: 58,
      GetYourGuide: 92,
      Directo: 42,
      Airbnb: 35,
      TripAdvisor: 18,
    },
    {
      tour: "Historical District",
      Viator: 67,
      GetYourGuide: 52,
      Directo: 48,
      Airbnb: 67,
      TripAdvisor: 25,
    },
    {
      tour: "Sunset Photography",
      Viator: 45,
      GetYourGuide: 38,
      Directo: 28,
      Airbnb: 22,
      TripAdvisor: 38,
    },
  ];

  // Datos de conversión por canal
  const conversionFunnelData = [
    {
      channel: "Viator",
      views: 15420,
      clicks: 2850,
      bookings: 342,
      viewToClick: 18.5,
      clickToBook: 12.0,
    },
    {
      channel: "GetYourGuide",
      views: 12800,
      clicks: 2240,
      bookings: 285,
      viewToClick: 17.5,
      clickToBook: 12.7,
    },
    {
      channel: "Directo",
      views: 8900,
      clicks: 1680,
      bookings: 198,
      viewToClick: 18.9,
      clickToBook: 11.8,
    },
    {
      channel: "Airbnb",
      views: 11200,
      clicks: 1890,
      bookings: 156,
      viewToClick: 16.9,
      clickToBook: 8.3,
    },
    {
      channel: "TripAdvisor",
      views: 9600,
      clicks: 1420,
      bookings: 124,
      viewToClick: 14.8,
      clickToBook: 8.7,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "connected":
        return <CheckCircle size={16} className="text-green-600" />;
      case "active":
        return <Zap size={16} className="text-blue-600" />;
      case "warning":
        return <AlertTriangle size={16} className="text-yellow-600" />;
      case "error":
        return <AlertTriangle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const totalRevenue = channelPerformanceData.reduce(
    (sum, channel) => sum + channel.revenue,
    0
  );
  const totalBookings = channelPerformanceData.reduce(
    (sum, channel) => sum + channel.bookings,
    0
  );
  const avgConversion =
    channelPerformanceData.reduce(
      (sum, channel) => sum + channel.conversion,
      0
    ) / channelPerformanceData.length;
  const totalCommissions = channelPerformanceData.reduce(
    (sum, channel) => sum + (channel.revenue * channel.commission) / 100,
    0
  );

  const pieChartData = channelPerformanceData.map((channel, index) => ({
    name: channel.channel,
    value: channel.revenue,
    percentage: ((channel.revenue / totalRevenue) * 100).toFixed(1),
    color: ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1"][index],
  }));

  return (
    <Layout title="Análisis de Canales">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Globe className="text-purple-600" />
                  Análisis de Canales
                </h1>
                <p className="text-gray-600 mt-2">
                  Performance y optimización de canales de distribución
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex bg-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => setSelectedPeriod("7d")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedPeriod === "7d"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600"
                    }`}
                  >
                    7 días
                  </button>
                  <button
                    onClick={() => setSelectedPeriod("30d")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedPeriod === "30d"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600"
                    }`}
                  >
                    30 días
                  </button>
                  <button
                    onClick={() => setSelectedPeriod("90d")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedPeriod === "90d"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600"
                    }`}
                  >
                    90 días
                  </button>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Download size={20} />
                  Exportar
                </button>
              </div>
            </div>
          </div>

          {/* KPIs Generales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Ingresos Totales
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="text-green-600" size={24} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="text-green-500" size={16} />
                <span className="text-green-500 text-sm font-medium ml-1">
                  +8.4%
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
                    Total Reservas
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalBookings.toLocaleString()}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="text-green-500" size={16} />
                <span className="text-green-500 text-sm font-medium ml-1">
                  +12.1%
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
                    Conversión Promedio
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {avgConversion.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <TrendingUp className="text-purple-600" size={24} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="text-green-500" size={16} />
                <span className="text-green-500 text-sm font-medium ml-1">
                  +1.2%
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
                    Comisiones Totales
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalCommissions.toLocaleString()}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Globe className="text-orange-600" size={24} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-gray-500 text-sm">
                  {((totalCommissions / totalRevenue) * 100).toFixed(1)}% de
                  ingresos
                </span>
              </div>
            </div>
          </div>

          {/* Gráficos principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Evolución temporal */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Evolución de Ingresos por Canal
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      `$${value.toLocaleString()}`,
                      name,
                    ]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="Viator"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                  <Area
                    type="monotone"
                    dataKey="GetYourGuide"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                  />
                  <Area
                    type="monotone"
                    dataKey="Directo"
                    stackId="1"
                    stroke="#ffc658"
                    fill="#ffc658"
                  />
                  <Area
                    type="monotone"
                    dataKey="Airbnb"
                    stackId="1"
                    stroke="#ff7c7c"
                    fill="#ff7c7c"
                  />
                  <Area
                    type="monotone"
                    dataKey="TripAdvisor"
                    stackId="1"
                    stroke="#8dd1e1"
                    fill="#8dd1e1"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Distribución de ingresos */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Distribución de Ingresos
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tabla de performance detallada */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Performance Detallada por Canal
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Canal
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">
                      Estado
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Ingresos
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Reservas
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Ticket Prom.
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Conversión
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Comisión
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Crecimiento
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {channelPerformanceData.map((channel, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {channel.channel.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {channel.channel}
                            </div>
                            <div className="text-xs text-gray-500">
                              Top: {channel.topTour}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getStatusIcon(channel.status)}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              channel.status
                            )}`}
                          >
                            {channel.status === "connected"
                              ? "Conectado"
                              : channel.status === "active"
                              ? "Activo"
                              : channel.status === "warning"
                              ? "Atención"
                              : "Error"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-gray-900">
                        ${channel.revenue.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-600">
                        {channel.bookings}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-600">
                        ${channel.avgTicket}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-600">
                        {channel.conversion}%
                      </td>
                      <td className="py-4 px-4 text-right text-gray-600">
                        {channel.commission}%
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span
                          className={`flex items-center justify-end gap-1 ${
                            channel.growth > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <TrendingUp
                            size={14}
                            className={channel.growth < 0 ? "rotate-180" : ""}
                          />
                          {Math.abs(channel.growth)}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          <ExternalLink size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Análisis de conversión */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Análisis del Embudo de Conversión
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={conversionFunnelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="channel" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" fill="#e3f2fd" name="Vistas" />
                    <Bar dataKey="clicks" fill="#90caf9" name="Clics" />
                    <Bar dataKey="bookings" fill="#2196f3" name="Reservas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                {conversionFunnelData.map((channel, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        {channel.channel}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Eye size={16} />
                          {channel.views.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MousePointer size={16} />
                          {channel.clicks.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <ShoppingCart size={16} />
                          {channel.bookings}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Vista → Clic
                        </span>
                        <span className="font-medium">
                          {channel.viewToClick}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${channel.viewToClick}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Clic → Reserva
                        </span>
                        <span className="font-medium">
                          {channel.clickToBook}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${channel.clickToBook}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Matriz de tours por canal */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Performance de Tours por Canal
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Tour
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">
                      Viator
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">
                      GetYourGuide
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">
                      Directo
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">
                      Airbnb
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">
                      TripAdvisor
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tourChannelMatrix.map((tour, index) => {
                    const total =
                      tour.Viator +
                      tour.GetYourGuide +
                      tour.Directo +
                      tour.Airbnb +
                      tour.TripAdvisor;
                    return (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4 font-medium text-gray-900">
                          {tour.tour}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-medium">{tour.Viator}</span>
                            <div className="w-12 bg-gray-200 rounded-full h-1 mt-1">
                              <div
                                className="bg-purple-500 h-1 rounded-full"
                                style={{
                                  width: `${(tour.Viator / 100) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-medium">
                              {tour.GetYourGuide}
                            </span>
                            <div className="w-12 bg-gray-200 rounded-full h-1 mt-1">
                              <div
                                className="bg-green-500 h-1 rounded-full"
                                style={{
                                  width: `${(tour.GetYourGuide / 100) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-medium">{tour.Directo}</span>
                            <div className="w-12 bg-gray-200 rounded-full h-1 mt-1">
                              <div
                                className="bg-yellow-500 h-1 rounded-full"
                                style={{
                                  width: `${(tour.Directo / 100) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-medium">{tour.Airbnb}</span>
                            <div className="w-12 bg-gray-200 rounded-full h-1 mt-1">
                              <div
                                className="bg-red-500 h-1 rounded-full"
                                style={{
                                  width: `${(tour.Airbnb / 100) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-medium">
                              {tour.TripAdvisor}
                            </span>
                            <div className="w-12 bg-gray-200 rounded-full h-1 mt-1">
                              <div
                                className="bg-blue-500 h-1 rounded-full"
                                style={{
                                  width: `${(tour.TripAdvisor / 100) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-gray-900">
                          {total}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recomendaciones y acciones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3
                className="text-lg font-semibold text-gray-900 mb-4
"
              >
                Recomendaciones de Optimización
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  Incrementar la inversión en publicidad para Viator y
                  GetYourGuide, que muestran un buen rendimiento.
                </li>
                <li>
                  Revisar las tarifas de comisión de Airbnb, que son las más
                  altas y afectan el margen neto.
                </li>
                <li>
                  Mejorar la tasa de conversión de TripAdvisor, que es la más
                  baja entre los canales.
                </li>
                <li>
                  Implementar estrategias de retargeting para aumentar las
                  reservas directas.
                </li>
                <li>
                  Analizar los tours con mejor rendimiento y replicar sus
                  estrategias en otros canales.
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Acciones Inmediatas
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  Actualizar la información de sincronización de canales
                  desconectados.
                </li>
                <li>
                  Revisar las métricas de rendimiento semanalmente para ajustar
                  estrategias.
                </li>
                <li>
                  Programar una reunión con el equipo de marketing para discutir
                  campañas específicas por canal.
                </li>
                <li>
                  Configurar alertas para cambios significativos en el
                  rendimiento de los canales.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default withAuth( ChannelAnalysisReport,'');

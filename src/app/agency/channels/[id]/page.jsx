"use client";
import React, { useState, useEffect } from "react";
import {
  Settings,
  Wifi,
  WifiOff,
  RefreshCw,
  Plus,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import Layout from "../../components/layout/layout";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";

const ChannelManager = () => {
  const [channels, setChannels] = useState([
    {
      id: 1,
      name: "Viator",
      logo: "https://via.placeholder.com/40x40/FF6B35/ffffff?text=V",
      status: "connected",
      lastSync: "2024-12-26 14:30",
      toursConnected: 12,
      bookingsToday: 8,
      revenue: 2450.0,
    },
    {
      id: 2,
      name: "GetYourGuide",
      logo: "https://via.placeholder.com/40x40/00A3E0/ffffff?text=G",
      status: "error",
      lastSync: "2024-12-25 09:15",
      toursConnected: 8,
      bookingsToday: 3,
      revenue: 890.0,
    },
    {
      id: 3,
      name: "Airbnb Experiences",
      logo: "https://via.placeholder.com/40x40/FF5A5F/ffffff?text=A",
      status: "connected",
      lastSync: "2024-12-26 15:45",
      toursConnected: 5,
      bookingsToday: 2,
      revenue: 350.0,
    },
    {
      id: 4,
      name: "Booking.com",
      logo: "https://via.placeholder.com/40x40/003580/ffffff?text=B",
      status: "disconnected",
      lastSync: "Nunca",
      toursConnected: 0,
      bookingsToday: 0,
      revenue: 0,
    },
  ]);

  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [syncStatus, setSyncStatus] = useState({});
  const [tours] = useState([
    { id: 1, name: "Tour Histórico Centro", mapped: true },
    { id: 2, name: "Tour Gastronómico", mapped: false },
    { id: 3, name: "Tour Playa Cristal", mapped: true },
    { id: 4, name: "Tour Ciudad Perdida 4 días", mapped: false },
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "syncing":
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <WifiOff className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "connected":
        return "Conectado";
      case "error":
        return "Error";
      case "syncing":
        return "Sincronizando";
      default:
        return "Desconectado";
    }
  };

  const handleSync = async (channelId) => {
    setSyncStatus({ ...syncStatus, [channelId]: "syncing" });

    // Simular sincronización
    setTimeout(() => {
      setChannels(
        channels.map((channel) =>
          channel.id === channelId
            ? {
                ...channel,
                status: "connected",
                lastSync: new Date().toLocaleString("es-ES"),
              }
            : channel
        )
      );
      setSyncStatus({ ...syncStatus, [channelId]: "completed" });
    }, 3000);
  };

  const ConfigModal = ({ channel, onClose }) => {
    const [config, setConfig] = useState({
      apiKey: "",
      secretKey: "",
      syncFrequency: "30",
      autoSync: true,
      tourMapping: {},
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <img
                src={channel.logo}
                alt={channel.name}
                className="w-10 h-10 rounded"
              />
              <h2 className="text-2xl font-bold">Configurar {channel.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuración de Conexión */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Credenciales de API</h3>
              <div>
                <label className="block text-sm font-medium mb-2">
                  API Key
                </label>
                <input
                  type="text"
                  value={config.apiKey}
                  onChange={(e) =>
                    setConfig({ ...config, apiKey: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingresa tu API Key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Secret Key
                </label>
                <input
                  type="password"
                  value={config.secretKey}
                  onChange={(e) =>
                    setConfig({ ...config, secretKey: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingresa tu Secret Key"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Frecuencia de Sincronización
                </label>
                <select
                  value={config.syncFrequency}
                  onChange={(e) =>
                    setConfig({ ...config, syncFrequency: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="15">Cada 15 minutos</option>
                  <option value="30">Cada 30 minutos</option>
                  <option value="60">Cada hora</option>
                  <option value="240">Cada 4 horas</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoSync"
                  checked={config.autoSync}
                  onChange={(e) =>
                    setConfig({ ...config, autoSync: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="autoSync" className="text-sm">
                  Sincronización automática
                </label>
              </div>
            </div>

            {/* Mapeo de Tours */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Mapeo de Tours</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {tours.map((tour) => (
                  <div
                    key={tour.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{tour.name}</p>
                      <p className="text-sm text-gray-500">
                        ID Local: {tour.id}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {tour.mapped ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Mapeado
                        </span>
                      ) : (
                        <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
                          Mapear
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                // Guardar configuración
                onClose();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout title="Gestión de Canales">
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto">
          {/* Header */}
          <div className="mb-8">
            <p className="text-gray-600">
              Administra las integraciones con plataformas de reserva
            </p>
          </div>

          {/* Resumen de Canales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Canales Activos
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {channels.filter((c) => c.status === "connected").length}
                  </p>
                </div>
                <Wifi className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Reservas Hoy
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {channels.reduce((sum, c) => sum + c.bookingsToday, 0)}
                  </p>
                </div>
                <RefreshCw className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Ingresos Hoy
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    $
                    {channels
                      .reduce((sum, c) => sum + c.revenue, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">$</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tours Conectados
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {channels.reduce((sum, c) => sum + c.toursConnected, 0)}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-indigo-500" />
              </div>
            </div>
          </div>

          {/* Lista de Canales */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Canales de Distribución
                </h2>
                {/*<button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  <Plus className="w-4 h-4" />
                  Agregar Canal
                </button>*/}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Canal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Sincronización
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tours Conectados
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reservas Hoy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ingresos Hoy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {channels.map((channel) => (
                    <tr key={channel.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={channel.logo}
                            alt={channel.name}
                            className="w-10 h-10 rounded mr-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {channel.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {syncStatus[channel.id] === "syncing" ? (
                            <>
                              <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                              <span className="text-sm text-blue-600">
                                Sincronizando...
                              </span>
                            </>
                          ) : (
                            <>
                              {getStatusIcon(channel.status)}
                              <span
                                className={`text-sm ${
                                  channel.status === "connected"
                                    ? "text-green-600"
                                    : channel.status === "error"
                                    ? "text-red-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {getStatusText(channel.status)}
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {channel.lastSync}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {channel.toursConnected}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {channel.bookingsToday}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${channel.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSync(channel.id)}
                            disabled={syncStatus[channel.id] === "syncing"}
                            className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                            title="Sincronizar"
                          >
                            <RefreshCw
                              className={`w-4 h-4 ${
                                syncStatus[channel.id] === "syncing"
                                  ? "animate-spin"
                                  : ""
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedChannel(channel);
                              setShowConfig(true);
                            }}
                            className="text-gray-600 hover:text-gray-900"
                            title="Configurar"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal de Configuración */}
          {showConfig && selectedChannel && (
            <ConfigModal
              channel={selectedChannel}
              onClose={() => {
                setShowConfig(false);
                setSelectedChannel(null);
              }}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default withAuth( ChannelManager,'');


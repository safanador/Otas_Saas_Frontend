"use client";
import React, { useState, useEffect } from "react";
import {
  Globe,
  Code,
  Key,
  Copy,
  CheckCircle,
  AlertCircle,
  Download,
  ExternalLink,
  Settings,
  Zap,
  Shield,
  Book,
  Webhook,
  Database,
} from "lucide-react";
import Layout from "../../components/layout/layout";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";

const DirectChannelIntegration = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState("");
  const [webhookStatus, setWebhookStatus] = useState("active");
  const [apiStats, setApiStats] = useState({
    totalRequests: 1247,
    successRate: 98.5,
    lastRequest: "2024-12-26 16:45:32",
    avgResponseTime: 125,
  });

  const integrationMethods = [
    {
      id: "api",
      title: "REST API",
      description: "Integración directa mediante API REST para máximo control",
      icon: <Code className="w-6 h-6" />,
      difficulty: "Avanzado",
      timeToImplement: "2-4 días",
      pros: ["Control total", "Personalización completa", "Tiempo real"],
      cons: ["Requiere desarrollo", "Mantenimiento técnico"],
    },
    {
      id: "webhook",
      title: "Webhooks",
      description:
        "Recibe notificaciones automáticas cuando hay nuevas reservas",
      icon: <Webhook className="w-6 h-6" />,
      difficulty: "Intermedio",
      timeToImplement: "1-2 días",
      pros: ["Automático", "Tiempo real", "Fácil implementación"],
      cons: ["Menos control", "Dependiente de conectividad"],
    },
  ];

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  const generateApiKey = () => {
    return (
      "cm_live_" +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  const [apiKey] = useState(generateApiKey());
  const webhookUrl = "https://api.channelmanager.com/webhooks/bookings";
  const apiEndpoint = "https://api.channelmanager.com/v1/bookings";

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Estado de Integración */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">
              Canal Directo Configurado
            </h3>
            <p className="text-blue-700 mt-1">
              Tu sitio web está conectado y recibiendo reservas
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <span className="text-sm font-medium text-green-700">Activo</span>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Requests API</p>
              <p className="text-2xl font-bold">
                {apiStats.totalRequests.toLocaleString()}
              </p>
            </div>
            <Database className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tasa de Éxito</p>
              <p className="text-2xl font-bold">{apiStats.successRate}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div>
            <p className="text-sm text-gray-600">Último Request</p>
            <p className="text-sm font-medium">{apiStats.lastRequest}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div>
            <p className="text-sm text-gray-600">Tiempo Respuesta</p>
            <p className="text-2xl font-bold">{apiStats.avgResponseTime}ms</p>
          </div>
        </div>
      </div>

      {/* Métodos de Integración */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Métodos de Integración Disponibles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {integrationMethods.map((method) => (
            <div
              key={method.id}
              className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                {method.icon}
                <h4 className="font-semibold">{method.title}</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4">{method.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Dificultad:</span>
                  <span
                    className={`font-medium ${
                      method.difficulty === "Básico"
                        ? "text-green-600"
                        : method.difficulty === "Intermedio"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {method.difficulty}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Implementación:</span>
                  <span className="font-medium">{method.timeToImplement}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab(method.id)}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              >
                Ver Detalles
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ApiTab = () => (
    <div className="space-y-6">
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Key className="w-5 h-5" />
          Credenciales de API
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">API Key</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiKey}
                readOnly
                className="flex-1 px-3 py-2 border bg-gray-50 rounded-md font-mono text-sm"
              />
              <button
                onClick={() => copyToClipboard(apiKey, "apiKey")}
                className="px-3 py-2 bg-gray-100 border rounded-md hover:bg-gray-200 transition-colors"
              >
                {copied === "apiKey" ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Base URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiEndpoint}
                readOnly
                className="flex-1 px-3 py-2 border bg-gray-50 rounded-md font-mono text-sm"
              />
              <button
                onClick={() => copyToClipboard(apiEndpoint, "endpoint")}
                className="px-3 py-2 bg-gray-100 border rounded-md hover:bg-gray-200 transition-colors"
              >
                {copied === "endpoint" ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ejemplo de Implementación */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          Ejemplo de Implementación
        </h3>

        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <pre>{`// Crear nueva reserva
const bookingData = {
  tourId: 123,
  customerName: "Juan Pérez",
  customerEmail: "juan@email.com",
  customerPhone: "+57 300 123 4567",
  bookingDate: "2024-12-28",
  bookingTime: "09:00",
  numberOfPeople: 4,
  totalAmount: 200.00,
  currency: "USD",
  paymentStatus: "paid"
};

fetch('${apiEndpoint}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${apiKey}',
    'X-Channel-Source': 'website'
  },
  body: JSON.stringify(bookingData)
})
.then(response => response.json())
.then(data => {
  console.log('Reserva creada:', data);
})
.catch(error => {
  console.error('Error:', error);
});`}</pre>
        </div>

        <div className="mt-4 flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            <Download className="w-4 h-4" />
            Descargar SDK
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50">
            <Book className="w-4 h-4" />
            Ver Documentación
          </button>
        </div>
      </div>
    </div>
  );

  const WebhookTab = () => (
    <div className="space-y-6">
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Webhook className="w-5 h-5" />
          Configuración de Webhooks
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              URL del Webhook
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://tusitio.com/webhook/bookings"
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Guardar
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Eventos a Notificar
            </label>
            <div className="space-y-2">
              {[
                "booking.created",
                "booking.updated",
                "booking.cancelled",
                "payment.completed",
              ].map((event) => (
                <label key={event} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-mono">{event}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700">
                Webhook activo y funcionando
              </span>
            </div>
            <button className="text-green-600 hover:text-green-800">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Ejemplo de Payload */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Ejemplo de Payload</h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <pre>{`{
  "event": "booking.created",
  "timestamp": "2024-12-26T16:45:32Z",
  "data": {
    "bookingId": "BK-2024-001234",
    "tourId": 123,
    "tourName": "Tour Histórico Centro",
    "customer": {
      "name": "Juan Pérez",
      "email": "juan@email.com",
      "phone": "+57 300 123 4567"
    },
    "booking": {
      "date": "2024-12-28",
      "time": "09:00",
      "numberOfPeople": 4,
      "totalAmount": 200.00,
      "currency": "USD",
      "status": "confirmed"
    },
    "payment": {
      "status": "paid",
      "method": "credit_card",
      "transactionId": "tx_1234567890"
    }
  }
}`}</pre>
        </div>
      </div>

      {/* Test Webhook */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Probar Webhook</h3>
        <p className="text-gray-600 mb-4">
          Envía un webhook de prueba para verificar que tu endpoint está
          funcionando correctamente
        </p>
        <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
          <Zap className="w-4 h-4" />
          Enviar Webhook de Prueba
        </button>
      </div>
    </div>
  );

  const EmbedTab = () => (
    <div className="space-y-6">
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Widget de Reservas
        </h3>

        <p className="text-gray-600 mb-4">
          Integra directamente nuestro sistema de reservas en tu sitio web. Solo
          copia y pega el código HTML en tu página.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Código de Integración
            </label>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`<div id="channel-manager-widget"></div>
<script src="https://cdn.channelmanager.com/widget.js"></script>
<script>
  ChannelManager.init({
    containerId: 'channel-manager-widget',
    apiKey: '${apiKey}',
    theme: 'light',
    language: 'es',
    currency: 'USD'
  });
</script>`}</pre>
            </div>
            <button
              onClick={() =>
                copyToClipboard(
                  `<div id="channel-manager-widget"></div>
<script src="https://cdn.channelmanager.com/widget.js"></script>
<script>
  ChannelManager.init({
    containerId: 'channel-manager-widget',
    apiKey: '${apiKey}',
    theme: 'light',
    language: 'es',
    currency: 'USD'
  });
</script>`,
                  "widget"
                )
              }
              className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {copied === "widget" ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              Copiar Código
            </button>
          </div>

          <div>
            <h4 className="font-medium mb-2">Opciones de Personalización</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tema</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Idioma</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vista Previa */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Vista Previa del Widget</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg max-w-md mx-auto">
            <h4 className="font-bold text-lg mb-4">Sistema de Reservas</h4>
            <div className="space-y-3 text-left">
              <input
                type="text"
                placeholder="Seleccionar tour..."
                className="w-full px-3 py-2 text-gray-800 rounded"
              />
              <input
                type="date"
                className="w-full px-3 py-2 text-gray-800 rounded"
              />
              <input
                type="number"
                placeholder="Número de personas"
                className="w-full px-3 py-2 text-gray-800 rounded"
              />
              <button className="w-full bg-yellow-500 text-blue-900 py-2 rounded font-semibold hover:bg-yellow-400">
                Reservar Ahora
              </button>
            </div>
          </div>
          <p className="text-gray-500 mt-4 text-sm">
            Vista previa del widget integrado
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <Layout title="Integración Canal Directo">
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900">
                Canal Directo
              </h1>
            </div>
            <p className="text-gray-600">
              Integra las reservas de tu sitio web directamente con el Channel
              Manager
            </p>
          </div>

          {/* Navegación */}
          <div className="bg-white border-b mb-6">
            <nav className="flex space-x-8">
              {[
                {
                  id: "overview",
                  name: "Resumen",
                  icon: <Settings className="w-4 h-4" />,
                },
                {
                  id: "api",
                  name: "REST API",
                  icon: <Code className="w-4 h-4" />,
                },
                {
                  id: "webhook",
                  name: "Webhooks",
                  icon: <Webhook className="w-4 h-4" />,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Contenido */}
          <div>
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "api" && <ApiTab />}
            {activeTab === "webhook" && <WebhookTab />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth( DirectChannelIntegration,'');

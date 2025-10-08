"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Save,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Image,
  Calendar,
  Upload,
  X,
  GripVertical,
} from "lucide-react";
import Layout from "@/app/agency/components/layout/layout";
import withAuth from "@/app/middleware/withAuth";
import endpoints from "@/lib/endpoints";
import { fetchData } from "@/services/api";
import TourImageUploader from "../../components/TourImageUploader";

const CreateTourPage = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [tourData, setTourData] = useState({
    name: "",
    description: "",
    duration: { hours: "", minutes: "" },
    meetingPoint: "",
    requirements: "",
    categoryId: "",
    basePrice: "",
    adultPrice: "",
    childPrice: "",
    seniorPrice: "",
    currency: "USD",
    maxCapacity: "",
    images: [],
  });

  const [schedules, setSchedules] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchData(endpoints.category_getAll());

        if (response.error) {
          return console.log(response.error);
        }

        setCategories(response);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchCategories();
  }, []);

  const tabs = [
    { id: "basic", label: "Información Básica", icon: MapPin },
    { id: "schedule", label: "Horarios y Capacidad", icon: Calendar },
    { id: "pricing", label: "Precios", icon: DollarSign },
    { id: "images", label: "Imágenes", icon: Image },
  ];

  const handleInputChange = (field, value) => {
    setTourData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDurationChange = (type, value) => {
    setTourData((prev) => ({
      ...prev,
      duration: { ...prev.duration, [type]: value },
    }));
  };

  const addSchedule = () => {
    if (selectedDate) {
      const newSchedule = {
        id: Date.now(),
        date: selectedDate,
        startTime: "09:00",
        endTime: "12:00",
        maxCapacity: tourData.maxCapacity || 10,
      };
      setSchedules([...schedules, newSchedule]);
      setSelectedDate("");
    }
  };

  const removeSchedule = (id) => {
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  function handleUploadImagesComplete(uploadedImages) {
    setTourData((prev) => ({
      ...prev,
      images: uploadedImages,
    }));
  }

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del Tour *
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Ej: City Walking Tour"
          value={tourData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción *
        </label>
        <textarea
          rows="6"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Describe el tour, qué incluye, qué verán los participantes..."
          value={tourData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Duración *
        </label>
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="number"
              min="0"
              max="23"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Horas"
              value={tourData.duration.hours}
              onChange={(e) => handleDurationChange("hours", e.target.value)}
            />
          </div>
          <div className="flex-1">
            <input
              type="number"
              min="0"
              max="59"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Minutos"
              value={tourData.duration.minutes}
              onChange={(e) => handleDurationChange("minutes", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Punto de Encuentro *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Ej: Plaza Central, frente a la fuente"
            value={tourData.meetingPoint}
            onChange={(e) => handleInputChange("meetingPoint", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Requisitos para Participantes
        </label>
        <textarea
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Ej: Calzado cómodo, ropa apropiada, nivel de condición física requerido..."
          value={tourData.requirements}
          onChange={(e) => handleInputChange("requirements", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categoría *
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          value={tourData.categoryId}
          onChange={(e) => handleInputChange("categoryId", e.target.value)}
        >
          <option value="" disabled>
            Selecciona una categoría
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Mostrar descripción de la categoría seleccionada */}
        {tourData.categoryId && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-black">
              {
                categories.find((cat) => cat.id == tourData.categoryId)
                  ?.description
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">
          Agregar Nuevo Horario
        </h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacidad Máxima
            </label>
            <input
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="10"
              value={tourData.maxCapacity}
              onChange={(e) => handleInputChange("maxCapacity", e.target.value)}
            />
          </div>
          <button
            onClick={addSchedule}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Agregar
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-4">Horarios Programados</h3>
        {schedules.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No hay horarios programados</p>
            <p className="text-sm">Agrega fechas y horarios para tu tour</p>
          </div>
        ) : (
          <div className="space-y-3">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(schedule.date).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {schedule.startTime} - {schedule.endTime}
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    <span>Máx. {schedule.maxCapacity} personas</span>
                  </div>
                </div>
                <button
                  onClick={() => removeSchedule(schedule.id)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Moneda
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={tourData.currency}
          onChange={(e) => handleInputChange("currency", e.target.value)}
        >
          <option value="USD">USD - Dólar Americano</option>
          <option value="EUR">EUR - Euro</option>
          <option value="MXN">MXN - Peso Mexicano</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio Base *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0.00"
              value={tourData.basePrice}
              onChange={(e) => handleInputChange("basePrice", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio Adulto
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0.00"
              value={tourData.adultPrice}
              onChange={(e) => handleInputChange("adultPrice", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio Niño
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0.00"
              value={tourData.childPrice}
              onChange={(e) => handleInputChange("childPrice", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio Senior
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0.00"
              value={tourData.seniorPrice}
              onChange={(e) => handleInputChange("seniorPrice", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Notas sobre Precios</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>
            • El precio base se aplicará si no se especifican precios especiales
          </li>
          <li>
            • Los precios especiales tienen prioridad sobre el precio base
          </li>
          <li>• Deja en blanco los campos que no necesites</li>
        </ul>
      </div>
    </div>
  );

  const handleSubmit = () => {
    console.log("Tour data:", tourData);
    console.log("Schedules:", schedules);
    // Aquí iría la lógica para enviar los datos al backend
    alert("Tour creado exitosamente!");
  };

  return (
    <Layout title="Creación de tour">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Crear Nuevo Tour
                  </h1>
                  <p className="mt-2 text-gray-600">
                    Completa la información para crear tu tour
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Crear Tour
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-4">
          <div className="flex flex-col gap-8">
            {/* Sidebar with tabs */}
            <div className="lg:w-64">
              <nav className="flex space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-indigo-100 text-indigo-700 border-b-2 border-indigo-500"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Main content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm border p-8">
                {activeTab === "basic" && renderBasicInfo()}
                {activeTab === "schedule" && renderSchedule()}
                {activeTab === "pricing" && renderPricing()}
                {activeTab === "images" && <TourImageUploader onUploadComplete={handleUploadImagesComplete} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(CreateTourPage, "");

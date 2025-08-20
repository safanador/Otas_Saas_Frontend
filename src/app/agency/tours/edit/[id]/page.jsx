"use client";
import React, { useState, useEffect } from "react";
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
  Edit,
  Trash2,
} from "lucide-react";
import Layout from "@/app/agency/components/layout/layout";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";

const EditTourPage = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [tourData, setTourData] = useState({
    id: 1,
    name: "",
    description: "",
    duration: { hours: "", minutes: "" },
    meetingPoint: "",
    requirements: "",
    basePrice: "",
    adultPrice: "",
    childPrice: "",
    seniorPrice: "",
    currency: "USD",
    maxCapacity: "",
    status: "active",
    images: [],
  });

  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const tabs = [
    { id: "basic", label: "Información Básica", icon: MapPin },
    { id: "schedule", label: "Horarios y Capacidad", icon: Calendar },
    { id: "pricing", label: "Precios", icon: DollarSign },
    { id: "images", label: "Imágenes", icon: Image },
  ];

  // Simular carga de datos existentes
  useEffect(() => {
    const loadTourData = () => {
      // Simular datos existentes del tour
      setTourData({
        id: 1,
        name: "City Walking Tour",
        description:
          "Descubre la historia fascinante de nuestra ciudad mientras caminas por sus calles más emblemáticas. Este tour te llevará a través de los monumentos más importantes, plazas históricas y barrios tradicionales.",
        duration: { hours: "3", minutes: "30" },
        meetingPoint: "Plaza Central, frente a la fuente principal",
        requirements:
          "Calzado cómodo para caminar, protector solar, agua. Nivel de condición física: básico.",
        basePrice: "45",
        adultPrice: "45",
        childPrice: "25",
        seniorPrice: "35",
        currency: "USD",
        maxCapacity: "15",
        status: "active",
        images: [
          {
            id: 1,
            url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400",
            name: "plaza-central.jpg",
          },
          {
            id: 2,
            url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
            name: "catedral.jpg",
          },
        ],
      });

      setSchedules([
        {
          id: 1,
          date: "2024-12-15",
          startTime: "09:00",
          endTime: "12:30",
          maxCapacity: 15,
          booked: 8,
        },
        {
          id: 2,
          date: "2024-12-16",
          startTime: "14:00",
          endTime: "17:30",
          maxCapacity: 15,
          booked: 12,
        },
        {
          id: 3,
          date: "2024-12-20",
          startTime: "09:00",
          endTime: "12:30",
          maxCapacity: 15,
          booked: 0,
        },
      ]);

      setIsLoading(false);
    };

    // Simular delay de carga
    setTimeout(loadTourData, 1000);
  }, []);

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
        maxCapacity: parseInt(tourData.maxCapacity) || 10,
        booked: 0,
      };
      setSchedules([...schedules, newSchedule]);
      setSelectedDate("");
    }
  };

  const removeSchedule = (id) => {
    const schedule = schedules.find((s) => s.id === id);
    if (schedule && schedule.booked > 0) {
      if (
        !confirm(
          `Este horario tiene ${schedule.booked} reservas. ¿Estás seguro de eliminarlo?`
        )
      ) {
        return;
      }
    }
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  const updateSchedule = (id, field, value) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === id ? { ...schedule, [field]: value } : schedule
      )
    );
  };

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setTourData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const removeImage = (id) => {
    setTourData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== id),
    }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);

    // Validación básica
    if (!tourData.name.trim()) {
      alert("Por favor ingresa el nombre del tour");
      setIsSaving(false);
      return;
    }

    if (!tourData.description.trim()) {
      alert("Por favor ingresa la descripción del tour");
      setIsSaving(false);
      return;
    }

    if (!tourData.basePrice || parseFloat(tourData.basePrice) <= 0) {
      alert("Por favor ingresa un precio base válido");
      setIsSaving(false);
      return;
    }

    try {
      // Simular guardado
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Datos del tour guardados:", {
        tourData,
        schedules,
      });

      alert("Tour actualizado exitosamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar el tour. Por favor intenta de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-blue-900">Estado del Tour</h3>
            <p className="text-sm text-blue-700">
              Este tour está actualmente{" "}
              {tourData.status === "active" ? "activo" : "inactivo"}
            </p>
          </div>
          <button
            onClick={() =>
              handleInputChange(
                "status",
                tourData.status === "active" ? "inactive" : "active"
              )
            }
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tourData.status === "active"
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {tourData.status === "active" ? "Desactivar" : "Activar"}
          </button>
        </div>
      </div>

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
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(schedule.date).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <input
                          type="time"
                          value={schedule.startTime}
                          onChange={(e) =>
                            updateSchedule(
                              schedule.id,
                              "startTime",
                              e.target.value
                            )
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-xs"
                        />
                        <span className="mx-2">-</span>
                        <input
                          type="time"
                          value={schedule.endTime}
                          onChange={(e) =>
                            updateSchedule(
                              schedule.id,
                              "endTime",
                              e.target.value
                            )
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-xs"
                        />
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        <input
                          type="number"
                          min="1"
                          value={schedule.maxCapacity}
                          onChange={(e) =>
                            updateSchedule(
                              schedule.id,
                              "maxCapacity",
                              parseInt(e.target.value)
                            )
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-xs w-16"
                        />
                        <span className="ml-1">max</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeSchedule(schedule.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                    title="Eliminar horario"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {schedule.booked > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-yellow-600 mr-2" />
                        <span className="text-sm font-medium text-yellow-800">
                          {schedule.booked} de {schedule.maxCapacity} lugares
                          reservados
                        </span>
                      </div>
                      <div className="text-xs text-yellow-600">
                        {Math.round(
                          (schedule.booked / schedule.maxCapacity) * 100
                        )}
                        % ocupado
                      </div>
                    </div>
                    <div className="mt-2 bg-yellow-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (schedule.booked / schedule.maxCapacity) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
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
        <h4 className="font-medium text-gray-900 mb-2">
          Información de Precios
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 bg-white rounded border">
            <div className="font-semibold text-lg text-indigo-600">
              ${tourData.adultPrice || tourData.basePrice}
            </div>
            <div className="text-gray-600">Precio Adulto</div>
          </div>
          <div className="text-center p-3 bg-white rounded border">
            <div className="font-semibold text-lg text-green-600">
              ${tourData.childPrice || tourData.basePrice}
            </div>
            <div className="text-gray-600">Precio Niño</div>
          </div>
          <div className="text-center p-3 bg-white rounded border">
            <div className="font-semibold text-lg text-orange-600">
              ${tourData.seniorPrice || tourData.basePrice}
            </div>
            <div className="text-gray-600">Precio Senior</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderImages = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subir Nuevas Imágenes
        </label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleImageUpload(e.dataTransfer.files);
          }}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            Arrastra y suelta las imágenes aquí
          </p>
          <p className="text-sm text-gray-500 mb-4">o</p>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            id="image-upload"
            onChange={(e) => handleImageUpload(e.target.files)}
          />
          <label
            htmlFor="image-upload"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Seleccionar Archivos
          </label>
        </div>
      </div>

      {tourData.images.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-4">
            Imágenes del Tour ({tourData.images.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tourData.images.map((image, index) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                    <button className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeImage(image.id)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-1 bg-black bg-opacity-50 text-white rounded cursor-move">
                    <GripVertical className="w-4 h-4" />
                  </div>
                </div>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    Principal
                  </div>
                )}
                <div className="mt-2 text-xs text-gray-600 truncate">
                  {image.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información del tour...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout title="Creación de tour">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  Editar Tour: {tourData.name}
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-4">
          <div className="flex flex-col">
            {/* Sidebar de navegación */}
            <div className="w-64 mr-8 my-4">
              <nav className="flex space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-indigo-50 text-indigo-700 border-b-4 border-indigo-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Contenido principal */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                {activeTab === "basic" && renderBasicInfo()}
                {activeTab === "schedule" && renderSchedule()}
                {activeTab === "pricing" && renderPricing()}
                {activeTab === "images" && renderImages()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth( EditTourPage,'');

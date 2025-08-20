"use client";
import React, { useState } from "react";
import {
  Search,
  Filter,
  Edit,
  Power,
  PowerOff,
  Plus,
  MapPin,
  Clock,
  DollarSign,
} from "lucide-react";
import Layout from "@/app/agency/components/layout/layout";
import { useRouter } from "next/navigation";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";

const ToursListPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Mock data
  const [tours, setTours] = useState([
    {
      id: 1,
      name: "City Walking Tour",
      duration: "3 horas",
      basePrice: 45,
      status: "active",
      category: "cultural",
      description:
        "Descubre la historia de la ciudad caminando por sus calles más emblemáticas",
      meetingPoint: "Plaza Central",
    },
    {
      id: 2,
      name: "Mountain Adventure",
      duration: "6 horas",
      basePrice: 120,
      status: "active",
      category: "adventure",
      description: "Aventura extrema en las montañas con vistas espectaculares",
      meetingPoint: "Base Camp",
    },
    {
      id: 3,
      name: "Food & Wine Experience",
      duration: "4 horas",
      basePrice: 85,
      status: "inactive",
      category: "gastronomy",
      description: "Degustación de platos locales y vinos de la región",
      meetingPoint: "Mercado Central",
    },
    {
      id: 4,
      name: "Beach Sunset Tour",
      duration: "2.5 horas",
      basePrice: 35,
      status: "active",
      category: "nature",
      description: "Disfruta del atardecer más hermoso en nuestras playas",
      meetingPoint: "Muelle Principal",
    },
  ]);

  const categories = [
    { value: "all", label: "Todas las categorías" },
    { value: "cultural", label: "Cultural" },
    { value: "adventure", label: "Aventura" },
    { value: "gastronomy", label: "Gastronomía" },
    { value: "nature", label: "Naturaleza" },
  ];

  const filteredTours = tours.filter((tour) => {
    const matchesSearch = tour.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || tour.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || tour.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const toggleTourStatus = (tourId) => {
    setTours(
      tours.map((tour) =>
        tour.id === tourId
          ? {
              ...tour,
              status: tour.status === "active" ? "inactive" : "active",
            }
          : tour
      )
    );
  };

  const getStatusBadge = (status) => {
    return status === "active" ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Activo
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Inactivo
      </span>
    );
  };

  return (
    <Layout title="Lista de Tours">
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar tours por nombre..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="lg:w-48">
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="lg:w-48">
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="my-4 bg-white rounded-lg shadow-sm border p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {tours.length}
                </div>
                <div className="text-sm text-gray-600">Total de Tours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {tours.filter((t) => t.status === "active").length}
                </div>
                <div className="text-sm text-gray-600">Tours Activos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {tours.filter((t) => t.status === "inactive").length}
                </div>
                <div className="text-sm text-gray-600">Tours Inactivos</div>
              </div>
            </div>
          </div>

          {/* Tours Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTours.map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {tour.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {tour.description}
                      </p>
                    </div>
                    {getStatusBadge(tour.status)}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{tour.duration}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{tour.meetingPoint}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span className="font-semibold text-gray-900">
                        ${tour.basePrice}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <button 
                      onClick={() => router.push(`/agency/tours/edit/${tour.id}`)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </button>

                    <button
                      onClick={() => toggleTourStatus(tour.id)}
                      className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        tour.status === "active"
                          ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                          : "text-green-600 hover:text-green-700 hover:bg-green-50"
                      }`}
                    >
                      {tour.status === "active" ? (
                        <>
                          <PowerOff className="w-4 h-4 mr-1" />
                          Desactivar
                        </>
                      ) : (
                        <>
                          <Power className="w-4 h-4 mr-1" />
                          Activar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTours.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron tours
              </h3>
              <p className="text-gray-600">
                Intenta ajustar los filtros o crear un nuevo tour.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default withAuth( ToursListPage, '');


'use client';

import React from 'react';
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Layout from '../../components/layout/layout';
import withAuth from '@/app/middleware/withAuth';
import permissions from '@/lib/permissions';

function KPICard({ title, value, change, changeType = 'neutral', icon: Icon }) {
   const changeColors = {
    positive: 'text-green-600 bg-green-100',
    negative: 'text-red-600 bg-red-100',
    neutral: 'text-gray-600 bg-gray-100',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${changeColors[changeType]}`}>
              <TrendingUp className="w-3 h-3 mr-1" />
              {change}
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-full">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
}

function TourItem({ name, time, participants, status }) {
   const statusConfig = {
    confirmed: { color: 'text-green-600 bg-green-100', icon: CheckCircle, text: 'Confirmado' },
    pending: { color: 'text-yellow-600 bg-yellow-100', icon: Clock, text: 'Pendiente' },
    cancelled: { color: 'text-red-600 bg-red-100', icon: AlertCircle, text: 'Cancelado' },
  };

   const config = statusConfig[status];
   const StatusIcon = config.icon;

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-50 rounded-full">
          <MapPin className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900">{name}</h4>
          <p className="text-sm text-gray-500">{time} • {participants} participantes</p>
        </div>
      </div>
      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <StatusIcon className="w-3 h-3 mr-1" />
        {config.text}
      </div>
    </div>
  );
}

const DashboardPage = () => {
  const kpiData = [
    {
      title: 'Reservas Hoy',
      value: 24,
      change: '+12%',
      changeType: 'positive',
      icon: Calendar,
    },
    {
      title: 'Ingresos del Mes',
      value: '$45,230',
      change: '+8.2%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      title: 'Ocupación Promedio',
      value: '78%',
      change: '+2.4%',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Tours Activos',
      value: 16,
      change: '+3',
      changeType: 'neutral'  ,
      icon: MapPin,
    },
  ];

   const upcomingTours = [
    {
      name: 'City Walking Tour',
      time: '09:00 AM',
      participants: 8,
      status: 'confirmed'  ,
    },
    {
      name: 'Museum & History Tour',
      time: '11:30 AM',
      participants: 5,
      status: 'confirmed'  ,
    },
    {
      name: 'Food & Culture Experience',
      time: '02:00 PM',
      participants: 12,
      status: 'pending'  ,
    },
    {
      name: 'Sunset Photography Tour',
      time: '06:00 PM',
      participants: 6,
      status: 'confirmed'  ,
    },
  ];

  return (
    <Layout title="Dashboard Principal">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Placeholder */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reservas por Día</h3>
              <select className="text-sm border border-gray-300 rounded-md px-3 py-1">
                <option>Últimos 7 días</option>
                <option>Últimos 30 días</option>
                <option>Últimos 3 meses</option>
              </select>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Gráfico de reservas</p>
                <p className="text-sm text-gray-400">Integración con biblioteca de gráficos</p>
              </div>
            </div>
          </div>

          {/* Upcoming Tours */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Próximos Tours</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Ver todos
              </button>
            </div>
            <div className="space-y-2">
              {upcomingTours.map((tour, index) => (
                <TourItem key={index} {...tour} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withAuth( DashboardPage,'' );
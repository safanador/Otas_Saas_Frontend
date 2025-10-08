"use client";
import React, { useEffect, useState } from "react";
import {
  Calendar,
  User,
  Building,
  MessageSquare,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";
import AdminLayout from "../components/SideBar/AdminLayout";
import { useToast } from "@/hooks/use-toast";

const TicketSystem = () => {
  const { toast } = useToast();
  const [expandedTickets, setExpandedTickets] = useState(new Set());
  const [responses, setResponses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState([
    /*{
      id: 1,
      subject: "Problema con reservas",
      initialMessage: "No puedo acceder al módulo de reservas",
      status: "open",
      createdAt: "2025-07-14T06:49:22.306Z",
      updatedAt: "2025-07-14T07:09:01.000Z",
      closedAt: null,
      agency: {
        id: 1,
        name: "Turcol SAS",
      },
      createdBy: {
        id: 16,
        name: "Luisa Castilla",
        email: "sergioafanador103@gmail.com",
      },
      closedBy: null,
      responses: [
        {
          id: 1,
          message:
            "Hemos identificado el problema... Lo resolveremos lo más pronto posible.",
          isInternal: false,
          createdAt: "2025-07-14T06:58:03.496Z",
          author: {
            id: 1,
            name: "Sergio Afanador",
            email: "sergioafanador102@gmail.com",
          },
        },
        {
          id: 2,
          message: "Muchas gracias por su atención oportuna.",
          isInternal: false,
          createdAt: "2025-07-14T07:00:56.901Z",
          author: {
            id: 16,
            name: "Luisa Castilla",
            email: "sergioafanador103@gmail.com",
          },
        },
        {
          id: 3,
          message:
            "Saludos, me informa el equipo de desarrollo y calidad que la falla ya fue correctamente solventada, por favor cierre sesión e inicie nuevamente para continuar, quedo atento a su confirmación de que la falla fue resuelta.",
          isInternal: false,
          createdAt: "2025-07-14T07:04:47.601Z",
          author: {
            id: 1,
            name: "Sergio Afanador",
            email: "sergioafanador102@gmail.com",
          },
        },
        {
          id: 4,
          message: "Muchisimas gracias, ya quedó bien.",
          isInternal: false,
          createdAt: "2025-07-14T07:05:54.016Z",
          author: {
            id: 16,
            name: "Luisa Castilla",
            email: "sergioafanador103@gmail.com",
          },
        },
      ],
    },
    {
      id: 2,
      subject: "Error en el sistema de pagos",
      initialMessage: "Los clientes no pueden completar los pagos en línea",
      status: "closed",
      createdAt: "2025-07-13T10:30:00.000Z",
      updatedAt: "2025-07-13T15:45:00.000Z",
      closedAt: "2025-07-13T15:45:00.000Z",
      agency: {
        id: 2,
        name: "Viajes Colombia",
      },
      createdBy: {
        id: 20,
        name: "María González",
        email: "maria@viajescolombia.com",
      },
      closedBy: {
        id: 1,
        name: "Sergio Afanador",
        email: "sergioafanador102@gmail.com",
      },
      responses: [
        {
          id: 10,
          message:
            "Hemos detectado el problema en el gateway de pagos. Trabajando en la solución.",
          isInternal: false,
          createdAt: "2025-07-13T11:00:00.000Z",
          author: {
            id: 1,
            name: "Sergio Afanador",
            email: "sergioafanador102@gmail.com",
          },
        },
        {
          id: 11,
          message:
            "El problema ha sido solucionado. Por favor verifique que todo funcione correctamente.",
          isInternal: false,
          createdAt: "2025-07-13T15:30:00.000Z",
          author: {
            id: 1,
            name: "Sergio Afanador",
            email: "sergioafanador102@gmail.com",
          },
        },
        {
          id: 12,
          message:
            "Confirmado, ya funciona perfectamente. Muchas gracias por la rapidez.",
          isInternal: false,
          createdAt: "2025-07-13T15:40:00.000Z",
          author: {
            id: 20,
            name: "María González",
            email: "maria@viajescolombia.com",
          },
        },
      ],
    },*/
  ]);

  const fetchInfo = async () => {
    try {
      const tickets = await fetchData(endpoints.ticket_admin_getAll());

      if (tickets.error) {
        return console.log(tickets.error);
      }
      setTickets(tickets);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <MessageSquare className="w-4 h-4" />;
      case "in-progress":
        return <Clock className="w-4 h-4" />;
      case "closed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "open":
        return "Abierto";
      case "in-progress":
        return "En progreso";
      case "closed":
        return "Cerrado";
      default:
        return status;
    }
  };

  const toggleTicketExpansion = (ticketId) => {
    const newExpanded = new Set(expandedTickets);
    if (newExpanded.has(ticketId)) {
      newExpanded.delete(ticketId);
    } else {
      newExpanded.add(ticketId);
    }
    setExpandedTickets(newExpanded);
  };

  const handleAddResponse = async (ticketId) => {
    const responseText = responses[ticketId];
    if (!responseText?.trim()) return;

    try {
      const response = await fetchData(
        endpoints.ticket_updateResponse(ticketId),
        {
          method: "POST",
          body: JSON.stringify({ message: responseText }),
        }
      );
      if (response.error) {
        return console.log(response.error);
      }
      setResponses((prev) => ({ ...prev, [ticketId]: "" }));
      fetchInfo();
      toast({
        variant: "success",
        title: "Ticket creado",
        description: "Tu respuesta ha sido guardada con éxito.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al guardar la respuesta.",
      });
    }
  };

  const handleCloseTicket = async (ticketId) => {

    try {
      const response = await fetchData(
        endpoints.ticket_admin_close(ticketId),
        {
          method: "PUT",
          body: JSON.stringify({ status:"closed" }),
        }
      );
      if (response.error) {
        return console.log(response.error);
      }
      fetchInfo();
      toast({
        variant: "success",
        title: "Ticket cerrado",
        description: "El ticket ha sido cerrado con éxito.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al guardar cerrar el ticket.",
      });
    }
  };

  const updateResponse = (ticketId, value) => {
    setResponses((prev) => ({ ...prev, [ticketId]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando lista de tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen">
        <div className="mx-auto">
          <div className="mb-8">
            <p className="text-gray-600 mt-2">
              Gestiona y da seguimiento a todos los tickets de soporte
            </p>
          </div>

          <div className="space-y-4">
            {tickets.map((ticket) => {
              const isExpanded = expandedTickets.has(ticket.id);
              const sortedResponses = [...ticket.responses].sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
              );

              return (
                <div
                  key={ticket.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Header del ticket - siempre visible */}
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleTicketExpansion(ticket.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            #{ticket.id} - {ticket.subject}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1 ${getStatusColor(
                              ticket.status
                            )}`}
                          >
                            {getStatusIcon(ticket.status)}
                            {getStatusText(ticket.status)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">
                          {ticket.initialMessage}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <span className="text-sm text-gray-500">
                          {isExpanded ? "Colapsar" : "Expandir"}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span>{ticket.agency.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{ticket.createdBy.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{ticket.responses.length} respuestas</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(ticket.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contenido expandible */}
                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      {/* Mensaje inicial */}
                      <div className="p-6 bg-blue-50 border-b border-gray-100">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">
                                {ticket.createdBy.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(ticket.createdAt)}
                              </span>
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded font-medium">
                                Mensaje inicial
                              </span>
                            </div>
                            <p className="text-gray-700">
                              {ticket.initialMessage}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Respuestas */}
                      <div className="p-6">
                        <div className="space-y-4 mb-6">
                          {sortedResponses.map((response) => (
                            <div
                              key={response.id}
                              className="flex items-start gap-3"
                            >
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-gray-600" />
                              </div>
                              <div className="flex-1 bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium text-gray-900">
                                    {response.author.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatDate(response.createdAt)}
                                  </span>
                                  {response.isInternal && (
                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                                      Interno
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-700">
                                  {response.message}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Formulario para agregar respuesta */}
                        {ticket.status !== "closed" ? (
                          <div className="border-t border-gray-100 pt-6">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900">
                                Agregar respuesta
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCloseTicket(ticket.id);
                                }}
                                className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors text-sm"
                              >
                                <X className="w-4 h-4" />
                                Cerrar ticket
                              </button>
                            </div>
                            <div className="space-y-3">
                              <textarea
                                value={responses[ticket.id] || ""}
                                onChange={(e) =>
                                  updateResponse(ticket.id, e.target.value)
                                }
                                placeholder="Escribe tu respuesta aquí..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={3}
                              />
                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleAddResponse(ticket.id)}
                                  disabled={!responses[ticket.id]?.trim()}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                                >
                                  <Send className="w-4 h-4" />
                                  Enviar respuesta
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="border-t border-gray-100 pt-6">
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                              <CheckCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-600">
                                Ticket cerrado el {formatDate(ticket.closedAt)}{" "}
                                por {ticket.closedBy?.name}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TicketSystem;

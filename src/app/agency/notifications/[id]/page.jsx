import { Bell, AlertTriangle, CheckCircle, Mail } from "lucide-react";
import Layout from "../../components/layout/layout";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";

// Datos de notificaciones en formato JSON local
const notificationsData = [
  {
    id: "1",
    title: "Nueva reserva recibida",
    message: "Tienes una nueva reserva para el tour 'Caminata por los Andes' el 15/06/2023",
    type: "info",
    read: false,
    createdAt: "2023-06-10T09:30:00Z"
  },
  {
    id: "2",
    title: "Sincronización fallida con Viator",
    message: "No se pudo sincronizar la disponibilidad con Viator. Revisa la conexión.",
    type: "alert",
    read: false,
    createdAt: "2023-06-09T14:15:00Z"
  },
  {
    id: "3",
    title: "Reserva cancelada",
    message: "El cliente Juan Pérez ha cancelado su reserva para el tour 'City Tour'",
    type: "info",
    read: true,
    createdAt: "2023-06-08T11:20:00Z"
  },
  {
    id: "4",
    title: "Pago confirmado",
    message: "Se ha recibido el pago por $150 USD para la reserva #TR-45678",
    type: "success",
    read: true,
    createdAt: "2023-06-07T16:45:00Z"
  }
];

 const NotificationsPage = () => {
  // Ordenar notificaciones por fecha (más recientes primero)
  const sortedNotifications = [...notificationsData].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Layout title="Notificaciones">
      <div className="mx-auto px-6 py-2">
        <header className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-500" />
            Notificaciones
          </h1>
          <p className="text-gray-500">
            Gestiona tus alertas y mensajes del sistema
          </p>
        </header>

        <div className="space-y-4">
          {sortedNotifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No tienes notificaciones recientes
            </div>
          ) : (
            sortedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.type === "alert"
                    ? "bg-red-50 border-red-200"
                    : notification.type === "success"
                    ? "bg-green-50 border-green-200"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {notification.type === "alert" ? (
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  ) : notification.type === "success" ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {!notification.read && (
                        <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
export default withAuth( NotificationsPage,'');
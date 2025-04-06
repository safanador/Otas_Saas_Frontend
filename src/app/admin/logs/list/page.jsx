"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../components/SideBar/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const LogsList = () => {
  const [logs, setLogs] = useState([
        {
          "id": 1,
          "actionType": "LOGIN",
          "entityType": "User",
          "entityId": 101,
          "details": "Inicio de sesión exitoso",
          "ipAddress": "192.168.1.45",
          "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "createdAt": "2023-06-15T09:30:22Z",
          "user": {
            "id": 101,
            "name": "Juan Pérez",
            "email": "juan.perez@empresa.com"
          }
        },
        {
          "id": 2,
          "actionType": "CREATE",
          "entityType": "Agency",
          "entityId": 205,
          "details": "Creación de nueva agencia 'Agencia Norte' con ID 205",
          "ipAddress": "192.168.1.45",
          "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "createdAt": "2023-06-15T10:15:03Z",
          "user": {
            "id": 101,
            "name": "Juan Pérez",
            "email": "juan.perez@empresa.com"
          }
        },
        {
          "id": 3,
          "actionType": "UPDATE",
          "entityType": "User",
          "entityId": 102,
          "details": "Actualización de rol de usuario a 'Administrador'",
          "ipAddress": "192.168.1.78",
          "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
          "createdAt": "2023-06-15T11:22:45Z",
          "user": {
            "id": 103,
            "name": "María González",
            "email": "maria.gonzalez@empresa.com"
          }
        },
        {
          "id": 4,
          "actionType": "DELETE",
          "entityType": "Client",
          "entityId": 307,
          "details": "Eliminación de cliente 'Empresa XYZ' con ID 307",
          "ipAddress": "192.168.1.45",
          "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "createdAt": "2023-06-15T14:05:18Z",
          "user": {
            "id": 101,
            "name": "Juan Pérez",
            "email": "juan.perez@empresa.com"
          }
        },
        {
          "id": 5,
          "actionType": "LOGOUT",
          "entityType": "User",
          "entityId": 103,
          "details": "Cierre de sesión del sistema",
          "ipAddress": "192.168.1.78",
          "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
          "createdAt": "2023-06-15T15:30:00Z",
          "user": {
            "id": 103,
            "name": "María González",
            "email": "maria.gonzalez@empresa.com"
          }
        },
        {
          "id": 6,
          "actionType": "CREATE",
          "entityType": "User",
          "entityId": 104,
          "details": "Creación de nuevo usuario 'Carlos Rojas' con rol 'Agente'",
          "ipAddress": "192.168.1.92",
          "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "createdAt": "2023-06-16T08:45:33Z",
          "user": {
            "id": 102,
            "name": "Admin Sistema",
            "email": "admin@empresa.com"
          }
        },
        {
          "id": 7,
          "actionType": "UPDATE",
          "entityType": "Agency",
          "entityId": 205,
          "details": "Actualización de dirección de agencia 'Agencia Norte'",
          "ipAddress": "192.168.1.45",
          "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "createdAt": "2023-06-16T10:20:15Z",
          "user": {
            "id": 101,
            "name": "Juan Pérez",
            "email": "juan.perez@empresa.com"
          }
        },
        {
          "id": 8,
          "actionType": "LOGIN_FAILED",
          "entityType": "User",
          "entityId": null,
          "details": "Intento fallido de inicio de sesión con usuario 'juan.perez@empresa.com'",
          "ipAddress": "192.168.1.45",
          "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "createdAt": "2023-06-16T11:05:47Z",
          "user": null
        }
  ]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionType, setActionType] = useState("");
  const { toast } = useToast();
{/*
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        let url = "http://localhost:3000/api/v1/logs";
        const queryParams = [];
        
        if (searchTerm) queryParams.push(`search=${encodeURIComponent(searchTerm)}`);
        if (actionType) queryParams.push(`actionType=${encodeURIComponent(actionType)}`);
        
        if (queryParams.length > 0) url += `?${queryParams.join('&')}`;

        const response = await fetch(url, {
          credentials: 'include'
        });

        if (response.status === 401) {
          window.location.href = '/auth/login';
        }
        if (response.status === 403) {
          window.location.href = '/admin/unauthorized';
        }

        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los logs. Por favor, intenta más tarde.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [searchTerm, actionType]);
 */}
  const getBadgeVariant = (actionType) => {
    switch(actionType) {
      case 'CREATE':
        return 'success';
      case 'UPDATE':
        return 'info';
      case 'DELETE':
        return 'destructive';
      case 'LOGIN':
        return 'outline';
      case 'LOGOUT':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <span className="w-8 h-8 border-[3px] border-black border-t-transparent rounded-full animate-spin"></span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Registro de Actividades</CardTitle>
          <CardDescription>Historial de acciones realizadas en el sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container mx-auto py-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Registro de logs</h1>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Input 
                  type="search" 
                  placeholder="Buscar en logs..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64" 
                />
                
                <Select value={actionType} onValueChange={setActionType}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrar por acción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tipo de Acción</SelectLabel>
                      <SelectItem value={null}>Todas</SelectItem>
                      <SelectItem value="CREATE">Creación</SelectItem>
                      <SelectItem value="UPDATE">Actualización</SelectItem>
                      <SelectItem value="DELETE">Eliminación</SelectItem>
                      <SelectItem value="LOGIN">Inicio de sesión</SelectItem>
                      <SelectItem value="LOGOUT">Cierre de sesión</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <div className="overflow-x-auto bg-white rounded-lg shadow dark:bg-gray-800">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Acción</TableHead>
                      <TableHead>Entidad</TableHead>
                      <TableHead>Detalles</TableHead>
                      <TableHead>Dirección IP</TableHead>
                      <TableHead>Dispositivo</TableHead>
                      <TableHead>Fecha/Hora</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.length > 0 ? (
                      logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">#{log.id}</TableCell>
                          <TableCell className="capitalize">
                            {log.user?.name || 'Usuario eliminado'}
                            {log.user?.email && <div className="text-sm text-gray-500">{log.user.email}</div>}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getBadgeVariant(log.actionType)}>
                              {log.actionType}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.entityType}</TableCell>
                          <TableCell className="max-w-xs truncate" title={log.details}>
                            {log.details}
                          </TableCell>
                          <TableCell>{log.ipAddress}</TableCell>
                          <TableCell>
                            {log.userAgent && (
                              <span className="text-sm">
                                {log.userAgent.includes('Mobile') ? '📱 Mobile' : '💻 Desktop'}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(log.createdAt).toLocaleString()}
                            <div className="text-sm text-gray-500">
                              {new Date(log.createdAt).toLocaleTimeString()}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          No se encontraron registros de actividad.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default withAuth(LogsList,);
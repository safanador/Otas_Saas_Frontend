"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../components/SideBar/AdminLayout";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const RolesList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const router = useRouter();


  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/roles/");
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

   // Filtrar roles en función del término de búsqueda
   const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
        <AdminLayout>
            <div className="flex items-center justify-center h-full">
                <p className="text-center">Cargando roles...</p>
            </div>
        </AdminLayout>
    );
  }

  const handleDeleteRole = async (id) => {
    try {
      
      const response = await fetch(`http://localhost:3000/api/v1/roles/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json', // Corrección
        },
      });

      if (response.ok) {
        toast({
          title: "Realizado!",
          description: "Rol eliminado exitosamente.",
        })
        setTimeout(() => {
          window.location.reload(); // Recargar la página actual
        }, 5000);
      }else{
        console.log(response)
        toast({
          title: "Uh oh! Parece que algo salió mal.",
          description: "Por favor, intenta más tarde.",
        })
      }
      
    } catch (error) {
        console.error('Error en la solicitud:', error);
        toast({
          title: "Uh oh! Parece que algo salió mal.",
          description: "Por favor, intenta más tarde.",
        })
    }
  };

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
          <CardDescription>A continuación se presenta una lista con aspectos generales de los roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container mx-auto py-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Lista de roles</h1>
              <div className="flex items-center gap-2">
                <Input 
                type="search" 
                placeholder="Buscar roles..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el estado al escribir
                className="w-full md:w-64" />
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <div className="overflow-x-auto bg-white rounded-lg shadow dark:bg-gray-800">
                <Table>
                  <TableHeader>
                    <TableRow>
                    <TableHead className="text-center">Item</TableHead>
                      <TableHead className="text-left">Rol</TableHead>
                      <TableHead className="text-left">Tipo de Rol</TableHead>
                      <TableHead className="text-left">Fecha de Creación</TableHead>
                      <TableHead className="text-left">Fecha de Actualización</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.length > 0 ? (filteredRoles.map((role, index) => (
                      <TableRow key={role.id}>
                        <TableCell className="text-center" >{index+1}</TableCell>
                        <TableCell className="capitalize" >{role.name}</TableCell>
                        <TableCell className="capitalize" >{role.type == 'ota' ? `OTA's` : "Software"}</TableCell>
                        <TableCell>{new Date(role.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(role.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => router.push(`/admin/roles/show/${role.id}`)}>
                                Ver Rol
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/admin/roles/edit/${role.id}`) } >
                                Editar Rol
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteRole(role.id)}>
                                Eliminar Rol
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No se encontraron roles.
                        </TableCell>
                      </TableRow>
                  )
                    }
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

export default RolesList;

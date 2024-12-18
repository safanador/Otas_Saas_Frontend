"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../components/SideBar/AdminLayout";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

const RolesList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");


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

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Lista de roles</h1>
              <div className="flex items-center gap-2">
                <Input 
                type="search" 
                placeholder="Buscar roles..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el estado al escribir
                className="w-full md:w-64" />
              </div>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow dark:bg-gray-800">
              <Table>
                <TableHeader>
                  <TableRow>
                  <TableHead className="">Item</TableHead>
                    <TableHead className="">Rol</TableHead>
                    <TableHead className="">Fecha de Creación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.length > 0 ? (filteredRoles.map((role, index) => (
                    <TableRow key={role.id}>
                      <TableCell>{index+1}</TableCell>
                      <TableCell>{role.name}</TableCell>
                      <TableCell>{new Date(role.createdAt).toLocaleDateString()}</TableCell>
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
                            <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment.id)}
                            >
                            Ver Rol
                            </DropdownMenuItem>
                            <DropdownMenuItem>Editar Rol</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Eliminar Rol</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No se encontraron roles.
                      </TableCell>
                    </TableRow>
                )
                  }
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default RolesList;

"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../components/SideBar/AdminLayout";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";
import PermissionGuard from "@/components/PermissionGuard";

const RolesList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState();

  useEffect(() => {
    const fetchRoles = async () => {
      try {

        const data = await fetchData(endpoints.role_getAll());
        
        if (data.error) {
          return console.log(data.error);
        }
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
   const filteredRoles = roles?.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
        <AdminLayout>
          <div className="flex items-center justify-center h-full">
            <span className="w-8 h-8 border-[3px] border-black border-t-transparent rounded-full animate-spin"></span>
          </div>
        </AdminLayout>
    );
  }

  const handleDeleteRole = async (id) => {
    try {

      const data = await fetchData(endpoints.role_delete(id), {
        method: 'DELETE',
      });

      if (data.error) {
        return
      }

      toast({ variant: "success", title: "Realizado!", description: "Role eliminado exitosamente." });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Parece que algo salió mal.",
          description: "No se pudo conectar con el servidor. Por favor, intenta más tarde.",
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
                      <TableHead className="text-left">Agencia asociada</TableHead>
                      <TableHead className="text-left">Fecha de Creación</TableHead>
                      <TableHead className="text-left">Fecha de Actualización</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.length > 0 ? (filteredRoles.map((role, index) => (
                      <TableRow key={role.id}>
                        <TableCell className="text-center" >{index+1}</TableCell>
                        <TableCell className="capitalize" >{role.name}</TableCell>
                        <TableCell className="capitalize" >{role.scope === 'agency' ? `Agencias` : "Empresa desarrolladora"}</TableCell>
                        <TableCell className="capitalize" >{role.agency?.name}</TableCell>
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
                                <Eye />  Ver Rol
                              </DropdownMenuItem>
                              <PermissionGuard requiredPermission={permissions.role_update}>
                                <DropdownMenuItem onClick={() => router.push(`/admin/roles/edit/${role.id}`) } >
                                  <Pencil /> Editar Rol
                                </DropdownMenuItem>
                              </PermissionGuard>
                              <DropdownMenuSeparator />
                              <PermissionGuard requiredPermission={permissions.role_delete}>
                                <DropdownMenuItem onClick={(e) => {
                                      e.preventDefault();
                                      setOpen(true);
                                      setSelectedRole(role);
                                    }}>
                                <Trash2 color="red" /> 
                                  <span className="text-red-500" >Eliminar Rol</span>
                                </DropdownMenuItem> 
                              </PermissionGuard>
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
                <AlertDialog open={open} onOpenChange={setOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Estás seguro de eliminar este rol?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Este será permanentemente eliminado de la base de datos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel >Cancelar</AlertDialogCancel>
                      <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={() => handleDeleteRole(selectedRole?.id)} >Continuar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default withAuth(RolesList, permissions.role_list);
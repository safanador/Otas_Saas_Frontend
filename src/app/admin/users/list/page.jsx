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
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [agencyId, setAgencyId] = useState();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openT, setOpenT] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = agencyId 
        ? `http://localhost:3000/api/v1/users?agencyId=${agencyId}`
        : "http://localhost:3000/api/v1/users";

        const response = await fetch(url, {
          credentials: 'include'
        });
        console.log(response)
        if (response.status === 401) {
          window.location.href = '/auth/login';
        }
        if (response.status === 403) {
          window.location.href = '/admin/unauthorized';
        }
        const data = await response.json();
        setUsers(data);

        // fetch agencies
        const agenciesData = await fetch("http://localhost:3000/api/v1/agencies", {
          credentials: 'include'
        });
        if (agenciesData.status === 401) {
          window.location.href = '/auth/login';
        }
        if (agenciesData.status === 403) {
          window.location.href = '/admin/unauthorized';
        }
        const agencies = await agenciesData.json();
        setAgencies(agencies);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [agencyId]);

   // Filtrar roles en función del término de búsqueda
   const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
        <AdminLayout>
            <div className="flex items-center justify-center h-full">
                <p className="text-center">Cargando usuarios...</p>
            </div>
        </AdminLayout>
    );
  }
// eliminacion de usuario
  const handleDeleteUser = async (id) => {
    try {
      
      const response = await fetch(`http://localhost:3000/api/v1/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          variant: "success",
          title: "Realizado!",
          description: "Usuario eliminado exitosamente.",
        })
        setTimeout(() => {
          window.location.reload(); // Recargar la página actual
        }, 1000);
      }else{
        console.log(response)
        toast({
          variant: "destructive",
          title: "Uh oh! Parece que algo salió mal.",
          description: "Por favor, intenta más tarde.",
        })
      }
      
    } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Parece que algo salió mal.",
          description: "No se pudo conectar con el servidor. Por favor, intenta más tarde.",
        })
    }
  };

  // toggle user state
  const handleToggleUserState = async (id) => {
    try {
      
      const response = await fetch(`http://localhost:3000/api/v1/users/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          variant: "success",
          title: "Realizado!",
          description: "El estatus del usuario ha sido cambiado exitosamente.",
        })
        setTimeout(() => {
          window.location.reload(); // Recargar la página actual
        }, 1000);
      }else{
        console.log(response)
        toast({
          variant: "destructive",
          title: "Uh oh! Parece que algo salió mal.",
          description: "Por favor, intenta más tarde.",
        })
      }
      
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
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>A continuación se presenta una lista con aspectos generales de los usuarios.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container mx-auto py-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Lista de usuarios</h1>
              <div className="flex items-center gap-2">
                <Input 
                type="search" 
                placeholder="Buscar usuarios..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el estado al escribir
                className="w-full md:w-64" />
                <Select
                  value={agencyId}
                  onValueChange={(value) => setAgencyId(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una agencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Agencias</SelectLabel>
                      <SelectItem  value={null} >
                          Todas
                        </SelectItem>
                      {agencies.map((agency) => (
                        <SelectItem key={agency.id} value={agency.id} >
                          {agency.name}
                        </SelectItem>
                      ))}
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
                      <TableHead className="text-center">Item</TableHead>
                      <TableHead className="text-left">Nombre</TableHead>
                      <TableHead className="text-left">Rol</TableHead>
                      <TableHead className="text-left">Tipo de Rol</TableHead>
                      <TableHead className="text-left">Agencia asociada</TableHead>
                      <TableHead className="text-left">Ciudad</TableHead>
                      <TableHead className="text-left">Estado</TableHead>
                      {/** */}<TableHead className="text-left">Fecha de Creación</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (filteredUsers.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell className="text-center" >{index+1}</TableCell>
                        <TableCell className="capitalize" >{user.name}</TableCell>
                        <TableCell className="capitalize" >{user.role.name}</TableCell>
                        <TableCell className="capitalize" >{user.role.scope === 'agency' ? `Agencias` : "Empresa desarrolladora"}</TableCell>
                        <TableCell className="capitalize" >{user.agency?.name}</TableCell>
                        <TableCell className="capitalize" >{user.city}</TableCell>
                        <TableCell className="capitalize" >
                          <Switch checked={user.isActive} onCheckedChange={() => setOpenT(true) } />
                            {/** Toggle user state confirmation */}
                              <AlertDialog open={openT} onOpenChange={setOpenT}>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Estás seguro de cambiar el estado de este usuario?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción {user.isActive ? 'desactivará' : 'activará' } el usuario en la base de datos, este {user.isActive ? 'no podrá' : 'podrá' } utilizar sus credenciales y utilizar la plataforma.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel >Cancelar</AlertDialogCancel>
                                    <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={() => handleToggleUserState(user.id)} >Continuar</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
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
                              <DropdownMenuItem onClick={() => router.push(`/admin/users/show/${user.id}`)}>
                              <Eye /> Ver Usuario
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/admin/users/edit/${user.id}`) } >
                               <Pencil/> Editar Usuario
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={(e) => {
                                    e.preventDefault(); // Evita que el menú se cierre automáticamente
                                    setOpen(true);
                                  }}>
                                <Trash2 color="red" />
                                <span className="text-red-500" >Eliminar Usuario</span>
                              </DropdownMenuItem>
                              {/** Delete confirmation */}

                              <AlertDialog open={open} onOpenChange={setOpen}>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Estás seguro de eliminar este usuario?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción no se puede deshacer. El usuario será permanentemente eliminado de la base de datos.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel >Cancelar</AlertDialogCancel>
                                    <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={() => handleDeleteUser(user.id)} >Continuar</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                          </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center">
                          No se encontraron usuarios.
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

export default UsersList;

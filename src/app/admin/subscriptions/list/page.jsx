"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../components/SideBar/AdminLayout";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeftRight, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const SubscritionList = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);

    const formattedDate = (date) => {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } 
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/subscriptions", {
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
        setSubscriptions(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

   // Filtrar roles en función del término de búsqueda
   const filteredSubscriptions = subscriptions?.filter((subscription) =>
    subscription.agency.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleDelete = async (id) => {
    try {
      
      const response = await fetch(`http://localhost:3000/api/v1/subscriptions/${id}`, {
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
          description: "Status de la suscripción cambiado exitosamente.",
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
          <CardTitle>Listado de Suscripciones</CardTitle>
          <CardDescription>A continuación se presenta una lista con aspectos generales de todas las suscripciones.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container mx-auto py-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center gap-2">
                <Input 
                type="search" 
                placeholder="Buscar agencia..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64" />
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <div className="overflow-x-auto bg-white rounded-lg shadow dark:bg-gray-800">
                <Table>
                  <TableHeader>
                    <TableRow>
                    <TableHead className="text-center">Item</TableHead>
                      <TableHead className="text-left">Agencia</TableHead>
                      <TableHead className="text-left">Validez</TableHead>
                      <TableHead className="text-left">Plan</TableHead>
                      <TableHead className="text-left">Precio</TableHead>
                      <TableHead className="text-left">Duración</TableHead>
                      <TableHead className="text-left">Estado</TableHead>
                      <TableHead className="text-left"></TableHead>

                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.length > 0 ? (filteredSubscriptions.map((sub, index) => (
                      <TableRow key={sub.id}>
                        <TableCell className="text-center" >{index+1}</TableCell>
                        <TableCell className="capitalize" >{sub.agency.name}</TableCell>
                        <TableCell className="" > {formattedDate(sub.startDate)} <span className="text-xs text-gray-600">→</span> {formattedDate(sub.endDate)}
                        </TableCell>
                        <TableCell className="capitalize" >{sub.plan.name}</TableCell>
                        <TableCell>
                          {sub.plan.price}
                        </TableCell>
                        <TableCell>
                          {sub.plan.durationInDays} días
                        </TableCell>
                        <TableCell>
                          {sub.isActive ? "Activo" : "Inactivo"}
                        </TableCell>
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
                              <DropdownMenuItem onClick={() => router.push(`/admin/subscriptions/show/${sub.id}`)}>
                                <Eye />  Ver Suscripcion
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/admin/subscriptions/edit/${sub.id}`) } >
                                <Pencil /> Editar Suscripción
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={(e) => {
                                    e.preventDefault(); // Evita que el menú se cierre automáticamente
                                    setOpen(true);
                                  }}>
                               <Trash2 color="red" /> 
                                <span className="text-red-500" >Cambiar status</span>
                              </DropdownMenuItem>
                              {/** Delete confirmation */}

                              <AlertDialog open={open} onOpenChange={setOpen}>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Estás seguro de cambiar el status de esta suscripción?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción se puede deshacer, sin embargo puede causar inconsistencias en el flujo de trabajo de los usuarios de las agencias asociadas.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel >Cancelar</AlertDialogCancel>
                                    <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={() => handleDelete(sub.id)} >Continuar</AlertDialogAction>
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
                        <TableCell colSpan={8} className="text-center">
                          No se encontraron suscripciones.
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

export default SubscritionList;

"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import AdminLayout from "../../components/SideBar/AdminLayout";
import PermissionGuard from "@/components/PermissionGuard";
import React, { useEffect, useState } from "react";
import withAuth from "@/app/middleware/withAuth";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import permissions from "@/lib/permissions";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";

const PaymentsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const formattedDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } 
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await fetchData(endpoints.payment_getAll());

        if (data.error) {
          return
        }

        setPayments(data);
      } catch (error) {
        console.log("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

   const filteredPayments = payments?.filter((payment) =>
    payment.subscription.agency.name.toLowerCase().includes(searchTerm.toLowerCase())
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

      const data = await fetchData(endpoints.payment_delete(id), {
        method: 'DELETE',
      });

      if (data.error) {
        return
      }

      toast({ variant: "success", title: "Realizado!", description: "Pago eliminado exitosamente." });
      setTimeout(() => {
        window.location.reload(); // Recargar la página actual
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
          <CardTitle>Pagos</CardTitle>
          <CardDescription>A continuación se presenta una lista con los pagos que han realizado las agencias a la plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container mx-auto py-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center gap-2">
                <Input 
                type="search" 
                placeholder="Buscar agencia..." 
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
                      <TableHead className="text-left">Agencia</TableHead>
                      <TableHead className="text-left">Plan</TableHead>
                      <TableHead className="text-left">Pago</TableHead>
                      <TableHead className="text-left">Estatus</TableHead>
                      <TableHead className="text-left">Metodo de pago</TableHead>
                      <TableHead className="text-left">Id de pago</TableHead>
                      <TableHead className="text-left">Fecha de pago</TableHead>
                      <TableHead className="text-left"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length > 0 ? (filteredPayments.map((payment, index) => (
                      <TableRow key={payment.id}>
                        <TableCell className="text-center" >{index+1}</TableCell>
                        <TableCell className="capitalize" >{payment.subscription.agency.name}</TableCell>
                        <TableCell className="capitalize" >{payment.subscription.plan.name}</TableCell>
                        <TableCell className="capitalize" >{payment.amount}</TableCell>
                        <TableCell className="capitalize" >{payment.status}</TableCell>
                        <TableCell className="capitalize" >{payment.paymentMethod}</TableCell>
                        <TableCell className="capitalize" >{payment.transactionId}</TableCell>
                        <TableCell className="capitalize" >{formattedDate(payment.createdAt)}</TableCell>
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
                              <PermissionGuard requiredPermission={permissions.payment_update}>
                                <DropdownMenuItem onClick={() => router.push(`/admin/payments/edit/${payment.id}`) } >
                                  <Pencil /> Editar Pago
                                </DropdownMenuItem>
                              </PermissionGuard>
                              
                              <DropdownMenuSeparator />
                              <PermissionGuard requiredPermission={permissions.payment_delete}>
                                <DropdownMenuItem onClick={(e) => {
                                      e.preventDefault(); // Evita que el menú se cierre automáticamente
                                      setOpen(true);
                                    }}>
                                <Trash2 color="red" /> 
                                  <span className="text-red-500" >Eliminar Pago</span>
                                </DropdownMenuItem>
                              </PermissionGuard>

                              {/** Delete confirmation */}
                              <AlertDialog open={open} onOpenChange={setOpen}>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Estás seguro de eliminar este pago?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción no se puede deshacer. Este será permanentemente eliminado de la base de datos.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel >Cancelar</AlertDialogCancel>
                                    <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={() => handleDelete(payment.id)} >Continuar</AlertDialogAction>
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
                          No se encontraron pagos.
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

export default withAuth(PaymentsList, permissions.payment_list) ;

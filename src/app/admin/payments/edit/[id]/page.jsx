"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../../components/SideBar/AdminLayout";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";


const PaymentEdit = () => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const { toast } = useToast();
  const { id } = useParams();

   if (!id) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <span className="w-8 h-8 border-[3px] border-black border-t-transparent rounded-full animate-spin"></span>
        </div>
      </AdminLayout>
    );
  }

  useEffect(() => {
    const fetchPaymentAndSubscriptions = async () => {
      try {
        const responseSubscriptions = await fetch("http://localhost:3000/api/v1/subscriptions/", {
          credentials: 'include'
        });
        if (responseSubscriptions.status === 403) {
          window.location.href = '/auth/login';
        }
        if (responseSubscriptions.status === 401) {
          window.location.href = '/admin/unauthorized';
        }
        const subscriptionsData = await responseSubscriptions.json();
        let noFreeTrialSubscriptions = subscriptionsData.filter((sub) => !sub.plan.isTrial)
        setSubscriptions(noFreeTrialSubscriptions);

        const responseForm = await fetch(`http://localhost:3000/api/v1/payments/${id}`, {
          credentials: 'include'
        });
        if (responseForm.status === 403) {
          window.location.href = '/auth/login';
        }
        if (responseForm.status === 401) {
          window.location.href = '/admin/unauthorized';
        }
        const formData = await responseForm.json();
        const { amount , paymentMethod,transactionId, status, ...rest} = formData;
        setForm({
          subscriptionId: formData.subscription.id,
          amount: amount  ,
          paymentMethod: paymentMethod,
          transactionId: transactionId, 
          status: status,
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentAndSubscriptions();
    
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <span className="w-8 h-8 border-[3px] border-black border-t-transparent rounded-full animate-spin"></span>
        </div>
      </AdminLayout>
    );
  }

    const handleEdit = async () => {
      try {
        setButtonLoading(true);
        setErrorData([])
        const {status, ...rest} = form;
        let updatedForm = {status: status};
        const response = await fetch(`http://localhost:3000/api/v1/payments/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedForm),
          credentials: 'include'
        });

        if (response.status === 403) {
          window.location.href = '/auth/login';
        }
        if (response.status === 401) {
          window.location.href = '/admin/unauthorized';
        }

        if (response.ok) {
          setButtonLoading(false);
          toast({
            variant: "success",
            title: "Realizado!",
            description: "Pago editado exitosamente.",
          })
        }else{
          setButtonLoading(false);
          const errorData = await response.json(); 
          setErrorData(errorData.message)
        }
      } catch (error) {
        setButtonLoading(false);
        toast({
          variant: "destructive",
          title: "Uh oh! Parece que algo salió mal.",
          description: "No se pudo conectar con el servidor. Por favor, intenta más tarde.",
        })
      }
    };

    const renderFieldErrors = (fieldName, errors) => {
      return errors
        .filter(error => error.property === fieldName)
        .map((error, index) => (
          <p key={index} className="text-red-500 text-sm">
            {error.message}
          </p>
        ));
    };

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Edición de pago</CardTitle>
          <CardDescription>A continuación puedes editar el estatus del pago registrado en sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">
            <div className="grid w-full max-w-lg items-center gap-1.5" >
              <Label htmlFor="user-type" >Agencia suscrita</Label>
              <Select
                value={form.subscriptionId}
                onValueChange={(value) => setForm({...form, subscriptionId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Agencias..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Suscriptores</SelectLabel>
                      {subscriptions.map((subscription) => (
                          <SelectItem key={subscription.id} value={subscription.id} >
                            {subscription.agency.name}
                          </SelectItem>
                        ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errorData && renderFieldErrors('subscriptionId',errorData)}
            </div>

            {/** price Done */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="name">Monto</Label>
                <Input 
                  type="number" 
                  id="corporateEmail" 
                  placeholder="Monto..." 
                  value={form.amount}
                  onChange={(e) => setForm({...form, amount: e.target.value})} 
                />
                {errorData && renderFieldErrors('amount',errorData)}
              </div>

              <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="name">Método de pago</Label>
                <Input 
                  type="text" 
                  id="name" 
                  placeholder="Metodo de pago..." 
                  value={form.transactionId}
                  onChange={(e) => setForm({...form, transactionId: e.target.value})} />
                  {errorData && renderFieldErrors('paymentMethod',errorData)}
              </div>

              <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="name">Id del pago</Label>
                <Input 
                  type="text" 
                  id="name" 
                  placeholder="Referencia de pago..." 
                  value={form.transactionId}
                  onChange={(e) => setForm({...form, transactionId: e.target.value})} />
                  {errorData && renderFieldErrors('transactionId',errorData)}
              </div>

              <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="name">Estado de la transacción</Label>
                <Input 
                  type="text" 
                  id="name" 
                  placeholder="Estatus de pago..." 
                  value={form.status}
                  onChange={(e) => setForm({...form, status: e.target.value})} />
                  {errorData && renderFieldErrors('status',errorData)}
              </div>
          </div>
        </CardContent>
        <CardFooter className="w-full">
          <Button   
            onClick={() => setOpen(true)}              
            className="w-full md:w-auto" >
              { buttonLoading 
                ? (<span className="w-4 h-4 border-[1.5px] border-white border-t-transparent rounded-full animate-spin"></span>)
                : (<span>Editar Pago</span>) }
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Estás seguro de editar este pago?</AlertDialogTitle>
                  <AlertDialogDescription>
                    El estatus del pago cambiara inmediatamente después de confirmado el cambio.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel >Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleEdit} >Continuar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default withAuth(PaymentEdit, permissions.payment_update) ;
"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "../../components/SideBar/AdminLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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


const PaymentCreate = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    subscriptionId: null,
    amount: 0,
    paymentMethod: "",
    transactionId: "",
    status: ""
  });
  const [buttonLoading, setButtonLoading] = useState(false);
  const [errorData, setErrorData] = useState();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/subscriptions", {
          credentials: 'include',
        });
        if (response.status === 403) {
          window.location.href = '/auth/login';
        }
        if (response.status === 401) {
          window.location.href = '/admin/unauthorized';
        }
        const data = await response.json();
        let noFreeTrialSubscriptions = data.filter((sub) => !sub.plan.isTrial)
        setSubscriptions(noFreeTrialSubscriptions);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <span className="w-8 h-8 border-[3px] border-black border-t-transparent rounded-full animate-spin"></span>
        </div>
      </AdminLayout>
    );
  }
    const handleCreate = async () => {
      try {
        setButtonLoading(true);
        setErrorData([])
        
        const response = await fetch("http://localhost:3000/api/v1/payments", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
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
            description: "Suscripción creada exitosamente.",
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
          <CardTitle>Creación de pago</CardTitle>
          <CardDescription>
            Esta ventana permite registrar manualmente el pago asociado a una suscripción  <span className="text-gray-600 font-semibold">NO Free Trial</span>.
          </CardDescription>
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
                : (<span>Crear Pago</span>) }
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Estás seguro de crear este pago?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Este pago se asociará a la suscripción que tiene registrada actualmente la agencia en la plataforma.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel >Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCreate} >Continuar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>

        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default PaymentCreate;

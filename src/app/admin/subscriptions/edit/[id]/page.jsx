"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../../components/SideBar/AdminLayout";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";


const SubscriptionEdit = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [agencies, setAgencies] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { id } = useParams();
  const [buttonLoading, setButtonLoading] = useState(false);
  const foundPlan = form.planId ? plans.find(plan => plan.id === form.planId) : '';


   // Renderiza un estado de carga mientras `id` no esté disponible
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
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/subscriptions/${id}`, {
          credentials: 'include',
        });
        const data = await response.json();
        let updatedForm = {...data , agencyId: data.agency.id , planId: data.plan.id};
        const { agencyId, planId , ...rest} = updatedForm;
        updatedForm = { agencyId, planId};
        setForm(updatedForm);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } 
    };

    fetchSubscriptions();

    const fetchPlans = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/plans", {
          credentials: 'include',
        });
        const data = await response.json();
        console.log(data)
        setPlans(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } 
    };

    fetchPlans();

    const fetchAgencies = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/agencies", {
          credentials: 'include'
        });
        if (response.status === 401) {
          window.location.href = '/auth/login';
        }
        if (response.status === 403) {
          window.location.href = '/admin/unauthorized';
        }
        const agencies = await response.json();
        console.log(agencies);
        setAgencies(agencies);
      } catch (error) {
        console.error("Error fetching agencies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
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
        
        const response = await fetch(`http://localhost:3000/api/v1/subscriptions/${id}`, {
          method: 'PUT',
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
            description: "Suscripción editada exitosamente.",
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
          <CardTitle>Edición de suscripción</CardTitle>
          <CardDescription>A continuación puedes editar el plan asociado a la suscripción.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="container space-y-4 mx-auto py-2">
              <div className="grid w-full max-w-lg items-center gap-1.5" >
                <Label htmlFor="user-type" >Agencia seleccionada</Label>
                <Select
                  disabled
                  value={form.agencyId}
                  onValueChange={(value) => setForm({...form, agencyId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Agencias..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Agencias</SelectLabel>
                        {agencies.map((agency) => (
                            <SelectItem key={agency.id} value={agency.id} >
                              {agency.name}
                            </SelectItem>
                          ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errorData && renderFieldErrors('agencyId',errorData)}
              </div>

              <div className="grid w-full max-w-lg items-center gap-1.5" >
                <Label htmlFor="user-type" >Plan seleccionado</Label>
                <Select
                  value={form.planId}
                  onValueChange={(value) => setForm({...form, planId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Planes.." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Planes</SelectLabel>
                        {plans.map((plan) => (
                            <SelectItem key={plan.id} value={plan.id} >
                              {plan.name}
                            </SelectItem>
                          ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errorData && renderFieldErrors('planId',errorData)}
              </div>

              { form.planId && (
                <div className="container space-y-4 mx-auto py-2">
                  <div className="grid w-full max-w-lg items-center gap-1.5">
                    <Label htmlFor="name">Descripción</Label>
                    <Input 
                      disabled
                      type="text" 
                      id="email" 
                      placeholder="Descripción..." 
                      value={foundPlan.description}/>
                  </div>

                    {/** price Done */}
                  <div className="grid w-full max-w-lg items-center gap-1.5">
                    <Label htmlFor="name">Precio</Label>
                    <Input 
                      disabled
                      type="text" 
                      id="corporateEmail" 
                      placeholder="Precio..." 
                      value={foundPlan.price}/>
                  </div>

                    {/** Duration in Days Done*/}
                  <div className="grid w-full max-w-lg items-center gap-1.5">
                    <Label htmlFor="name">Duración en días</Label>
                    <Input 
                      disabled
                      type="text" 
                      id="address" 
                      placeholder="Duración..." 
                      value={foundPlan.durationInDays}
                      onChange={(e) => setForm({...form, durationInDays: e.target.value})} />
                  </div>

                  {/** Trial in Days Done*/}
                  <div className="flex items-center w-full max-w-lg justify-between gap-1.5">
                    <Label htmlFor="name">Prueba?</Label>
                    <Checkbox disabled checked={foundPlan.isTrial}  />
                  </div>
                </div>
              )}
            </div>
        </CardContent>
        <CardFooter className="w-full">
          <Button   
            onClick={() => setOpen(true)}              
            className="w-full md:w-auto" >
              { buttonLoading 
                ? (<span className="w-4 h-4 border-[1.5px] border-white border-t-transparent rounded-full animate-spin"></span>)
                : (<span>Editar Suscripción</span>) }
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Estás seguro de editar esta suscripción?</AlertDialogTitle>
                  <AlertDialogDescription>
                    la agencia agregada va poder usar la plataforma y las credenciales de todos sus usuarios asociados.
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

export default withAuth(SubscriptionEdit, permissions.subscription_update);
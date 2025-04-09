"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../components/SideBar/AdminLayout";

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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";


const SubscriptionCreate = () => {
  const [plans, setPlans] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [form, setForm] = useState({
    agencyId: null,
    planId: null, 
  });
  const [errorData, setErrorData] = useState();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [buttonLoading, setButtonLoading] = useState(false);
  const foundPlan = form.planId ? plans.find(plan => plan.id === form.planId) : '';
  


  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await fetchData(endpoints.plan_getAll());
        if(data.error) {
          return console.log(data.error);
        }
        setPlans(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } 
    };

    fetchPlans();

    const fetchAgencies = async () => {
      try {
        const response = await fetchData(endpoints.agency_getAll());

        setAgencies(response);
      } catch (error) {
        console.error("Error fetching agencies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
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
        
        const response = await fetchData(endpoints.subscription_create(), {
          method: 'POST',
          body: JSON.stringify(form),
        });

        if (response.error) {
          setErrorData(response.error)
          return 
        }

        toast({
          variant: "success",
          title: "Realizado!",
          description: "Suscripción creada exitosamente.",
        })

        setForm({
          agencyId: null,
          planId: null,
        });

      } catch (error) {
          toast({
            variant: "destructive",
            title: "Uh oh! Parece que algo salió mal.",
            description: "No se pudo conectar con el servidor. Por favor, intenta más tarde.",
          })
      } finally {
        setButtonLoading(false);
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
          <CardTitle>Creación de suscripciones</CardTitle>
          <CardDescription>
            Al generar una suscripción, la agencia agregada va poder usar la plataforma y las credenciales de todos sus usuarios asociados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">
            <div className="grid w-full max-w-lg items-center gap-1.5" >
              <Label htmlFor="user-type" >Selecciona una agencia</Label>
              <Select
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
              <Label htmlFor="user-type" >Selecciona un plan</Label>
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
                : (<span>Crear Suscripción</span>) }
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Estás seguro de crear esta suscripción?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Al generar una suscripción, la agencia agregada va poder usar la plataforma y las credenciales de todos sus usuarios asociados.
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

export default withAuth(SubscriptionCreate, permissions.subscription_create);
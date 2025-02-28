"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { useParams } from "next/navigation";
import AdminLayout from "@/app/admin/components/SideBar/AdminLayout";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";

const SubscriptionShow = () => {
  const [plans, setPlans] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const foundPlan = form.planId ? plans.find(plan => plan.id === form.planId) : '';
  const { id } = useParams();

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

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la suscripción</CardTitle>
          <CardDescription>A continuación disponible toda la información relacionada a la suscripción, la agencia agregada va poder usar la plataforma y las credenciales de todos sus usuarios asociados.</CardDescription>
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
                {/*{errorData && renderFieldErrors('agencyId',errorData)} */}
              </div>

              <div className="grid w-full max-w-lg items-center gap-1.5" >
                <Label htmlFor="user-type" >Plan seleccionado</Label>
                <Select
                  disabled
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
                {/*{errorData && renderFieldErrors('planId',errorData)} */}
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
      </Card>
    </AdminLayout>
  );
};

export default withAuth(SubscriptionShow, permissions.subscription_show);
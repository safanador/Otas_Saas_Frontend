"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from "next/navigation";
import AdminLayout from "@/app/admin/components/SideBar/AdminLayout";

const PlanShow = () => {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    durationInDays: null,
    isTrial: false,
  });
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
    const fetchData = async () => {
      try {
        const responseForm = await fetch(`http://localhost:3000/api/v1/plans/${id}`, {
          credentials: 'include'
        });

        if (responseForm.status === 401) {
          window.location.href = '/auth/login';
          return;
        }
        if (responseForm.status === 403) {
          window.location.href = '/admin/unauthorized';
          return;
        }
        const dataForm = await responseForm.json();
        setForm(dataForm);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
          <CardTitle>Información del plan</CardTitle>
          <CardDescription>
            En esta ventana puedes ver toda la información relacionada al plan seleccionado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">
              {/** Name Done */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">Nombre</Label>
              <Input
                disabled
                type="text" 
                id="name" 
                placeholder="Nombre..." 
                value={form.name}/>
            </div>

              {/** description Done*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">Descripción</Label>
              <Input 
                disabled
                type="text" 
                id="email" 
                placeholder="Descripción..." 
                value={form.description}/>
            </div>

              {/** price Done */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">Precio</Label>
              <Input 
                disabled
                type="text" 
                id="corporateEmail" 
                placeholder="Precio..." 
                value={form.price}/>
            </div>

              {/** Duration in Days Done*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">Duración en días</Label>
              <Input 
                disabled
                type="text" 
                id="address" 
                placeholder="Duración..." 
                value={form.durationInDays}
                onChange={(e) => setForm({...form, durationInDays: e.target.value})} />
            </div>

            {/** Trial in Days Done*/}
            <div className="flex items-center w-full max-w-lg justify-between gap-1.5">
              <Label htmlFor="name">Prueba?</Label>
              <Checkbox disabled checked={form.isTrial}  />
            </div>
        </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default PlanShow;

"use client";

import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import AdminLayout from "../../../components/SideBar/AdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const PlanEdit = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [form, setForm] = useState({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorData, setErrorData] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);

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
        let updatedForm = { ...dataForm};
        const {id: planId, ...rest} = updatedForm;
        updatedForm = rest;        
        setForm(updatedForm);
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

    const handleEdit = async (e) => {
      try {
        setErrorData([]); // Limpiar errores anteriores
        setButtonLoading(true);
        console.log(form);
        let updatedForm = { ...form, durationInDays: form.durationInDays.toString(), price: form.price.toString()};

    
        const response = await fetch(`http://localhost:3000/api/v1/plans/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json', // Corrección
          },
          body: JSON.stringify(updatedForm),
          credentials: 'include',
        });
    
        // Verificar si la creación del usuario fue exitosa
        if (!response.ok) {
          const errorData = await response.json();
          setErrorData(errorData.message);
          setButtonLoading(false);
          return;
        }
    
        setButtonLoading(false);
    
        // Mostrar mensaje de éxito
        toast({
          variant: "success",
          title: "Realizado!",
          description: "Plan editado exitosamente.",
        });
      } catch (error) {
        setButtonLoading(false);
        console.error("Error:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Parece que algo salió mal.",
          description: "No se pudo conectar con el servidor. Por favor, intenta más tarde.",
        });
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
          <CardTitle>Edición de usuario</CardTitle>
          <CardDescription>
            Ventana para un usuario ya registrado, agregue toda la información del usuario para poder continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
        <div className="container space-y-4 mx-auto py-2">
                {/** Name Done */}
              <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  type="text" 
                  id="name" 
                  placeholder="Nombre..." 
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})} 
                />
                {errorData && renderFieldErrors('name',errorData)}
              </div>

                {/** description Done*/}
              <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="name">Descripción</Label>
                <Input 
                  type="text" 
                  id="email" 
                  placeholder="Descripción..." 
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})} 
                />
                {errorData && renderFieldErrors('description',errorData)}
              </div>

                {/** price Done */}
              <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="name">Precio</Label>
                <Input 
                  type="number" 
                  id="corporateEmail" 
                  placeholder="Precio..." 
                  value={form.price}
                  onChange={(e) => setForm({...form, price: e.target.value})} 
                />
                {errorData && renderFieldErrors('price',errorData)}
              </div>

                {/** Duration in Days Done*/}
              <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="name">Duración en días</Label>
                <Input 
                  type="number" 
                  id="address" 
                  placeholder="Duración..." 
                  value={form.durationInDays}
                  onChange={(e) => setForm({...form, durationInDays: e.target.value})} 
                />
                {errorData && renderFieldErrors('durationInDays',errorData)}
              </div>

              {/** Trial in Days Done*/}
              <div className="flex items-center w-full max-w-lg justify-between gap-1.5">
                <Label htmlFor="name">Prueba?</Label>
                <Checkbox                   
                  onCheckedChange={(e) => setForm({...form, isTrial: e})}
                  checked={form.isTrial}  />
              </div>
          </div>
        </CardContent>
        <CardFooter className="w-full">
          <Button                 
            onClick={() => setOpen(true)}
            className="w-full md:w-[100px]" >
              { buttonLoading 
                ? (<span className="w-4 h-4 border-[1.5px] border-white border-t-transparent rounded-full animate-spin"></span>)
                : (<span className="px-2 py-1">Editar Usuario</span>) }
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Estás seguro de editar este plan?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Una vez editado el plan puede seguir haciendo modificaciones en esta pantalla.
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

export default PlanEdit;

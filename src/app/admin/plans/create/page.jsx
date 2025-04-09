"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../components/SideBar/AdminLayout";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";


const UsersCreate = () => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const initialFormState = {
    name: "",
    description: "",
    price: 0,
    durationInDays: 0,
    isTrial: false,
  };
  const [form, setForm] = useState(initialFormState);
  const [open, setOpen] = useState(false);
  const [errorData, setErrorData] = useState();
  const { toast } = useToast();
  
  const handleCreate = async () => {
    try {
      setErrorData([]); // Limpiar errores anteriores
      setButtonLoading(true);

      const response = await fetchData(endpoints.plan_create(), {
        method: 'POST',
        body: JSON.stringify(form),
      });

      if (response.error) {
        setErrorData(response.error);
        setButtonLoading(false);
        return;
      }
  
      // Mostrar mensaje de éxito
      toast({
        variant: "success",
        title: "Realizado!",
        description: "Plan creado exitosamente.",
      });
      setForm(initialFormState);
  
    } catch (error) {

      toast({
        variant: "destructive",
        title: "Uh oh! Parece que algo salió mal.",
        description: "No se pudo conectar con el servidor. Por favor, intenta más tarde.",
      });
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
          <CardTitle>Creación de plan</CardTitle>
          <CardDescription>
            Ventana para crear un nuevo plan, agregue toda la información para poder continuar.
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
                : (<span>Crear Plan</span>) }
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Estás seguro de crear este usuario?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Una vez creado el usuario va a recibir un correo electronico de confirmación.
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

export default withAuth(UsersCreate, permissions.user_create) ;
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../../components/SideBar/AdminLayout";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import AvatarInput from "@/app/admin/components/Avatar/AvatarInput";
import { City, Country, State } from "country-state-city";
import { Countries } from "@/app/admin/components/CountryStateCity/Country";
import { States } from "@/app/admin/components/CountryStateCity/State";
import { Cities } from "@/app/admin/components/CountryStateCity/Cities";
import { PhoneCodes } from "@/app/admin/components/CountryStateCity/PhoneCode";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";

const AgencyEdit = () => {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "", 
    email: "", 
    logo: null,
    phone: '',
    phone2: '',
    rnt: '',
    url: '',
    address: '',
    country: '',
    state: '',
    city: '',
  });
  const [errorData, setErrorData] = useState([]);
  const [open, setOpen] = useState(false);

  const [selectedPhoneCode, setSelectedPhoneCode] = useState()
  const [selectedPhoneCode2, setSelectedPhoneCode2] = useState()

  const [buttonLoading, setButtonLoading] = useState(false);
  const [imageFromLocal, setImageFromLocal] = useState(null);
  const countries = Country.getAllCountries(); // it's an Array
  const states = State.getStatesOfCountry(form.country);
  const cities = City.getCitiesOfState(form.country, form.state);
  const { toast } = useToast();
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
    const fetchInfo = async () => {
      try {
        const dataForm = await fetchData(endpoints.agency_getOne(id));

        if (dataForm.error) {
          return console.log(dataForm.error);
        }
        let updatedForm = { ...dataForm};
        const {id: agencyId, isActive, createdAt, updatedAt, ...rest} = updatedForm;
        updatedForm = rest;
        const phoneParts = updatedForm.phone.trim().split(" ");
        const phoneParts2 = updatedForm.phone2.trim().split(" ");

        setForm({...updatedForm, phone: phoneParts[1], phone2: phoneParts2[1]});
        setSelectedPhoneCode(phoneParts[0])
        setSelectedPhoneCode2(phoneParts2[0])
          
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
    
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

    const handleEditAgency = async (e) => {
      try {
        setErrorData([]); // Limpiar errores anteriores
        setButtonLoading(true);
        console.log(form);
    
        let imageUrl = form.image || null; // Inicializa imageUrl como form.image si ya existe o null si no
        {/** 
        //si existe form.image && imageFromLocal borrar form.image
        if (form.image && imageFromLocal) {
          const imageDelete = await fetch(`http://localhost:3000/api/v1/images/${form.image}`, {
            method: 'DELETE',
            credentials: 'include', // Incluye cookies si es necesario
          });
          imageUrl = null;
          console.log(await imageDelete.json())
        }*/}

        // 1. Subir la imagen solo si imageFromLocal no es null o undefined
        if (imageFromLocal) {
          const formData = new FormData();
          formData.append('file', imageFromLocal); // 'file' es el nombre del campo que espera tu backend
    
          const imageResponse = await fetchData(endpoints.images_upload(), {
            method: 'POST',
            body: formData,
          });
  
          if (imageResponse.error) {
            toast({
              variant: "destructive",
              title: "Uh oh! Parece que algo salió mal.",
              description: "Hubo un error al subir la imagen. Por favor, intenta más tarde.",
            });
            setButtonLoading(false);
            return;
          }
    
          imageUrl = imageResponse.imageUrl; // Asignar la URL de la imagen
        }
    
        // 2. Crear el usuario con la URL de la imagen (o null si no se subió ninguna)
        const updatedForm = {
          ...form,
          phone: selectedPhoneCode + " " + form.phone, // Agregar el código de teléfono
          phone2: selectedPhoneCode2 + " " + form.phone2, // Agregar el código de teléfono
          logo: imageUrl, // Usar la URL de la imagen subida o null
        };
    
        const agencyResponse = await fetchData(endpoints.agency_update(id), {
          method: 'PUT',
          body: JSON.stringify(updatedForm),
        });

        if (agencyResponse.error) {
          setErrorData(agencyResponse.error);
          setButtonLoading(false);
          return
        }
    
        // Mostrar mensaje de éxito
        toast({
          variant: "success",
          title: "Realizado!",
          description: "Usuario editado exitosamente.",
        });
    
      } catch (error) {
        setButtonLoading(false);
        console.error("Error:", error);
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
          <CardTitle>Edición de agencia</CardTitle>
          <CardDescription>
            Ventana para editar la información de la agencia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">
            {/** Profile image Pending*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <AvatarInput
                  imageUrl={form.logo}
                  image={imageFromLocal}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageFromLocal(file)
                    //setForm({ ...form, image: file });
                  }}
                />
                {errorData && renderFieldErrors('logo',errorData)}
            </div>

            {/** Name Done */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">Nombre</Label>
              <Input 
                type="text" 
                id="name" 
                placeholder="Nombre..." 
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})} />
                {errorData && renderFieldErrors('name',errorData)}
            </div>

            {/** Email Done*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">Correo Electronico</Label>
              <Input 
                type="email" 
                id="email" 
                placeholder="Correo electrónico..." 
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})} />
                {errorData && renderFieldErrors('email',errorData)}
            </div>

            {/** Phone Done*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="phone">Número de Teléfono</Label>
              <div className="flex gap-1">
                <PhoneCodes countries={countries} onCodeSelect={(code) => setSelectedPhoneCode(code)} selectedPhoneCode={selectedPhoneCode} />
                <Input
                  type="tel" 
                  id="phone"
                  placeholder="Número de teléfono (10 dígitos)..."
                  value={form.phone}
                  onChange={(e) => {
                    const phone = e.target.value;
                    // Permite solo números y restringe la longitud a 10 caracteres
                    if (/^\d{0,10}$/.test(phone)) {
                      setForm({ ...form, phone });
                    }
                  }}
                />
              </div>
              {errorData && renderFieldErrors('phone', errorData)}
            </div>

            {/** Phone2 Done*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="phone">Número alternativo</Label>
              <div className="flex gap-1">
                <PhoneCodes countries={countries} onCodeSelect={(code) => setSelectedPhoneCode2(code)} selectedPhoneCode={selectedPhoneCode2} />
                <Input
                  type="tel" 
                  id="phone"
                  placeholder="Número de teléfono (10 dígitos)..."
                  value={form.phone2}
                  onChange={(e) => {
                    const phone = e.target.value;
                    // Permite solo números y restringe la longitud a 10 caracteres
                    if (/^\d{0,10}$/.test(phone)) {
                      setForm({ ...form, phone2: phone });
                    }
                  }}
                />
              </div>
              {errorData && renderFieldErrors('phone2', errorData)}
            </div>

            {/** Rnt Done */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">Registro Nacional Turistico</Label>
              <Input 
                type="text" 
                id="name" 
                placeholder="Nombre..." 
                value={form.rnt}
                onChange={(e) => setForm({...form, rnt: e.target.value})} />
                {errorData && renderFieldErrors('rnt',errorData)}
            </div>

            {/** Url Done */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">Enlace página web</Label>
              <Input 
                type="text" 
                id="name" 
                placeholder="Página web..." 
                value={form.url}
                onChange={(e) => setForm({...form, url: e.target.value})} />
                {errorData && renderFieldErrors('url',errorData)}
            </div>

            {/** Address Done*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">Dirección</Label>
              <Input 
                type="text" 
                id="address" 
                placeholder="Dirección" 
                value={form.address}
                onChange={(e) => setForm({...form, address: e.target.value})} />
                {errorData && renderFieldErrors('address',errorData)}
            </div>

             {/** Country Done*/}
            {countries && (<div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">País</Label>
              <Countries
                countries={countries} 
                selectedCountry={form.country}
                onCountryChange={(newCountry) => {
                  setForm({...form, country: newCountry, state: '', city: ''});
                  }}/>
                {errorData && renderFieldErrors('country',errorData)}
            </div>)}

            { form.country && (<div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">Estado</Label>
              <States
                states={states} 
                selectedState={form.state} 
                onStateChange={(newState) => {
                  setForm({...form, state: newState});
                  }} />
                {errorData && renderFieldErrors('state',errorData)}
            </div>)}

            {cities.length > 0 && (<div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">Ciudad</Label>
              <Cities 
                cities={cities} 
                selectedCity={form.city} 
                onCityChange={(newCity) => {
                  setForm({...form, city: newCity});
                  }}
                />
                {errorData && renderFieldErrors('city',errorData)}
            </div>)}
          </div>
        </CardContent>
        <CardFooter className="w-full">
          <Button                 
            onClick={() => setOpen(true)}
            className="w-full md:w-[100px]" >
              { buttonLoading 
                ? (<span className="w-4 h-4 border-[1.5px] border-white border-t-transparent rounded-full animate-spin"></span>)
                : (<span className="px-2 py-1">Editar Agencia</span>) }
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Estás seguro de editar esta agencia?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Después de realizados los cambios, estos podrán ser editados nuevamente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel >Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleEditAgency} >Continuar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>

        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default withAuth(AgencyEdit, permissions.agency_update);
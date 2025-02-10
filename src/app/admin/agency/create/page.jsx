"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../components/SideBar/AdminLayout";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Country, State, City }  from 'country-state-city';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";


import { Countries } from "../../components/CountryStateCity/Country";
import { States } from "../../components/CountryStateCity/State";
import { Cities } from "../../components/CountryStateCity/Cities";
import { PhoneCodes } from "../../components/CountryStateCity/PhoneCode";
import AvatarInput from "../../components/Avatar/AvatarInput";


const AgencyCreate = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", 
    email: "", 
    logo: null,
    phone: '',
    url: '',
    rnt: '',
    phone2: '',
    address: '',
    country: '',
    state: '',
    city: '',
  });
  const [open, setOpen] = useState(false);
  const countries = Country.getAllCountries() // it's an Array
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedPhoneCode, setSelectedPhoneCode] = useState('');
  const [selectedPhoneCode2, setSelectedPhoneCode2] = useState('');

  const foundRole = roles.find(role => role.id === form.roleId) || null;
  const [errorData, setErrorData] = useState();
  const { toast } = useToast();
  {/**
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/roles/", {
          credentials: 'include'
        });
        // Manejar errores de autenticación/autorización
      if (response.status === 401) {
        window.location.href = '/auth/login';
        return;
      }
      if (response.status === 403) {
        window.location.href = '/admin/unauthorized';
        return;
      }
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
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
   */}
  const handleCreateAgency = async () => {
    try {
      setErrorData([]); // Limpiar errores anteriores
      setButtonLoading(true);
      console.log(form);
  
      let imageUrl = null; // Inicializa imageUrl como null
  
      // 1. Subir la imagen solo si form.image no es null o undefined
      if (form.logo) {
        const formData = new FormData();
        formData.append('file', form.logo); // 'file' es el nombre del campo que espera tu backend
  
        const imageResponse = await fetch("http://localhost:3000/api/v1/images/upload", {
          method: 'POST',
          body: formData, // Envía el FormData
          credentials: 'include', // Incluye cookies si es necesario
        });
  
        // Manejar errores de autenticación/autorización
        if (imageResponse.status === 403) {
          window.location.href = '/auth/login';
          return;
        }
        if (imageResponse.status === 401) {
          window.location.href = '/admin/unauthorized';
          return;
        }
  
        // Verificar si la carga de la imagen fue exitosa
        if (!imageResponse.ok) {
          toast({
            variant: "destructive",
            title: "Uh oh! Parece que algo salió mal.",
            description: "Hubo un error al subir la imagen. Por favor, intenta más tarde.",
          });
          setButtonLoading(false);
          return;
        }
  
        // Obtener la URL de la imagen subida
        const imageData = await imageResponse.json();
        imageUrl = imageData.imageUrl; // Asignar la URL de la imagen
      }
  
      // 2. Crear el usuario con la URL de la imagen (o null si no se subió ninguna)
      const updatedForm = {
        ...form,
        phone: selectedPhoneCode + " " + form.phone, // Agregar el código de teléfono
        phone2: selectedPhoneCode2 + " " + form.phone2, // Agregar el código de teléfono
        image: imageUrl, // Usar la URL de la imagen subida o null
      };
      console.log(updatedForm);
  
      const agencyResponse = await fetch("http://localhost:3000/api/v1/agencies", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Corrección
        },
        body: JSON.stringify(updatedForm),
        credentials: 'include',
      });
  
      // Verificar si la creación del usuario fue exitosa
      if (!agencyResponse.ok) {
        const errorData = await agencyResponse.json();
        setErrorData(errorData.message);
        setButtonLoading(false);
        return;
      }
  
      setButtonLoading(false);
  
      // Mostrar mensaje de éxito
      toast({
        variant: "success",
        title: "Realizado!",
        description: "Usuario creado exitosamente.",
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
          <CardTitle>Creación de agencia</CardTitle>
          <CardDescription>
            Ventana para crear una agencia, agregue toda la información para poder continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">

            {/** logo image */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
            <AvatarInput
                image={form.logo}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setForm({ ...form, logo: file });
                }}
              />
              {errorData && renderFieldErrors('logo',errorData)}
          </div>

            {/** Name  */}
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

            {/** Email */}
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

            {/** Phone */}
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


          {/** Phone2 */}
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="phone">Teléfono alternativo</Label>
            <div className="flex gap-1">
              <PhoneCodes countries={countries} onCodeSelect={(code) => setSelectedPhoneCode2(code)} selectedPhoneCode={selectedPhoneCode2} />
              <Input
                type="tel" 
                id="phone2"
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

            {/** url  */}
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

            {/** RNT  */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="name">Registro Nacional de Turismo</Label>
            <Input 
              type="text" 
              id="name" 
              placeholder="RNT..." 
              value={form.rnt}
              onChange={(e) => setForm({...form, rnt: e.target.value})} />
              {errorData && renderFieldErrors('rnt',errorData)}
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
                const fetchedStates = State.getStatesOfCountry(newCountry);
                setStates(fetchedStates);
                }}/>
              {errorData && renderFieldErrors('country',errorData)}
          </div>)}

            {/** State Done*/}  
          { form.country && (<div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="name">Estado</Label>
            <States 
              states={states} 
              selectedState={form.state} 
              onStateChange={(newState) => {
                setForm({...form, state: newState});
                const fetchedCities = City.getCitiesOfState(form.country, newState);
                setCities(fetchedCities);
                }} />
              {errorData && renderFieldErrors('state',errorData)}
          </div>)}

            {/** City Done*/}
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
                : (<span>Crear Agencia</span>) }
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Estás seguro de crear esta agencia?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Una vez creada la agencia podrá crear roles a usar dentro de la misma.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel >Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCreateAgency} >Continuar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>

        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default AgencyCreate;

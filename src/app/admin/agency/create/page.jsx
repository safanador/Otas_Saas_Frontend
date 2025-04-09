"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PhoneCodes } from "../../components/CountryStateCity/PhoneCode";
import { Countries } from "../../components/CountryStateCity/Country";
import { Cities } from "../../components/CountryStateCity/Cities";
import { States } from "../../components/CountryStateCity/State";
import AdminLayout from "../../components/SideBar/AdminLayout";
import AvatarInput from "../../components/Avatar/AvatarInput";
import { Country, State, City }  from 'country-state-city';
import React, { useEffect, useState } from "react";
import withAuth from "@/app/middleware/withAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import permissions from "@/lib/permissions";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";

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
  const [errorData, setErrorData] = useState();
  const { toast } = useToast();

  const handleCreateAgency = async () => {
    try {
      setErrorData([]); // Limpiar errores anteriores
      setButtonLoading(true);
      console.log(form);
  
      let imageUrl = null; // Inicializa imageUrl como null
  
      // 1. Subir la imagen solo si form.image no es null o undefined
      console.log('No entra a form.logo')

      if (form.logo) {
        console.log(' entra a form.logo')
        const formData = new FormData();
        formData.append('file', form.logo); // 'file' es el nombre del campo que espera tu backend
  
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
      console.log(updatedForm);
  
      const agencyResponse = await fetchData(endpoints.agency_create(), {
        method: 'POST',
        body: JSON.stringify(updatedForm),
      });

      if (agencyResponse.error) {
        setErrorData(agencyResponse.error);
        setButtonLoading(false);
        return;
      }
  
      // Mostrar mensaje de éxito
      toast({
        variant: "success",
        title: "Realizado!",
        description: "Usuario creado exitosamente.",
      });

      setForm({
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

export default withAuth(AgencyCreate, permissions.agency_create);
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
import { DatePicker } from "@/components/ui/date-picker";
import AvatarInput from "../../components/Avatar/AvatarInput";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";
import endpoints from "@/lib/endpoints";
import { fetchData } from "@/services/api";


const UsersCreate = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", 
    email: "", 
    password: '', 
    image: null,
    corporateEmail: '',
    dob: '',
    phone: '',
    address: '',
    preferredLanguage: '',
    country: '',
    state: '',
    city: '',
    roleId: null,  
    agencyId: null,
  });
  const [open, setOpen] = useState(false);
  const countries = Country.getAllCountries() // it's an Array
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedPhoneCode, setSelectedPhoneCode] = useState('');

  const foundRole = roles.find(role => role.id === form.roleId) || null;
  const [errorData, setErrorData] = useState();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await fetchData(endpoints.role_getAll());

        if (data.error) {
          return
        }

        setRoles(data);
      } catch (error) {
        console.log("Error fetching roles:", error);
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
  
  const handleCreateUser = async () => {
    try {
      setErrorData([]); // Limpiar errores anteriores
      setButtonLoading(true);
  
      let imageUrl = null; // Inicializa imageUrl como null
  
      // 1. Subir la imagen solo si form.image no es null o undefined
      if (form.image) {
        const formData = new FormData();
        formData.append('file', form.image); // 'file' es el nombre del campo que espera el backend
        
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
        image: imageUrl, // Usar la URL de la imagen subida o null
      };  

      const userResponse = await fetchData(endpoints.user_create(), {
        method: 'POST',
        body: JSON.stringify(updatedForm),
      });

      if (userResponse.error) {
        setErrorData(userResponse.error);
        setButtonLoading(false);
        return;
      }

      setForm({
        name: "", 
        email: "", 
        password: '', 
        image: null,
        corporateEmail: '',
        dob: '',
        phone: '',
        address: '',
        preferredLanguage: '',
        country: '',
        state: '',
        city: '',
        roleId: null,  
        agencyId: null,
      });
      
      setSelectedPhoneCode('');

      toast({
        variant: "success",
        title: "Realizado!",
        description: "Usuario creado exitosamente.",
      });
  
    } catch (error) {
      console.log("Error:", error);
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
          <CardTitle>Creación de usuario</CardTitle>
          <CardDescription>
            Ventana para crear un nuevo usuario, agregue toda la información del usuario para poder continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">

            {/** Profile image Pending*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="image">Foto del usuario</Label>
            <AvatarInput
                image={form.image}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setForm({ ...form, image: file });
                }}
              />
              {errorData && renderFieldErrors('image',errorData)}
          </div>

            {/** Name Done */}
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="name">Nombre del usuario</Label>
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

            {/** Password Done*/}
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="name">Contraseña del usuario</Label>
            <Input 
              type="password" 
              id="password" 
              placeholder="Contraseña..." 
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})} /> 
              {errorData && renderFieldErrors('password',errorData)}
          </div>

            {/** Corporate email Done */}
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="name">Correo Corporativo</Label>
            <Input 
              type="email" 
              id="corporateEmail" 
              placeholder="Correo corporativo..." 
              value={form.corporateEmail}
              onChange={(e) => setForm({...form, corporateEmail: e.target.value})} />
              {errorData && renderFieldErrors('corporateEmail',errorData)}
          </div>

            {/** Date of Birth Pending*/}
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="phone">Fecha de nacimiento</Label>
            <DatePicker onDateChange={(date) => setForm({...form, dob: date})} />
            {errorData && renderFieldErrors('dob', errorData)}
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

          <div className="grid w-full max-w-lg items-center gap-1.5" >
              <Label htmlFor="user-type" >Idioma preferido</Label>
                <Select
                  value={form.preferredLanguage}
                  onValueChange={(value) => setForm({...form, preferredLanguage: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Idiomas</SelectLabel>
                      <SelectItem key="es" value="es" >
                          Español
                      </SelectItem>
                      <SelectItem key="en" value="en" >
                          Ingles
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errorData && renderFieldErrors('preferredLanguage',errorData)}
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

            {/** Role Done*/}
          <div className="grid w-full max-w-lg items-center gap-1.5" >
              <Label htmlFor="user-type" >Rol asociado</Label>
                <Select
                  value={form.roleId}
                  onValueChange={(value) => setForm({...form, roleId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Roles (Rol - Tipo - Agencia)</SelectLabel>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id} >
                          {role.name} - {role.scope} - {role.agency?.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errorData && renderFieldErrors('roleId',errorData)}
          </div>

          </div>
        </CardContent>
        <CardFooter className="w-full">
          <Button                 
            onClick={() => setOpen(true)}
            className="w-full md:w-[100px]" >
              { buttonLoading 
                ? (<span className="w-4 h-4 border-[1.5px] border-white border-t-transparent rounded-full animate-spin"></span>)
                : (<span>Crear Usuario</span>) }
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
                  <AlertDialogAction onClick={handleCreateUser} >Continuar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>

        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default withAuth(UsersCreate, permissions.user_create);
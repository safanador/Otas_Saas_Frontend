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
import { DatePicker } from "@/components/ui/date-picker";
import AvatarInput from "@/app/admin/components/Avatar/AvatarInput";
import { City, Country, State } from "country-state-city";
import { Countries } from "@/app/admin/components/CountryStateCity/Country";
import { States } from "@/app/admin/components/CountryStateCity/State";
import { Cities } from "@/app/admin/components/CountryStateCity/Cities";
import { PhoneCodes } from "@/app/admin/components/CountryStateCity/PhoneCode";


const UsersEdit = () => {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "", 
    email: "", 
    password: '', 
    image: null,
    corporateEmail: '',
    dob: '',
    phone: '',
    address: '',
    country: '',
    state: '',
    city: '',
    roleId: null,  
    agencyId: null,
  });
  const [roles, setRoles] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [open, setOpen] = useState(false);

  const [selectedPhoneCode, setSelectedPhoneCode] = useState()
  const [phoneNumber, setPhoneNumber] = useState()
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
    const fetchData = async () => {
      try {
        const responseForm = await fetch(`http://localhost:3000/api/v1/users/${id}`, {
          credentials: 'include'
        });
        const dataForm = await responseForm.json();
        let updatedForm = { ...dataForm, roleId: dataForm.role.id, agencyId: dataForm.role.agency ? dataForm.role.agency.id: null };
        const {id: userId, isActive,createdAt, updatedAt, role, ...rest} = updatedForm;
        updatedForm = rest;
        const phoneParts = updatedForm.phone.trim().split(" ");
        setForm({...updatedForm, phone: phoneParts[1]});
        setSelectedPhoneCode(phoneParts[0])
        
        const roleResponse = await fetch("http://localhost:3000/api/v1/roles/", {
            credentials: 'include'
          });
        if (roleResponse.status === 401) {
          window.location.href = '/auth/login';
          return;
        }
        if (roleResponse.status === 403) {
          window.location.href = '/admin/unauthorized';
          return;
        }
          const roleData = await roleResponse.json();
          setRoles(roleData);
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

    const handleEditUser = async (e) => {
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
          image: imageUrl, // Usar la URL de la imagen subida o null
        };
        console.log(updatedForm);
    
        const userResponse = await fetch(`http://localhost:3000/api/v1/users/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json', // Corrección
          },
          body: JSON.stringify(updatedForm),
          credentials: 'include',
        });
    
        // Verificar si la creación del usuario fue exitosa
        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          setErrorData(errorData.message);
          setButtonLoading(false);
          return;
        }
    
        setButtonLoading(false);
    
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

            {/** Profile image Pending*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="image">Foto del usuario</Label>
            <AvatarInput
                imageUrl={form.image}
                image={imageFromLocal}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImageFromLocal(file)
                  //setForm({ ...form, image: file });
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
            <DatePicker initialDate={form.dob} onDateChange={(date) => setForm({...form, dob: date})} />
            {errorData && renderFieldErrors('dob', errorData)}
          </div>

            {/** Phone Done*/}
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="phone">Número de Teléfono</Label>
            <div className="flex gap-1">
              <PhoneCodes countries={countries} onCodeSelect={(code) => setSelectedPhoneCode(code)} selectedPhoneCode={Number(selectedPhoneCode)} />
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
                    setPhoneNumber(phone);
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
         {/** */}  
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
                  <AlertDialogTitle>Estás seguro de crear este usuario?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Una vez creado el usuario va a recibir un correo electronico de confirmación.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel >Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleEditUser} >Continuar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>

        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default UsersEdit;

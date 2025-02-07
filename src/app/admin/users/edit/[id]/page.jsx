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


const UsersEdit = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [agencies, setAgencies] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { id } = useParams();

   // Renderiza un estado de carga mientras `id` no esté disponible
   if (!id) {
    return (
    <AdminLayout>
      <p>Cargando...</p>
    </AdminLayout>
    );
  }

  useEffect(() => {
    const fetchPermissionsAndAgencies = async () => {
      try {
        //permisos de la tabla de permisos
        const responsePermissions = await fetch("http://localhost:3000/api/v1/permissions/");
        const permissionsData = await responsePermissions.json();
        setPermissions(permissionsData);

        //Obtener rol desde la base de datos
        const responseForm = await fetch(`http://localhost:3000/api/v1/roles/${id}`, {
          credentials: 'include'
        });
        const formData = await responseForm.json();
        console.log(formData);
        const formattedPermissions = formData.permissions.map((p)=> permissionsData.find((pDb) => pDb.description === p.description)?.description);

        const { agency, createdAt, updatedAt, ...rest } = formData;

        setForm({
          ...rest,
          agencyId: agency?.id,
          permissions: formattedPermissions,
        });

        // Obtener agencias
        const responseAgencies = await fetch("http://localhost:3000/api/v1/agencies", {
          credentials: 'include',
        });
        const agenciesData = await responseAgencies.json();
        setAgencies(agenciesData);

      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissionsAndAgencies();
    
  }, [id]);

  if (loading) {
    return (
        <AdminLayout>
            <div className="flex items-center justify-center h-full">
                <p className="text-center">Cargando...</p>
            </div>
        </AdminLayout>
    );
  }

    const handleEditUser = async (e) => {
      try {
        setErrorData([]);
        
        /**
        const updatedForm = { 
          name: form.name, 
          permissions: formattedPermissions , 
          scope: form.scope }; */

        // Sobrescribir directamente los permisos en una copia del estado
        let updatedForm = { ...form, permissions: formattedPermissions };
        const { id, ...rest} = updatedForm;
        updatedForm = rest; //saca el id del form

        if (updatedForm.scope=== 'global') {
          updatedForm = {...updatedForm, agencyId: null};
        }
        console.log(updatedForm);
        
        const response = await fetch(`http://localhost:3000/api/v1/roles/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedForm),
          credentials: 'include'
        });

        if (response.ok) {
          toast({
            variant: "success",
            title: "Realizado!",
            description: "Rol editado exitosamente.",
          })
        }else{
          console.log(response)
          const errorData = await response.json(); 
          setErrorData(errorData.message)
        }
      
      } catch (error) {
          toast({
            variant: "destructive",
            title: "Uh oh! Parece que algo salió mal.",
            description: "No se pudo conectar con el servidor. Por favor, intenta más tarde.",
          })
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
                : (<span>Editar Usuario</span>) }
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Estás seguro de editar este usuario?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Las acciones realizadas pueden ser modificadas.
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

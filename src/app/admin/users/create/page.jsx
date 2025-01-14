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
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Toast, ToastDescription, ToastTitle } from "@/components/ui/toast";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Countries } from "../../components/CountryStateCity/Country";
import { States } from "../../components/CountryStateCity/State";
import { Cities } from "../../components/CountryStateCity/Cities";
import { PhoneCodes } from "../../components/CountryStateCity/PhoneCode";


const UsersCreate = () => {
  const [roles, setRoles] = useState([]);
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
        const response = await fetch("http://localhost:3000/api/v1/roles/", {
          credentials: 'include'
        });
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
  
    const handleCreateRole = async () => {
      try {
        setErrorData([])
        const formattedPermissions = form.permissions.map((p)=> permissions.find((pDb) => pDb.description === p)?.id).filter((id) => id !== undefined)
        
        // Sobrescribir directamente los permisos en una copia del estado
        let updatedForm = { ...form, permissions: formattedPermissions };
        if (updatedForm.scope=== 'global') {
          const { agencyId, ...rest} = updatedForm;
          updatedForm = rest; // Actualizar updatedForm sin agencyId
        }
        setForm(updatedForm);
        console.log(updatedForm);
        
        const response = await fetch("http://localhost:3000/api/v1/roles", {
          method: 'post',
          headers: {
            'Content-Type': 'application/json', // Corrección
          },
          body: JSON.stringify(updatedForm),
          credentials: 'include'
        });

        if (response.status === 403) {
          window.location.href = '/auth/login';
        }
        if (response.status === 401) {
          window.location.href = '/admin/unauthorized';
        }

        if (response.ok) {
          toast({
            variant: "success",
            title: "Realizado!",
            description: "Rol creado exitosamente.",
          })
        }else{
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

          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="name">Foto del usuario</Label>
            <Input 
              type="file" 
              id="name" 
              placeholder="Foto..." 
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})} />  {/**PENDIENTE */}
              {errorData && renderFieldErrors('name',errorData)}
          </div>

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

          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="phone">Fecha de nacimiento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !form.dob && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {form.dob ? format(form.dob, "PPP", { locale: es}) : <span>Selecciona una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.dob}
                  onSelect={(date) => setForm({...form, dob: date})}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
            {errorData && renderFieldErrors('dob', errorData)}
          </div>

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

          </div>
        </CardContent>
        <CardFooter className="w-full">
          <Button                 
            onClick={() => setOpen(true)}
            className="w-full md:w-[100px]" >
              Crear Usuario
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
                  <AlertDialogAction onClick={handleCreateRole} >Continuar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>

        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default UsersCreate;

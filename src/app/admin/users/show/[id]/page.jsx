"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

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
import { useParams } from "next/navigation";
import AdminLayout from "@/app/admin/components/SideBar/AdminLayout";
import { DatePicker } from "@/components/ui/date-picker";
import { Countries } from "@/app/admin/components/CountryStateCity/Country";
import { City, Country, State } from "country-state-city";
import { States } from "@/app/admin/components/CountryStateCity/State";
import { Cities } from "@/app/admin/components/CountryStateCity/Cities";
import AvatarInput from "@/app/admin/components/Avatar/AvatarInput";
import { PhoneCodes } from "@/app/admin/components/CountryStateCity/PhoneCode";


const UsersShow = () => {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    corporateEmail: "",
    dob: new Date(),
    phone: "",
    address: "",
    country: "",
    state: "",
    city: "",
    role: { id: "" },
    image: "https://example.com/user_images/john_doe.jpg"
  });
  const { id } = useParams();
  const countries = Country.getAllCountries(); // it's an Array
  //const [states, setStates] = useState([]);
  //const [cities, setCities] = useState([]);
  const [roles, setRoles] = useState([]);
  const states = State.getStatesOfCountry(form.country);
  const cities = City.getCitiesOfState(form.country, form.state);
   // Renderiza un estado de carga mientras `id` no esté disponible
   if (!id) {
    return (
    <AdminLayout>
      <p>Cargando...</p>
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
        console.log(dataForm);
        setForm(dataForm);

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
                <p className="text-center">Cargando...</p>
            </div>
        </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Información de usuario</CardTitle>
          <CardDescription>
            En esta ventana puedes ver toda la información relacionada al usuario.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">

            {/** Profile image */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="image">Foto del usuario</Label>
              <AvatarInput
                  imageUrl={form.image} isEditing={false}
                />
            </div>

              {/** Name Done */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">Nombre del usuario</Label>
              <Input
                disabled
                type="text" 
                id="name" 
                placeholder="Nombre..." 
                value={form.name}/>
            </div>

              {/** Email Done*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">Correo Electronico</Label>
              <Input 
                disabled
                type="email" 
                id="email" 
                placeholder="Correo electrónico..." 
                value={form.email}/>
            </div>

              {/** Corporate email Done */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">Correo Corporativo</Label>
              <Input 
                disabled
                type="email" 
                id="corporateEmail" 
                placeholder="Correo corporativo..." 
                value={form.corporateEmail === null? '' : form.corporateEmail}/>
            </div>

              {/** Date of Birth Pending*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="phone">Fecha de nacimiento</Label>
              <DatePicker disabled={true} initialDate={form.dob}  onDateChange={(date) => setForm({...form, dob: date})} />
            </div>

              {/** Phone Done*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="phone">Número de Teléfono</Label>
              <div className="flex gap-1">
                <Input
                  disabled
                  type="tel" 
                  id="phone"
                  placeholder="Número de teléfono (10 dígitos)..."
                  value={form.phone}
                />
              </div>
            </div>

              {/** Address Done*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">Dirección</Label>
              <Input 
                disabled
                type="text" 
                id="address" 
                placeholder="Dirección" 
                value={form.address}
                onChange={(e) => setForm({...form, address: e.target.value})} />
            </div>

               {/** Country Done*/}
            {form.country && (<div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">País</Label>
              <Countries 
                disabled={true}
                countries={countries} 
                selectedCountry={form.country}
                />
            </div>)}

            { form.country && (<div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">Estado</Label>
              <States 
                disabled={true}
                states={states} 
                selectedState={form.state} 
                 />
            </div>)}

            {cities.length > 0 && (<div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">Ciudad</Label>
              <Cities 
                disabled={true}
                cities={cities} 
                selectedCity={form.city} 
                />
            </div>)}{/***/}

              {/** Role Done*/}
            <div className="grid w-full max-w-lg items-center gap-1.5" >
                <Label htmlFor="user-type" >Rol asociado</Label>
                  <Select
                    disabled
                    value={form.role.id}
                    onValueChange={(value) => setForm({...form, role: value})}>
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
            </div>
        </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default UsersShow;

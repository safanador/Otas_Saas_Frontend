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
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";


const AgencyShow = () => {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    rnt: "",
    url: "",
    phone: "",
    phone2: "",
    address: "",
    country: "",
    state: "",
    city: "",
    logo: null
  });
  const { id } = useParams();
  const countries = Country.getAllCountries(); // it's an Array
  const states = State.getStatesOfCountry(form.country);
  const cities = City.getCitiesOfState(form.country, form.state);
  const [selectedPhoneCode, setSelectedPhoneCode] = useState('');
  const [selectedPhoneCode2, setSelectedPhoneCode2] = useState('');
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

        const data = await fetchData(endpoints.agency_getOne(id));

        if (data.error) {
          return console.log(data.error);
        }

        const phoneParts = data.phone.trim().split(" ");
        const phone2Parts = data.phone2.trim().split(" ");

        setForm({...data, phone: phoneParts[1], phone2: phone2Parts[1]});
        setSelectedPhoneCode(phoneParts[0])
        setSelectedPhoneCode2(phone2Parts[0])

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

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Información de la agencia</CardTitle>
          <CardDescription>
            En esta ventana puedes ver toda la información relacionada a la agencia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">

            {/** Profile image */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <AvatarInput
                  imageUrl={form.logo} isEditing={false}
                />
            </div>

              {/** Name Done */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">Nombre</Label>
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

              {/** Phone Done*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="phone">Número de Teléfono</Label>
              <div className="flex gap-1">
                <PhoneCodes disabled={true} countries={countries} onCodeSelect={(code) => setSelectedPhoneCode(code)} selectedPhoneCode={selectedPhoneCode} />
                <Input
                  disabled
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
            </div>

              {/** Phone2 */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="phone">Teléfono alternativo</Label>
              <div className="flex gap-1">
                <PhoneCodes disabled={true} countries={countries} onCodeSelect={(code) => setSelectedPhoneCode2(code)} selectedPhoneCode={selectedPhoneCode2} />
                <Input
                  disabled
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
            </div>

             {/** RNT Done */}
             <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">Registro Nacional de Turismo</Label>
              <Input
                disabled
                type="text" 
                id="name" 
                placeholder="Nombre..." 
                value={form.rnt}/>
            </div>

             {/** URL Done */}
             <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">Enlace página web</Label>
              <Input
                disabled
                type="text" 
                id="name" 
                placeholder="Nombre..." 
                value={form.url}/>
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

             
        </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default withAuth(AgencyShow, permissions.agency_show);
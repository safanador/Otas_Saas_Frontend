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
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";


const UsersCreate = () => {
  
  const { preferredLanguage } = useSelector((state) => state.auth.user);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (preferredLanguage) {
       i18n.changeLanguage(preferredLanguage);
     }
  }, [preferredLanguage, i18n]);

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
    countryCode: '',
    address: '',
    preferredLanguage: '',
    country: '',
    state: '',
    city: '',
    roleId: null,  
    agencyId: null,
  });
  const [open, setOpen] = useState(false);
  const countries = Country.getAllCountries()
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

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
            title: t("toast.error.title"),
            description: t("admin.agencyCreate.imageUploadError"),
          });
          setButtonLoading(false);
          return;
        }
  
        imageUrl = imageResponse.imageUrl; // Asignar la URL de la imagen
      }
  
      // 2. Crear el usuario con la URL de la imagen (o null si no se subió ninguna)
      const updatedForm = {
        ...form,
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
        countryCode: '',
        preferredLanguage: '',
        country: '',
        state: '',
        city: '',
        roleId: null,  
        agencyId: null,
      });
      
      //setSelectedPhoneCode('');

      toast({
        variant: "success",
        title: t("toast.success.title"),
        description: t("toast.success.userCreated"),
      });
  
    } catch (error) {
      console.log("Error:", error);
      toast({
        variant: "destructive",
        title: t("toast.error.title"),
        description: t("toast.error.serverConnection"),
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
          <CardTitle>{t("admin.userCreate.title")}</CardTitle>
          <CardDescription>
          {t("admin.userCreate.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">

            {/** Profile image Pending*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="image">{t("admin.userCreate.fields.profileImage")}
            </Label>
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
            <Label htmlFor="name">{t("admin.userCreate.fields.name")}</Label>
            <Input 
              type="text" 
              id="name" 
              placeholder={t("admin.userCreate.placeholders.name")}
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})} />
              {errorData && renderFieldErrors('name',errorData)}
          </div>

            {/** Email Done*/}
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="name">{t("admin.userCreate.fields.email")}</Label>
            <Input 
              type="email" 
              id="email" 
              placeholder={t("admin.userCreate.placeholders.email")}
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})} />
              {errorData && renderFieldErrors('email',errorData)}
          </div>

            {/** Password Done*/}
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="name">{t("admin.userCreate.fields.password")}</Label>
            <Input 
              type="password" 
              id="password" 
              placeholder={t("admin.userCreate.placeholders.password")}
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})} /> 
              {errorData && renderFieldErrors('password',errorData)}
          </div>

            {/** Corporate email Done */}
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="name">{t("admin.userCreate.fields.corporateEmail")}</Label>
            <Input 
              type="email" 
              id="corporateEmail" 
              placeholder={t("admin.userCreate.placeholders.corporateEmail")}
              value={form.corporateEmail}
              onChange={(e) => setForm({...form, corporateEmail: e.target.value})} />
              {errorData && renderFieldErrors('corporateEmail',errorData)}
          </div>

            {/** Date of Birth Pending*/}
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="phone">{t("admin.userCreate.fields.dob")}</Label>
            <DatePicker onDateChange={(date) => setForm({...form, dob: date})} />
            {errorData && renderFieldErrors('dob', errorData)}
          </div>

            {/** Phone Done*/}
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="phone">{t("admin.userCreate.fields.phone")}</Label>
            <div className="flex gap-1">
              <PhoneCodes countries={countries} onCodeSelect={(code) => setForm({...form, countryCode: code})} selectedPhoneCode={form.countryCode} />
              <Input
                type="tel" 
                id="phone"
                placeholder={t("admin.userCreate.placeholders.phone")}
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
            <Label htmlFor="name">{t("admin.userCreate.fields.address")}</Label>
            <Input 
              type="text" 
              id="address" 
              placeholder={t("admin.userCreate.placeholders.address")}
              value={form.address}
              onChange={(e) => setForm({...form, address: e.target.value})} />
              {errorData && renderFieldErrors('address',errorData)}
          </div>

          <div className="grid w-full max-w-lg items-center gap-1.5" >
              <Label htmlFor="user-type" >{t("admin.userCreate.fields.preferredLanguage")}</Label>
                <Select
                  value={form.preferredLanguage}
                  onValueChange={(value) => setForm({...form, preferredLanguage: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.userCreate.placeholders.language")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("common.preferredLanguages.title")}</SelectLabel>
                      <SelectItem key="es" value="es" >
                        {t("common.preferredLanguages.spanish")}
                      </SelectItem>
                      <SelectItem key="en" value="en" >
                        {t("common.preferredLanguages.english")}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errorData && renderFieldErrors('preferredLanguage',errorData)}
          </div>

             {/** Country Done*/}
          {countries && (<div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="name">{t("admin.userCreate.fields.country")}</Label>
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
            <Label htmlFor="name">{t("admin.userCreate.fields.state")}</Label>
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
            <Label htmlFor="name">{t("admin.userCreate.fields.city")}</Label>
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
              <Label htmlFor="user-type" >{t("admin.userCreate.fields.role")}</Label>
                <Select
                  value={form.roleId}
                  onValueChange={(value) => setForm({...form, roleId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.userCreate.placeholders.role")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("admin.userCreate.fields.roleLabel")}</SelectLabel>
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
                : (<span>{t("common.save")}</span>) }
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("admin.userCreate.confirmation.title")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("admin.userCreate.confirmation.description")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel >{t("common.cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCreateUser} >{t("common.continue")}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>

        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default withAuth(UsersCreate, permissions.user_create);
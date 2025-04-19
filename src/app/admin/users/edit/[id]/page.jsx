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
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";
import endpoints from "@/lib/endpoints";
import { fetchData } from "@/services/api";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";


const UsersEdit = () => {
      // Get language from Redux store
      const { preferredLanguage } = useSelector((state) => state.auth.user);

      // Initialize translation hook
      const { t, i18n } = useTranslation();
    
      // Set the language from Redux
      useEffect(() => {
        if (preferredLanguage) {
          i18n.changeLanguage(preferredLanguage);
        }
      }, [preferredLanguage, i18n]);
      
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
    preferredLanguage: '',
    countryCode: '',
    country: '',
    state: '',
    city: '',
    roleId: null,  
    agencyId: null,
  });
  const [roles, setRoles] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [open, setOpen] = useState(false);
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
    const fetchInfo = async () => {
      try {
    
        const dataForm = await fetchData(endpoints.user_getOne(id));

        if (dataForm.error) {
          return console.log(dataForm.error);
        }

        let updatedForm = { ...dataForm, roleId: dataForm.role.id, agencyId: dataForm.role.agency ? dataForm.role.agency.id: null };

        const {id: userId, isActive,createdAt, updatedAt, role, ...rest} = updatedForm;
        updatedForm = rest;

        setForm(updatedForm);
      
        const roleData = await fetchData(endpoints.role_getAll());

        if (roleData.error) {
          return console.log(roleData.error);
        }
        setRoles(roleData);
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

          const imageData = await fetchData(endpoints.images_upload(), {
            method: 'POST',
            body: formData,
          });
  
          if (imageData.error) {
            toast({
              variant: "destructive",
              title: t("toast.error.title"),
              description: t("admin.agencyCreate.imageUploadError"),
            });
            setButtonLoading(false);
            return;
          }
    
          imageUrl = imageData.imageUrl; // Asignar la URL de la imagen
        }
    
        // 2. Crear el usuario con la URL de la imagen (o null si no se subió ninguna)
        const updatedForm = {
          ...form,
          image: imageUrl,
        };

        const userResponse = await fetchData(endpoints.user_update(id), {
          method: 'PATCH',
          body: JSON.stringify(updatedForm),
        });

        if (userResponse.error) {
          setErrorData(userResponse.error);
          setButtonLoading(false);
          return
        }
    
        toast({
          variant: "success",
          title: t("toast.success.title"),
          description: t("toast.success.userEdited"),
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
          <CardTitle>{t("admin.userEdit.title")}</CardTitle>
          <CardDescription>
            {t("admin.userEdit.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">

            {/** Profile image Pending*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="image">{t("admin.userEdit.fields.profileImage")}</Label>
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
            <Label htmlFor="name">{t("admin.userEdit.fields.name")}</Label>
            <Input 
              type="text" 
              id="name" 
              placeholder={t("admin.userEdit.placeholders.name")}
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})} />
              {errorData && renderFieldErrors('name',errorData)}
          </div>

            {/** Email Done*/}
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="name">{t("admin.userEdit.fields.email")}</Label>
            <Input 
              type="email" 
              id="email" 
              placeholder={t("admin.userEdit.placeholders.email")}
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})} />
              {errorData && renderFieldErrors('email',errorData)}
          </div>

            {/** Corporate email Done */}
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="name">{t("admin.userEdit.fields.corporateEmail")}</Label>
            <Input 
              type="email" 
              id="corporateEmail" 
              placeholder={t("admin.userEdit.placeholders.corporateEmail")}
              value={form.corporateEmail}
              onChange={(e) => setForm({...form, corporateEmail: e.target.value})} />
              {errorData && renderFieldErrors('corporateEmail',errorData)}
          </div>

            {/** Date of Birth Pending*/}
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="phone">{t("admin.userEdit.fields.dob")}</Label>
            <DatePicker initialDate={form.dob} onDateChange={(date) => setForm({...form, dob: date})} />
            {errorData && renderFieldErrors('dob', errorData)}
          </div>

            {/** Phone Done*/}
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="phone">{t("admin.userEdit.fields.phone")}</Label>
            <div className="flex gap-1">
              <PhoneCodes countries={countries} onCodeSelect={(code) => setForm({...form, countryCode: code})} selectedPhoneCode={Number(form.countryCode)} />
              <Input
                type="tel" 
                id="phone"
                placeholder={t("admin.userEdit.placeholders.phone")}
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
            <Label htmlFor="name">{t("admin.userEdit.fields.address")}</Label>
            <Input 
              type="text" 
              id="address" 
              placeholder={t("admin.userEdit.placeholders.address")}
              value={form.address}
              onChange={(e) => setForm({...form, address: e.target.value})} />
              {errorData && renderFieldErrors('address',errorData)}
          </div>

                    <div className="grid w-full max-w-lg items-center gap-1.5" >
                        <Label htmlFor="user-type" >{t("admin.userEdit.fields.preferredLanguage")}</Label>
                          <Select
                            value={form.preferredLanguage}
                            onValueChange={(value) => setForm({...form, preferredLanguage: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder={t("admin.userEdit.placeholders.language")} />
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
            <Label htmlFor="name">{t("admin.userEdit.fields.country")}</Label>
            <Countries
              countries={countries} 
              selectedCountry={form.country}
              onCountryChange={(newCountry) => {
                setForm({...form, country: newCountry, state: '', city: ''});
                }}/>
              {errorData && renderFieldErrors('country',errorData)}
          </div>)}

          { form.country && (<div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="name">{t("admin.userEdit.fields.state")}</Label>
            <States
              states={states} 
              selectedState={form.state} 
              onStateChange={(newState) => {
                setForm({...form, state: newState});
                }} />
              {errorData && renderFieldErrors('state',errorData)}
          </div>)}

          {cities.length > 0 && (<div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="name">{t("admin.userEdit.fields.city")}</Label>
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
              <Label htmlFor="user-type" >{t("admin.userEdit.fields.role")}</Label>
                <Select
                  value={form.roleId}
                  onValueChange={(value) => setForm({...form, roleId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.userEdit.placeholders.role")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("admin.userEdit.fields.roleLabel")}</SelectLabel>
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
                : (<span className="px-2 py-1">{t("common.save")}</span>) }
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("admin.userEdit.confirmation.title")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("admin.userEdit.confirmation.description")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel >{t("common.cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleEditUser} >{t("common.continue")}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>

        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default withAuth(UsersEdit, permissions.user_update);
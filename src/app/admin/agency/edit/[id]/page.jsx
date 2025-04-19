"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../../components/SideBar/AdminLayout";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import AvatarInput from "@/app/admin/components/Avatar/AvatarInput";
import { City, Country, State } from "country-state-city";
import { Countries } from "@/app/admin/components/CountryStateCity/Country";
import { States } from "@/app/admin/components/CountryStateCity/State";
import { Cities } from "@/app/admin/components/CountryStateCity/Cities";
import { PhoneCodes } from "@/app/admin/components/CountryStateCity/PhoneCode";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const AgencyEdit = () => {
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
    logo: null,
    phone: '',
    countryCode: '',
    phone2: '',
    countryCode2: '',
    rnt: '',
    url: '',
    address: '',
    country: '',
    state: '',
    city: '',
  });
  const [errorData, setErrorData] = useState([]);
  const [open, setOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [imageFromLocal, setImageFromLocal] = useState(null);
  const countries = Country.getAllCountries();
  const states = State.getStatesOfCountry(form.country);
  const cities = City.getCitiesOfState(form.country, form.state);
  const { toast } = useToast();
  const { id } = useParams();

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
        const dataForm = await fetchData(endpoints.agency_getOne(id));

        if (dataForm.error) {
          return console.log(dataForm.error);
        }
        let updatedForm = { ...dataForm};
        const {id: agencyId, isActive, createdAt, updatedAt, ...rest} = updatedForm;
        updatedForm = rest;

        setForm(updatedForm);
          
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

  const handleEditAgency = async (e) => {
    try {
      setErrorData([]);
      setButtonLoading(true);
      console.log(form);

      let imageUrl = form.image || null;

      if (imageFromLocal) {
        const formData = new FormData();
        formData.append('file', imageFromLocal);

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
    
        imageUrl = imageResponse.imageUrl;
      }
    
      const updatedForm = {
        ...form,
        logo: imageUrl,
      };
    
      const agencyResponse = await fetchData(endpoints.agency_update(id), {
        method: 'PUT',
        body: JSON.stringify(updatedForm),
      });

      if (agencyResponse.error) {
        setErrorData(agencyResponse.error);
        setButtonLoading(false);
        return
      }
    
      toast({
        variant: "success",
        title: t("toast.success.title"),
        description: t("admin.agencyEdit.success"),
      });
    
    } catch (error) {
      setButtonLoading(false);
      console.error("Error:", error);
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
          <CardTitle>{t("admin.agencyEdit.title")}</CardTitle>
          <CardDescription>
            {t("admin.agencyEdit.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <AvatarInput
                  imageUrl={form.logo}
                  image={imageFromLocal}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageFromLocal(file)
                  }}
                />
                {errorData && renderFieldErrors('logo',errorData)}
            </div>

            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">{t("admin.agencyEdit.fields.name")}</Label>
              <Input 
                type="text" 
                id="name" 
                placeholder={t("common.item")} 
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})} />
                {errorData && renderFieldErrors('name',errorData)}
            </div>

            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">{t("admin.agencyEdit.fields.email")}</Label>
              <Input 
                type="email" 
                id="email" 
                placeholder={t("admin.agencyEdit.fields.email")} 
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})} />
                {errorData && renderFieldErrors('email',errorData)}
            </div>

            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="phone">{t("admin.agencyEdit.fields.phone")}</Label>
              <div className="flex gap-1">
                <PhoneCodes countries={countries} onCodeSelect={(code) => setForm({...form, countryCode: code})} selectedPhoneCode={form.countryCode} />
                <Input
                  type="tel" 
                  id="phone"
                  placeholder={t("admin.agencyEdit.fields.phonePlaceholder")}
                  value={form.phone}
                  onChange={(e) => {
                    const phone = e.target.value;
                    if (/^\d{0,10}$/.test(phone)) {
                      setForm({ ...form, phone });
                    }
                  }}
                />
              </div>
              {errorData && renderFieldErrors('phone', errorData)}
            </div>

            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="phone">{t("admin.agencyEdit.fields.alternatePhone")}</Label>
              <div className="flex gap-1">
                <PhoneCodes countries={countries} onCodeSelect={(code) => setForm({...form, countryCode2: code})} selectedPhoneCode={form.countryCode2} />
                <Input
                  type="tel" 
                  id="phone"
                  placeholder={t("admin.agencyEdit.fields.phonePlaceholder")}
                  value={form.phone2}
                  onChange={(e) => {
                    const phone = e.target.value;
                    if (/^\d{0,10}$/.test(phone)) {
                      setForm({ ...form, phone2: phone });
                    }
                  }}
                />
              </div>
              {errorData && renderFieldErrors('phone2', errorData)}
            </div>

            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">{t("admin.agencyEdit.fields.rnt")}</Label>
              <Input 
                type="text" 
                id="name" 
                placeholder={t("admin.agencyEdit.fields.rntPlaceholder")} 
                value={form.rnt}
                onChange={(e) => setForm({...form, rnt: e.target.value})} />
                {errorData && renderFieldErrors('rnt',errorData)}
            </div>

            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">{t("admin.agencyEdit.fields.web")}</Label>
              <Input 
                type="text" 
                id="name" 
                placeholder={t("admin.agencyEdit.fields.webPlaceholder")} 
                value={form.url}
                onChange={(e) => setForm({...form, url: e.target.value})} />
                {errorData && renderFieldErrors('url',errorData)}
            </div>

            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">{t("admin.agencyCreate.fields.address")}</Label>
              <Input 
                type="text" 
                id="address" 
                placeholder={t("admin.agencyEdit.fields.address")} 
                value={form.address}
                onChange={(e) => setForm({...form, address: e.target.value})} />
                {errorData && renderFieldErrors('address',errorData)}
            </div>

            {countries && (<div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">{t("admin.agencyEdit.fields.country")}</Label>
              <Countries
                countries={countries} 
                selectedCountry={form.country}
                onCountryChange={(newCountry) => {
                  setForm({...form, country: newCountry, state: '', city: ''});
                  }}/>
                {errorData && renderFieldErrors('country',errorData)}
            </div>)}

            { form.country && (<div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">{t("admin.agencyEdit.fields.state")}</Label>
              <States
                states={states} 
                selectedState={form.state} 
                onStateChange={(newState) => {
                  setForm({...form, state: newState});
                  }} />
                {errorData && renderFieldErrors('state',errorData)}
            </div>)}

            {cities.length > 0 && (<div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">{t("admin.agencyEdit.fields.city")}</Label>
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
                : (<span className="px-2 py-1">{t("common.save")}</span>) }
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("admin.agencyEdit.confirmTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("admin.agencyEdit.confirmDescription")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleEditAgency}>{t("common.continue")}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default withAuth(AgencyEdit, permissions.agency_update);
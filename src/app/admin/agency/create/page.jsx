"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PhoneCodes } from "../../components/CountryStateCity/PhoneCode";
import { Countries } from "../../components/CountryStateCity/Country";
import { Cities } from "../../components/CountryStateCity/Cities";
import { States } from "../../components/CountryStateCity/State";
import AdminLayout from "../../components/SideBar/AdminLayout";
import AvatarInput from "../../components/Avatar/AvatarInput";
import { Country, State, City } from 'country-state-city';
import React, { useEffect, useState } from "react";
import withAuth from "@/app/middleware/withAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import permissions from "@/lib/permissions";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const AgencyCreate = () => {
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
  
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    logo: null,
    phone: '',
    countryCode: '',
    url: '',
    rnt: '',
    phone2: '',
    countryCode2: '',
    address: '',
    country: '',
    state: '',
    city: '',
  });
  const [open, setOpen] = useState(false);
  const countries = Country.getAllCountries();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errorData, setErrorData] = useState();
  const { toast } = useToast();

  const handleCreateAgency = async () => {
    try {
      setErrorData([]);
      setButtonLoading(true);
      
      let imageUrl = null;

      if (form.logo) {
        const formData = new FormData();
        formData.append('file', form.logo);

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

      const agencyResponse = await fetchData(endpoints.agency_create(), {
        method: 'POST',
        body: JSON.stringify(updatedForm),
      });

      if (agencyResponse.error) {
        setErrorData(agencyResponse.error);
        setButtonLoading(false);
        return;
      }

      toast({
        variant: "success",
        title: t("toast.success.title"),
        description: t("toast.success.agencyCreated"),
      });

      setForm({
        name: "",
        email: "",
        logo: null,
        phone: '',
        countryCode: '',
        url: '',
        rnt: '',
        phone2: '',
        countryCode2: '',
        address: '',
        country: '',
        state: '',
        city: '',
      });

    } catch (error) {
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
          <CardTitle>{t("admin.agencyCreate.title")}</CardTitle>
          <CardDescription>
            {t("admin.agencyCreate.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">

            {/* Logo image */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <AvatarInput
                image={form.logo}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setForm({ ...form, logo: file });
                }}
              />
              {errorData && renderFieldErrors('logo', errorData)}
            </div>

            {/* Name */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">{t("admin.agencyCreate.fields.name")}</Label>
              <Input
                type="text"
                id="name"
                placeholder={t("admin.agencyCreate.fields.name")}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errorData && renderFieldErrors('name', errorData)}
            </div>

            {/* Email */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="email">{t("admin.agencyCreate.fields.email")}</Label>
              <Input
                type="email"
                id="email"
                placeholder={t("admin.agencyCreate.fields.email")}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errorData && renderFieldErrors('email', errorData)}
            </div>

            {/* Phone */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="phone">{t("admin.agencyCreate.fields.phone")}</Label>
              <div className="flex gap-1">
                <PhoneCodes
                  countries={countries}
                  onCodeSelect={(code) => setForm({ ...form, countryCode: code })}
                  selectedPhoneCode={form.countryCode}
                />
                <Input
                  type="tel"
                  id="phone"
                  placeholder={t("admin.agencyCreate.fields.phonePlaceholder")}
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

            {/* Alternate Phone */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="phone2">{t("admin.agencyCreate.fields.alternatePhone")}</Label>
              <div className="flex gap-1">
                <PhoneCodes
                  countries={countries}
                  onCodeSelect={(code) => setForm({ ...form, countryCode2: code })}
                  selectedPhoneCode={form.countryCode2}
                />
                <Input
                  type="tel"
                  id="phone2"
                  placeholder={t("admin.agencyCreate.fields.phonePlaceholder")}
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

            {/* Website */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="url">{t("admin.agencyCreate.fields.web")}</Label>
              <Input
                type="text"
                id="url"
                placeholder={t("admin.agencyCreate.fields.webPlaceholder")}
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
              />
              {errorData && renderFieldErrors('url', errorData)}
            </div>

            {/* RNT */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="rnt">{t("admin.agencyCreate.fields.rnt")}</Label>
              <Input
                type="text"
                id="rnt"
                placeholder={t("admin.agencyCreate.fields.rntPlaceholder")}
                value={form.rnt}
                onChange={(e) => setForm({ ...form, rnt: e.target.value })}
              />
              {errorData && renderFieldErrors('rnt', errorData)}
            </div>

            {/* Address */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="address">{t("admin.agencyCreate.fields.address")}</Label>
              <Input
                type="text"
                id="address"
                placeholder={t("admin.agencyCreate.fields.address")}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
              {errorData && renderFieldErrors('address', errorData)}
            </div>

            {/* Country */}
            {countries && (
              <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="country">{t("admin.agencyCreate.fields.country")}</Label>
                <Countries
                  countries={countries}
                  selectedCountry={form.country}
                  onCountryChange={(newCountry) => {
                    setForm({ ...form, country: newCountry, state: '', city: '' });
                    const fetchedStates = State.getStatesOfCountry(newCountry);
                    setStates(fetchedStates);
                  }}
                />
                {errorData && renderFieldErrors('country', errorData)}
              </div>
            )}

            {/* State */}
            {form.country && (
              <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="state">{t("admin.agencyCreate.fields.state")}</Label>
                <States
                  states={states}
                  selectedState={form.state}
                  onStateChange={(newState) => {
                    setForm({ ...form, state: newState });
                    const fetchedCities = City.getCitiesOfState(form.country, newState);
                    setCities(fetchedCities);
                  }}
                />
                {errorData && renderFieldErrors('state', errorData)}
              </div>
            )}

            {/* City */}
            {cities.length > 0 && (
              <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="city">{t("admin.agencyCreate.fields.city")}</Label>
                <Cities
                  cities={cities}
                  selectedCity={form.city}
                  onCityChange={(newCity) => {
                    setForm({ ...form, city: newCity });
                  }}
                />
                {errorData && renderFieldErrors('city', errorData)}
              </div>
            )}

          </div>
        </CardContent>
        <CardFooter className="w-full">
          <Button
            onClick={() => setOpen(true)}
            className="w-full md:w-[100px]"
          >
            {buttonLoading
              ? (<span className="w-4 h-4 border-[1.5px] border-white border-t-transparent rounded-full animate-spin"></span>)
              : (<span>{t("common.save")}</span>)}
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("admin.agencyCreate.confirmTitle")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("admin.agencyCreate.confirmDescription")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleCreateAgency}>{t("common.continue")}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default withAuth(AgencyCreate, permissions.agency_create);
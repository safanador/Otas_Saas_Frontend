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
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";


const AgencyShow = () => {
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
    rnt: "",
    url: "",
    phone: "",
    countryCode: "",
    phone2: "",
    countryCode2: "",
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

        setForm(data);

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
          <CardTitle>{t('admin.agencyShow.title')}</CardTitle>
          <CardDescription>
            {t('admin.agencyShow.description')}
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
              <Label htmlFor="name">{t('admin.agencyShow.fields.name')}</Label>
              <Input
                disabled
                type="text" 
                id="name" 
                placeholder={t('admin.agencyShow.fields.name')} 
                value={form.name}/>
            </div>

              {/** Email Done*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="email">{t('admin.agencyShow.fields.email')}</Label>
              <Input 
                disabled
                type="email" 
                id="email" 
                placeholder={t('admin.agencyShow.fields.email')} 
                value={form.email}/>
            </div>

              {/** Phone Done*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="phone">{t('admin.agencyShow.fields.phone')}</Label>
              <div className="flex gap-1">
                <PhoneCodes disabled={true} countries={countries} onCodeSelect={(code) => setForm({...form, countryCode: code})} selectedPhoneCode={form.countryCode} />
                <Input
                  disabled
                  type="tel" 
                  id="phone"
                  placeholder={t('admin.agencyShow.fields.phonePlaceholder')}
                  value={form.phone}
                  onChange={(e) => {
                    const phone = e.target.value;
                    if (/^\d{0,10}$/.test(phone)) {
                      setForm({ ...form, phone });
                    }
                  }}
                />
              </div>
            </div>

              {/** Phone2 */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="phone2">{t('admin.agencyShow.fields.alternatePhone')}</Label>
              <div className="flex gap-1">
                <PhoneCodes disabled={true} countries={countries} onCodeSelect={(code) => setForm({...form, countryCode2: code})} selectedPhoneCode={form.countryCode2} />
                <Input
                  disabled
                  type="tel" 
                  id="phone2"
                  placeholder={t('admin.agencyShow.fields.phonePlaceholder')}
                  value={form.phone2}
                  onChange={(e) => {
                    const phone = e.target.value;
                    if (/^\d{0,10}$/.test(phone)) {
                      setForm({ ...form, phone2: phone });
                    }
                  }}
                />
              </div>
            </div>

             {/** RNT Done */}
             <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="rnt">{t('admin.agencyShow.fields.rnt')}</Label>
              <Input
                disabled
                type="text" 
                id="rnt" 
                placeholder={t('admin.agencyShow.fields.rntPlaceholder')} 
                value={form.rnt}/>
            </div>

             {/** URL Done */}
             <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="url">{t('admin.agencyShow.fields.web')}</Label>
              <Input
                disabled
                type="text" 
                id="url" 
                placeholder={t('admin.agencyShow.fields.webPlaceholder')} 
                value={form.url}/>
            </div>

              {/** Address Done*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="address">{t('admin.agencyShow.fields.address')}</Label>
              <Input 
                disabled
                type="text" 
                id="address" 
                placeholder={t('admin.agencyShow.fields.address')} 
                value={form.address}
                onChange={(e) => setForm({...form, address: e.target.value})} />
            </div>

               {/** Country Done*/}
            {form.country && (<div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="country">{t('admin.agencyShow.fields.country')}</Label>
              <Countries 
                disabled={true}
                countries={countries} 
                selectedCountry={form.country}
                />
            </div>)}

            { form.country && (<div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="state">{t('admin.agencyShow.fields.state')}</Label>
              <States 
                disabled={true}
                states={states} 
                selectedState={form.state} 
                 />
            </div>)}

            {cities.length > 0 && (<div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="city">{t('admin.agencyShow.fields.city')}</Label>
              <Cities 
                disabled={true}
                cities={cities} 
                selectedCity={form.city} 
                />
            </div>)}
        </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default withAuth(AgencyShow, permissions.agency_show);
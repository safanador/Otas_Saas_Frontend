"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
import endpoints from "@/lib/endpoints";
import { fetchData } from "@/services/api";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";


const UsersShow = () => {
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
    corporateEmail: "",
    dob: new Date(),
    phone: "",
    address: "",
    countryCode: '',
    preferredLanguage: '',
    country: "",
    state: "",
    city: "",
    role: { id: "" },
    image: "https://example.com/user_images/john_doe.jpg"
  });
  const { id } = useParams();
  const countries = Country.getAllCountries(); // it's an Array
  const [roles, setRoles] = useState([]);
  const states = State.getStatesOfCountry(form.country);
  const cities = City.getCitiesOfState(form.country, form.state);

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
    const fetchInformation = async () => {
      try {
        const data = await fetchData(endpoints.user_getOne(id));

        if (data.error) {
          return console.log(data.error);
        }

        setForm(data);

        
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

    fetchInformation();
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
          <CardTitle>{t("admin.userShow.title")}</CardTitle>
          <CardDescription>
            {t("admin.userShow.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">

            {/** Profile image */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="image">{t("admin.userShow.fields.profileImage")}</Label>
              <AvatarInput
                  imageUrl={form.image} isEditing={false}
                />
            </div>

              {/** Name Done */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">{t("admin.userShow.fields.name")}</Label>
              <Input
                disabled
                type="text" 
                id="name" 
                placeholder={t("admin.userShow.placeholders.name")}
                value={form.name}/>
            </div>

              {/** Email Done*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">{t("admin.userShow.fields.email")}</Label>
              <Input 
                disabled
                type="email" 
                id="email" 
                placeholder={t("admin.userShow.placeholders.email")}
                value={form.email}/>
            </div>

              {/** Corporate email Done */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">{t("admin.userShow.fields.corporateEmail")}</Label>
              <Input 
                disabled
                type="email" 
                id="corporateEmail" 
                placeholder={t("admin.userShow.placeholders.corporateEmail")}
                value={form.corporateEmail === null? '' : form.corporateEmail}/>
            </div>

              {/** Date of Birth Pending*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="phone">{t("admin.userShow.fields.dob")}</Label>
              <DatePicker disabled={true} initialDate={form.dob}  onDateChange={(date) => setForm({...form, dob: date})} />
            </div>

              {/** Phone Done*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="phone">{t("admin.userShow.fields.phone")}</Label>
              <div className="flex gap-1">
                <Input
                  disabled
                  type="tel" 
                  id="phone"
                  placeholder={t("admin.userShow.placeholders.phone")}
                  value={form.phone}
                />
              </div>
            </div>

              {/** Address Done*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">{t("admin.userShow.fields.address")}</Label>
              <Input 
                disabled
                type="text" 
                id="address" 
                placeholder={t("admin.userShow.placeholders.address")}
                value={form.address}
                onChange={(e) => setForm({...form, address: e.target.value})} />
            </div>

             {/** preferred language Done*/}
             <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">{t("admin.userShow.fields.preferredLanguage")}</Label>
              <Input 
                disabled
                type="text" 
                id="preferredLanguage" 
                placeholder={t("admin.userShow.placeholders.preferredLanguage")}
                value={form.preferredLanguage}
                onChange={(e) => setForm({...form, address: e.target.value})} />
            </div>

               {/** Country Done*/}
            {form.country && (<div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">{t("admin.userShow.fields.country")}</Label>
              <Countries 
                disabled={true}
                countries={countries} 
                selectedCountry={form.country}
                />
            </div>)}

            { form.country && (<div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">{t("admin.userShow.fields.state")}</Label>
              <States 
                disabled={true}
                states={states} 
                selectedState={form.state} 
                 />
            </div>)}

            {cities.length > 0 && (<div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">{t("admin.userShow.fields.city")}</Label>
              <Cities 
                disabled={true}
                cities={cities} 
                selectedCity={form.city} 
                />
            </div>)}{/***/}

              {/** Role Done*/}
            <div className="grid w-full max-w-lg items-center gap-1.5" >
                <Label htmlFor="user-type" >{t("admin.userShow.fields.role")}</Label>
                  <Select
                    disabled
                    value={form.role.id}
                    onValueChange={(value) => setForm({...form, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("admin.userShow.placeholders.role")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{t("admin.userShow.fields.roleLabel")}</SelectLabel>
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

export default withAuth(UsersShow, permissions.user_show);
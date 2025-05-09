"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from "next/navigation";
import AdminLayout from "@/app/admin/components/SideBar/AdminLayout";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const PlanShow = () => {

  const { preferredLanguage } = useSelector((state) => state.auth.user);
  const { t, i18n } = useTranslation();  
  
  useEffect(() => {
   if (preferredLanguage) {
     i18n.changeLanguage(preferredLanguage);
   }
  }, [preferredLanguage, i18n]);

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    durationInDays: null,
    isTrial: false,
  });
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
        const data = await fetchData(endpoints.plan_getOne(id));

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
          <CardTitle>{t("admin.planShow.title")}</CardTitle>
          <CardDescription>
            {t("admin.planShow.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">
              {/** Name Done */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">{t("admin.planShow.fields.name")}</Label>
              <Input
                disabled
                type="text" 
                id="name" 
                placeholder={t("admin.planShow.placeholders.name")}
                value={form.name}/>
            </div>

              {/** description Done*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">{t("admin.planShow.fields.description")}</Label>
              <Input 
                disabled
                type="text" 
                id="email" 
                placeholder={t("admin.planShow.placeholders.description")}
                value={form.description}/>
            </div>

              {/** price Done */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">{t("admin.planShow.fields.price")}</Label>
              <Input 
                disabled
                type="text" 
                id="corporateEmail" 
                placeholder={t("admin.planShow.placeholders.price")}
                value={form.price}/>
            </div>

              {/** Duration in Days Done*/}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">{t("admin.planShow.fields.duration")}</Label>
              <Input 
                disabled
                type="text" 
                id="address" 
                placeholder={t("admin.planShow.placeholders.duration")}
                value={form.durationInDays}
                onChange={(e) => setForm({...form, durationInDays: e.target.value})} />
            </div>

            {/** Trial in Days Done*/}
            <div className="flex items-center w-full max-w-lg justify-between gap-1.5">
              <Label htmlFor="name">{t("admin.planShow.fields.trial")}</Label>
              <Checkbox disabled checked={form.isTrial}  />
            </div>
        </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default withAuth(PlanShow, permissions.plan_show);
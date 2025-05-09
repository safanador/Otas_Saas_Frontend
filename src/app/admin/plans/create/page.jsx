"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../components/SideBar/AdminLayout";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";


const PlansCreate = () => {

  const { preferredLanguage } = useSelector((state) => state.auth.user);
  const { t, i18n } = useTranslation(); 

  useEffect(() => {
   if (preferredLanguage) {
     i18n.changeLanguage(preferredLanguage);
   }
  }, [preferredLanguage, i18n]);

  const [buttonLoading, setButtonLoading] = useState(false);
  const initialFormState = {
    name: "",
    description: "",
    price: 0,
    durationInDays: 0,
    isTrial: false,
  };
  const [form, setForm] = useState(initialFormState);
  const [open, setOpen] = useState(false);
  const [errorData, setErrorData] = useState();
  const { toast } = useToast();
  
  const handleCreate = async () => {
    try {
      setErrorData([]); // Limpiar errores anteriores
      setButtonLoading(true);

      const response = await fetchData(endpoints.plan_create(), {
        method: 'POST',
        body: JSON.stringify(form),
      });

      if (response.error) {
        setErrorData(response.error);
        setButtonLoading(false);
        return;
      }
  
      // Mostrar mensaje de éxito
      toast({
        variant: "success",
        title: t("toast.success.title"),
        description: t("toast.success.planCreated"),
      });
      setForm(initialFormState);
  
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
          <CardTitle>{t("admin.planCreate.title")}</CardTitle>
          <CardDescription>
            {t("admin.planCreate.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">
                {/** Name Done */}
              <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="name">{t("admin.planCreate.fields.name")}</Label>
                <Input
                  type="text" 
                  id="name" 
                  placeholder={t("admin.planCreate.placeholders.name")}
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})} 
                />
                {errorData && renderFieldErrors('name',errorData)}
              </div>

                {/** description Done*/}
              <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="name">{t("admin.planCreate.fields.description")}</Label>
                <Input 
                  type="text" 
                  id="email" 
                  placeholder={t("admin.planCreate.placeholders.description")}
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})} 
                />
                {errorData && renderFieldErrors('description',errorData)}
              </div>

                {/** price Done */}
              <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="name">{t("admin.planCreate.fields.price")}</Label>
                <Input 
                  type="number" 
                  id="corporateEmail" 
                  placeholder={t("admin.planCreate.placeholders.price")}
                  value={form.price}
                  onChange={(e) => setForm({...form, price: e.target.value})} 
                />
                {errorData && renderFieldErrors('price',errorData)}
              </div>

                {/** Duration in Days Done*/}
              <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="name">{t("admin.planCreate.fields.duration")}</Label>
                <Input 
                  type="number" 
                  id="address" 
                  placeholder={t("admin.planCreate.placeholders.duration")}
                  value={form.durationInDays}
                  onChange={(e) => setForm({...form, durationInDays: e.target.value})} 
                />
                {errorData && renderFieldErrors('durationInDays',errorData)}
              </div>

              {/** Trial in Days Done*/}
              <div className="flex items-center w-full max-w-lg justify-between gap-1.5">
                <Label htmlFor="name">{t("admin.planCreate.fields.trial")}</Label>
                <Checkbox                   
                  onCheckedChange={(e) => setForm({...form, isTrial: e})}
                  checked={form.isTrial}  />
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
                  <AlertDialogTitle>{t("admin.planCreate.confirmationDialog.title")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("admin.planCreate.confirmationDialog.description")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel >{t("common.cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCreate} >{t("common.continue")}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>

        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default withAuth(PlansCreate, permissions.plan_create);
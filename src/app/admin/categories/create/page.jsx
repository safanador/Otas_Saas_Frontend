"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../components/SideBar/AdminLayout";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const CategoryCreate = () => {
  const { preferredLanguage } = useSelector((state) => state.auth.user);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (preferredLanguage) {
      i18n.changeLanguage(preferredLanguage);
    }
  }, [preferredLanguage, i18n]);

  const [form, setForm] = useState({ name: "", description: "" });
  const [open, setOpen] = useState(false);
  const [errorData, setErrorData] = useState();
  const { toast } = useToast();
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleCreateRole = async () => {
    try {
      setButtonLoading(true);
      setErrorData([]);

      const response = await fetchData(endpoints.category_create(), {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (response.error) {
        setErrorData(response.error);
        return;
      }

      toast({
        variant: "success",
        title: t("toast.success.title"),
        description: t("toast.success.categoryCreated"),
      });

      setForm({ name: "", description: "" });
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
      .filter((error) => error.property === fieldName)
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
          <CardTitle>{t("admin.categoryCreate.title")}</CardTitle>
          <CardDescription>
            {t("admin.categoryCreate.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">
                {t("admin.categoryCreate.fields.name")}
              </Label>
              <Input
                type="text"
                id="name"
                placeholder={t("admin.categoryCreate.placeholders.name")}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errorData && renderFieldErrors("name", errorData)}
            </div>

            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="name">
                {t("admin.categoryCreate.fields.description")}
              </Label>
              <Input
                type="text"
                id="name"
                placeholder={t("admin.categoryCreate.placeholders.description")}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              {errorData && renderFieldErrors("description", errorData)}
            </div>
          </div>
        </CardContent>
        <CardFooter className="w-full">
          <Button onClick={() => setOpen(true)} className="w-full md:w-[100px]">
            {buttonLoading ? (
              <span className="w-4 h-4 border-[1.5px] border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span>{t("common.save")}</span>
            )}
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("admin.categoryCreate.confirmationDialog.title")}
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleCreateRole}>
                  {t("common.continue")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default withAuth(CategoryCreate, permissions.role_create);

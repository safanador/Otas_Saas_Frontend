"use client"
import AdminLayout from "../components/SideBar/AdminLayout"
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Button } from "@/components/ui/button"
  import { useRouter } from 'next/navigation'
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";


export default function UnauthorizedPage() {

  const { preferredLanguage } = useSelector((state) => state.auth.user);
  const { t, i18n } = useTranslation();    

  useEffect(() => {
   if (preferredLanguage) {
     i18n.changeLanguage(preferredLanguage);
   }
  }, [preferredLanguage, i18n]);

  return (
    <AdminLayout>
        <Card>
            <CardHeader>
                <CardTitle>
                    <h1 className="text-xl font-semibold">{t("admin.AccessDenied.title")}</h1>
                </CardTitle>
                <CardDescription>
                    <p>{t("admin.AccessDenied.description")}</p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>{t("admin.AccessDenied.message")}</p>            
            </CardContent>
            <CardFooter>
                
            </CardFooter>
        </Card>
    </AdminLayout>
)
}

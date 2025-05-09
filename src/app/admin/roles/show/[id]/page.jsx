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
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";


const RolesShow = () => {
  const { preferredLanguage } = useSelector((state) => state.auth.user);
  const { t, i18n } = useTranslation();  
  
  useEffect(() => {
   if (preferredLanguage) {
     i18n.changeLanguage(preferredLanguage);
   }
  }, [preferredLanguage, i18n]);

  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
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
    const fetchPermissions = async () => {
      try {
        const response = await fetchData(endpoints.permissions_getAll());
        if (response.error) {
          return console.log(response.error);
        }
        setPermissions(response);
        const responseForm = await fetchData(endpoints.role_getOne(id));

        if (responseForm.error) {
          return console.log(responseForm.error);
        }
        const formattedPermissions = responseForm.permissions.map((p)=> response.find((pDb) => pDb.description === p.description)?.description);

        setForm({
          ...responseForm,
          permissions: formattedPermissions,
        });
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
    
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

  // tabla de permisos
  const entities = [
    { spanish: t("admin.roleShow.permissionsTable.entities.dashboard"), english: 'dashboard' },
    { spanish: t("admin.roleShow.permissionsTable.entities.role"), english: 'role' },
    { spanish: t("admin.roleShow.permissionsTable.entities.user"), english: 'user' },
    { spanish: t("admin.roleShow.permissionsTable.entities.agency"), english: 'agency' },
    { spanish: t("admin.roleShow.permissionsTable.entities.plan"), english: 'plan' },
    { spanish: t("admin.roleShow.permissionsTable.entities.subscription"), english: 'subscription' },
    { spanish: t("admin.roleShow.permissionsTable.entities.payment"), english: 'payment' },
    { spanish: t("admin.roleShow.permissionsTable.entities.log"), english: 'log' },
  ];

  const getPermission = (action, entity) => {
    const permissionString = `${action} ${entity}`;
    return permissions.find((p) => p.description === permissionString);
  };

  const handleCheckboxChange = (permission) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((perm) => perm !== permission)
        : [...prev.permissions, permission],
    }));
  };

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.roleShow.title")}</CardTitle>
          <CardDescription>{t("admin.roleShow.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="name">{t("admin.roleShow.fields.name")}</Label>
            <Input 
              disabled
              type="text" 
              id="name" 
              placeholder={t("admin.roleShow.placeholders.name")}
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})} />
          </div>

            <div className="grid w-full max-w-lg items-center gap-1.5" >
              <Label htmlFor="user-type" >{t("admin.roleShow.fields.type")}</Label>
              <Select
                disabled
                value={form.scope}
                onValueChange={(value) => setForm({...form, scope: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.roleShow.placeholders.type")}/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("admin.roleShow.selectedOptions.types.label")}</SelectLabel>
                    <SelectItem value="agency">{t("admin.roleShow.selectOptions.types.agency")}</SelectItem>
                    <SelectItem value="global">{t("admin.roleShow.selectOptions.types.global")}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            { form.scope === 'agency' && (
              <div className="grid w-full max-w-lg items-center gap-1.5" >
                <Label htmlFor="user-type" >{t("admin.roleShow.fields.agency")}</Label>
                <Select
                  disabled
                  value={form.agency.id}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.roleShow.placeholders.agency")}/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("admin.roleShow.selectedOptions.agencies.label")}</SelectLabel>
                        <SelectItem key={form.agency.id} value={form.agency.id} >
                          {form.agency.name}
                        </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid w-full max-w-lg items-center gap-1.5" >
            <Label htmlFor="permissions" >{t("admin.roleShow.fields.permissions")}</Label>
            <div className="overflow-x-auto bg-white rounded-lg shadow dark:bg-gray-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">{t("admin.roleShow.permissionsTable.headers.entities")}</TableHead>
                    <TableHead className="text-center">{t("admin.roleShow.permissionsTable.headers.show")}</TableHead>
                    <TableHead className="text-center">{t("admin.roleShow.permissionsTable.headers.list")}</TableHead>
                    <TableHead className="text-center">{t("admin.roleShow.permissionsTable.headers.create")}</TableHead>
                    <TableHead className="text-center">{t("admin.roleShow.permissionsTable.headers.update")}</TableHead>
                    <TableHead className="text-center">{t("admin.roleShow.permissionsTable.headers.delete")}</TableHead>
                    <TableHead className="text-center">{t("admin.roleShow.permissionsTable.headers.activate")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entities.map((entity, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center" >{entity.spanish}</TableCell>
                      {["show", "list", "create", "update", "delete", "activate"].map(
                        (action,index) => (
                            <td key={index} className="border p-2 text-center">
                            {getPermission(action, entity.english) && (
                                <Checkbox
                                disabled
                                id={`permission-${action}-${index}`}
                                checked={form.permissions.includes(
                                    `${action} ${entity.english}`
                                )}
                                onCheckedChange={() =>
                                    handleCheckboxChange(
                                    `${action} ${entity.english}`
                                    )
                                }
                                />
                            )}
                            </td>
                        )
                        )}
                    </TableRow>
                  ))
                  }
                </TableBody>
              </Table>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default withAuth(RolesShow, permissions.role_show);
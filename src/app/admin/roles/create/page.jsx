"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../components/SideBar/AdminLayout";

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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Toast, ToastDescription, ToastTitle } from "@/components/ui/toast";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";


const RolesCreate = () => {
  const { preferredLanguage } = useSelector((state) => state.auth.user);
  const { t, i18n } = useTranslation();  
  
  useEffect(() => {
   if (preferredLanguage) {
     i18n.changeLanguage(preferredLanguage);
   }
  }, [preferredLanguage, i18n]);

  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({name: "", scope: "", permissions: [], agencyId: null});
  const [agencies, setAgencies] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorData, setErrorData] = useState();
  const { toast } = useToast();
  const [buttonLoading, setButtonLoading] = useState(false);
  

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetchData(endpoints.permissions_getAll());
        if (response.error) {
          return console.log(response.error);
        }
        setPermissions(response);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();

    const fetchAgencies = async () => {
      try {
        const response = await fetchData(endpoints.agency_getAll());
        if (response.error) {
          return console.log(response.error);
        }
        
        setAgencies(response);
      } catch (error) {
        console.error("Error fetching agencies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
  }, []);

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
    { spanish: t("admin.roleCreate.permissionsTable.entities.dashboard"), english: 'dashboard' },
    { spanish: t("admin.roleCreate.permissionsTable.entities.role"), english: 'role' },
    { spanish: t("admin.roleCreate.permissionsTable.entities.user"), english: 'user' },
    { spanish: t("admin.roleCreate.permissionsTable.entities.agency"), english: 'agency' },
    { spanish: t("admin.roleCreate.permissionsTable.entities.plan"), english: 'plan' },
    { spanish: t("admin.roleCreate.permissionsTable.entities.subscription"), english: 'subscription' },
    { spanish: t("admin.roleCreate.permissionsTable.entities.payment"), english: 'payment' },
    { spanish: t("admin.roleCreate.permissionsTable.entities.log"), english: 'log' },
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

    const handleCreateRole = async () => {
      try {
        setButtonLoading(true);
        setErrorData([])
        const formattedPermissions = form.permissions.map((p)=> permissions.find((pDb) => pDb.description === p)?.id).filter((id) => id !== undefined)
        
        // Sobrescribir directamente los permisos en una copia del estado
        let updatedForm = { ...form, permissions: formattedPermissions };
        if (updatedForm.scope=== 'global') {
          const { agencyId, ...rest} = updatedForm;
          updatedForm = rest; // Actualizar updatedForm sin agencyId
        }
        setForm(updatedForm);
        console.log(updatedForm);
        
        const response = await fetchData(endpoints.role_create(), {
          method: 'POST',
          body: JSON.stringify(updatedForm),
        });

        if (response.error) {
          setErrorData(response.error);
          return;
        }

        toast({
          variant: "success",
          title: t("toast.success.title"),
          description: t("toast.success.roleCreated"),
        });

        setForm({name: "", scope: "", permissions: [], agencyId: null});
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
          <CardTitle>{t("admin.roleCreate.title")}</CardTitle>
          <CardDescription>
            {t("admin.roleCreate.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="name">{t("admin.roleCreate.fields.name")}</Label>
            <Input 
              type="text" 
              id="name" 
              placeholder={t("admin.roleCreate.placeholders.name")}
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})} />
              {errorData && renderFieldErrors('name',errorData)}
          </div>

            <div className="grid w-full max-w-lg items-center gap-1.5" >
              <Label htmlFor="user-type" >{t("admin.roleCreate.fields.type")}</Label>
              <Select
                value={form.scope}
                onValueChange={(value) => setForm({...form, scope: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.roleCreate.placeholders.type")}/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("admin.roleCreate.selectOptions.types.label")}</SelectLabel>
                    <SelectItem value="agency">{t("admin.roleCreate.selectOptions.types.agency")}</SelectItem>
                    <SelectItem value="global">{t("admin.roleCreate.selectOptions.types.global")}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errorData && renderFieldErrors('scope',errorData)}
            </div>

            { form.scope === 'agency' && (
              <div className="grid w-full max-w-lg items-center gap-1.5" >
                <Label htmlFor="user-type" >{t("admin.roleCreate.fields.agency")}</Label>
                <Select
                  value={form.agencyId}
                  onValueChange={(value) => setForm({...form, agencyId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.roleCreate.placeholders.agency")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("admin.roleCreate.selectedOptions.agencies.label")}</SelectLabel>
                      {agencies.map((agency) => (
                        <SelectItem key={agency.id} value={agency.id} >
                          {agency.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errorData && renderFieldErrors('agencyId',errorData)}

              </div>
            )}

            <div className="grid w-full max-w-lg items-center gap-1.5" >
            <Label htmlFor="permissions" >{t("admin.roleCreate.fields.permissions")}</Label>
            <div className="overflow-x-auto bg-white rounded-lg shadow dark:bg-gray-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">{t("admin.roleCreate.permissionsTable.headers.entities")}</TableHead>
                    <TableHead className="text-center">{t("admin.roleCreate.permissionsTable.headers.show")}</TableHead>
                    <TableHead className="text-center">{t("admin.roleCreate.permissionsTable.headers.list")}</TableHead>
                    <TableHead className="text-center">{t("admin.roleCreate.permissionsTable.headers.create")}</TableHead>
                    <TableHead className="text-center">{t("admin.roleCreate.permissionsTable.headers.update")}</TableHead>
                    <TableHead className="text-center">{t("admin.roleCreate.permissionsTable.headers.delete")}</TableHead>
                    <TableHead className="text-center">{t("admin.roleCreate.permissionsTable.headers.activate")}</TableHead>
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
              {errorData &&  renderFieldErrors('permissions',errorData)}
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
                  <AlertDialogTitle>{t("admin.roleCreate.confirmationDialog.title")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("admin.roleCreate.confirmationDialog.description")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel >{t("common.cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCreateRole} >{t("common.continue")}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>

        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default withAuth(RolesCreate, permissions.role_create);
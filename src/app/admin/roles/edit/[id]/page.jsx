"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../../components/SideBar/AdminLayout";

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
import { useParams } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";


const RolesEdit = () => {
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
  const [agencies, setAgencies] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { id } = useParams();
  const [buttonLoading, setButtonLoading] = useState(false);

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
    const fetchPermissionsAndAgencies = async () => {
      try {
        //permisos de la tabla de permisos
        const responsePermissions = await fetchData(endpoints.permissions_getAll());
        if (responsePermissions.error) {
          return console.log(responsePermissions.error);
        }
        setPermissions(responsePermissions);

        //Obtener rol desde la base de datos
        const responseForm = await fetchData(endpoints.role_getOne(id));

        if (responseForm.error) {
          return console.log(responseForm.error);
        }

        const formattedPermissions = responseForm.permissions.map((p)=> responsePermissions.find((pDb) => pDb.description === p.description)?.description);

        const { agency, createdAt, updatedAt, ...rest } = responseForm;

        setForm({
          ...rest,
          agencyId: agency?.id,
          permissions: formattedPermissions,
        });

        // Obtener agencias
        const responseAgencies = await fetchData(endpoints.agency_getAll());
        if (responseAgencies.error) {
          return console.log(responseAgencies.error);
        }
        
        setAgencies(responseAgencies);

      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissionsAndAgencies();
    
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

  console.log(form)

  // tabla de permisos
  const entities = [
    { spanish: t("admin.roleEdit.permissionsTable.entities.dashboard"), english: 'dashboard' },
    { spanish: t("admin.roleEdit.permissionsTable.entities.role"), english: 'role' },
    { spanish: t("admin.roleEdit.permissionsTable.entities.user"), english: 'user' },
    { spanish: t("admin.roleEdit.permissionsTable.entities.agency"), english: 'agency' },
    { spanish: t("admin.roleEdit.permissionsTable.entities.plan"), english: 'plan' },
    { spanish: t("admin.roleEdit.permissionsTable.entities.subscription"), english: 'subscription' },
    { spanish: t("admin.roleEdit.permissionsTable.entities.payment"), english: 'payment' },
    { spanish: t("admin.roleEdit.permissionsTable.entities.log"), english: 'log' },
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

    const handleCreateRole = async (e) => {
      try {
        setButtonLoading(true);
        setErrorData([]);
        const formattedPermissions = form.permissions.map((p)=> permissions.find((pDb) => pDb.description === p)?.id).filter((id) => id !== undefined)
        
        let updatedForm = { ...form, permissions: formattedPermissions };
        const { id, ...rest} = updatedForm;
        updatedForm = rest; //saca el id del form

        if (updatedForm.scope=== 'global') {
          updatedForm = {...updatedForm, agencyId: null};
        }
        
        const response = await fetchData(endpoints.role_update(id), {
          method: 'PATCH',
          body: JSON.stringify(updatedForm),
        });

        if (response.error) {
          setErrorData(response.error);
          return
        }

        toast({
          variant: "success",
          title: t("toast.success.title"),
          description: t("toast.success.roleEdited"),
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
          <CardTitle>{t("admin.roleEdit.title")}</CardTitle>
          <CardDescription>{t("admin.roleEdit.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="name">{t("admin.roleEdit.fields.name")}</Label>
            <Input 
              type="text" 
              id="name" 
              placeholder={t("admin.roleEdit.placeholders.name")}
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})} />
              {errorData &&  renderFieldErrors('name',errorData)}
          </div>

            <div className="grid w-full max-w-lg items-center gap-1.5" >
              <Label htmlFor="user-type" >{t("admin.roleEdit.fields.type")}</Label>
              <Select
                value={form.scope}
                onValueChange={(value) => setForm({...form, scope: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.roleEdit.placeholders.type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("admin.roleEdit.selectedOptions.types.label")}</SelectLabel>
                    <SelectItem value="agency">{t("admin.roleEdit.selectOptions.types.agency")}</SelectItem>
                    <SelectItem value="global">{t("admin.roleEdit.selectOptions.types.global")}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errorData &&  renderFieldErrors('scope',errorData)}
            </div>

            { form.scope === 'agency' && (
              <div className="grid w-full max-w-lg items-center gap-1.5" >
                <Label htmlFor="user-type" >{t("admin.roleEdit.fields.agency")}</Label>
                <Select
                  value={form.agencyId}
                  onValueChange={(value) => setForm({...form, agencyId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.roleEdit.placeholders.agency")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("admin.roleEdit.selectedOptions.agencies.label")}</SelectLabel>
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
            <Label htmlFor="permissions" >{t("admin.roleEdit.fields.permissions")}</Label>
            <div className="overflow-x-auto bg-white rounded-lg shadow dark:bg-gray-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">{t("admin.roleEdit.permissionsTable.headers.entities")}</TableHead>
                    <TableHead className="text-center">{t("admin.roleEdit.permissionsTable.headers.show")}</TableHead>
                    <TableHead className="text-center">{t("admin.roleEdit.permissionsTable.headers.list")}</TableHead>
                    <TableHead className="text-center">{t("admin.roleEdit.permissionsTable.headers.create")}</TableHead>
                    <TableHead className="text-center">{t("admin.roleEdit.permissionsTable.headers.update")}</TableHead>
                    <TableHead className="text-center">{t("admin.roleEdit.permissionsTable.headers.delete")}</TableHead>
                    <TableHead className="text-center">{t("admin.roleEdit.permissionsTable.headers.activate")}</TableHead>
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
                : (<span className="px-2 py-1">{t("common.save")}</span>) }          
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("admin.roleEdit.confirmationDialog.title")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("admin.roleEdit.confirmationDialog.description")}
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

export default withAuth(RolesEdit, permissions.role_update);
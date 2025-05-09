"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../components/SideBar/AdminLayout";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";
import PermissionGuard from "@/components/PermissionGuard";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const RolesList = () => {

  const { preferredLanguage } = useSelector((state) => state.auth.user);
  const { t, i18n } = useTranslation();    
  useEffect(() => {
   if (preferredLanguage) {
     i18n.changeLanguage(preferredLanguage);
   }
  }, [preferredLanguage, i18n]);

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState();

  useEffect(() => {
    const fetchRoles = async () => {
      try {

        const data = await fetchData(endpoints.role_getAll());
        
        if (data.error) {
          return console.log(data.error);
        }
        setRoles(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

   // Filtrar roles en función del término de búsqueda
   const filteredRoles = roles?.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
        <AdminLayout>
          <div className="flex items-center justify-center h-full">
            <span className="w-8 h-8 border-[3px] border-black border-t-transparent rounded-full animate-spin"></span>
          </div>
        </AdminLayout>
    );
  }

  const handleDeleteRole = async (id) => {
    try {

      const data = await fetchData(endpoints.role_delete(id), {
        method: 'DELETE',
      });

      if (data.error) {
        return
      }

      toast({
        variant: "success",
        title: t("toast.success.title"),
        description: t("toast.success.roleDeleted"),
      })
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
        toast({
          variant: "destructive",
          title: t("toast.error.title"),
          description: t("toast.error.serverConnection"),
        })
    }
  };

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.roleList.title")}</CardTitle>
          <CardDescription>{t("admin.roleList.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container mx-auto py-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center gap-2">
                <Input 
                type="search" 
                placeholder={t("admin.roleList.searchPlaceholder")}
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64" />
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <div className="overflow-x-auto bg-white rounded-lg shadow dark:bg-gray-800">
                <Table>
                  <TableHeader>
                    <TableRow>
                    <TableHead className="text-center">{t("admin.roleList.table.headers.item")}</TableHead>
                      <TableHead className="text-left">{t("admin.roleList.table.headers.role")}</TableHead>
                      <TableHead className="text-left">{t("admin.roleList.table.headers.roleType")}</TableHead>
                      <TableHead className="text-left">{t("admin.roleList.table.headers.agency")}</TableHead>
                      <TableHead className="text-left">{t("admin.roleList.table.headers.createdAt")}</TableHead>
                      <TableHead className="text-left">{t("admin.roleList.table.headers.updatedAt")}</TableHead>
                      <TableHead className="text-left">{t("common.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.length > 0 ? (filteredRoles.map((role, index) => (
                      <TableRow key={role.id}>
                        <TableCell className="text-center" >{index+1}</TableCell>
                        <TableCell className="capitalize" >{role.name}</TableCell>
                        <TableCell className="capitalize" >{role.scope === t("admin.roleList.table.body.agencyScope") ? `Agencias` : t("admin.roleList.table.body.companyScope")}</TableCell>
                        <TableCell className="capitalize" >{role.agency?.name}</TableCell>
                        <TableCell>{new Date(role.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(role.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">{t("common.openMenu")}</span>
                              <MoreHorizontal className="h-4 w-4" />
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            align="end"
                            onInteractOutside={(e) => {
                                if (open) {
                                  e.preventDefault();
                                }
                              }}
                            >
                              <DropdownMenuLabel>{t("common.actions")}</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => router.push(`/admin/roles/show/${role.id}`)}>
                                <Eye />{t("admin.roleList.table.body.viewRole")}
                              </DropdownMenuItem>
                              <PermissionGuard requiredPermission={permissions.role_update}>
                                <DropdownMenuItem onClick={() => router.push(`/admin/roles/edit/${role.id}`) } >
                                  <Pencil />{t("admin.roleList.table.body.editRole")}
                                </DropdownMenuItem>
                              </PermissionGuard>
                              <DropdownMenuSeparator />
                              <PermissionGuard requiredPermission={permissions.role_delete}>
                                <DropdownMenuItem onClick={(e) => {
                                      e.preventDefault();
                                      setOpen(true);
                                      setSelectedRole(role);
                                    }}>
                                <Trash2 color="red" /> 
                                  <span className="text-red-500" >{t("admin.roleList.table.body.deleteRole")}</span>
                                </DropdownMenuItem> 
                              </PermissionGuard>
                          </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          {t("admin.roleList.table.body.noRoles")}
                        </TableCell>
                      </TableRow>
                  )
                    }
                  </TableBody>
                </Table>
                <AlertDialog open={open} onOpenChange={setOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("admin.roleList.deleteDialog.title")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("admin.roleList.deleteDialog.description")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel >{t("common.cancel")}</AlertDialogCancel>
                      <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={() => handleDeleteRole(selectedRole?.id)} >{t("common.continue")}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default withAuth(RolesList, permissions.role_list);
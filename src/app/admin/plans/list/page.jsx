"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../components/SideBar/AdminLayout";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil, TestTubeDiagonalIcon, TestTubesIcon, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";
import PermissionGuard from "@/components/PermissionGuard";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const PlansList = () => {
  
  const { preferredLanguage } = useSelector((state) => state.auth.user);
  const { t, i18n } = useTranslation();    
  useEffect(() => {
   if (preferredLanguage) {
     i18n.changeLanguage(preferredLanguage);
   }
  }, [preferredLanguage, i18n]);

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState();

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const plansData = await fetchData(endpoints.plan_getAll());
        
        if (plansData.error) {
          return console.log(plansData.error);
        }
        setPlans(plansData);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);

   // Filtrar roles en función del término de búsqueda
   const filteredPlans = plans?.filter((plan) =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleDelete = async (id) => {
    try {

      const data = await fetchData(endpoints.plan_delete(id), {
        method: 'DELETE',
      });

      if (data.error) {
        return
      }

      toast({
        variant: "success",
        title: t("toast.success.title"),
        description: t("toast.success.planDeleted"),
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

  // toggle state
  const handleToggleUserState = async (id) => {

  };

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.planList.title")}</CardTitle>
          <CardDescription>{t("admin.planList.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container mx-auto py-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center gap-2">
                <Input 
                type="search" 
                placeholder={t("admin.planList.searchPlaceholder")}
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
                      <TableHead className="text-center">{t("admin.planList.table.headers.item")}</TableHead>
                      <TableHead className="text-left">{t("admin.planList.table.headers.name")}</TableHead>
                      <TableHead className="text-left">{t("admin.planList.table.headers.description")}</TableHead>
                      <TableHead className="text-left">{t("admin.planList.table.headers.price")}</TableHead>
                      <TableHead className="text-left">{t("admin.planList.table.headers.duration")}</TableHead>
                      <TableHead className="text-left">{t("admin.planList.table.headers.trial")}</TableHead>
                      <TableHead className="text-left">{t("admin.planList.table.headers.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlans.length > 0 ? (filteredPlans.map((plan, index) => (
                      <TableRow key={plan.id}>
                        <TableCell className="text-center" >{index+1}</TableCell>
                        <TableCell className="capitalize" >{plan.name}</TableCell>
                        <TableCell className="capitalize" >{plan.description}</TableCell>
                        <TableCell className="capitalize" >{plan.price}</TableCell>
                        <TableCell className="capitalize" >{plan.durationInDays}</TableCell>
                        <TableCell className="capitalize" >
                          <Checkbox disabled checked={plan.isTrial}  />
                        </TableCell>
                        <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">{t("common.openMenu")}</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuLabel>{t("common.actions")}</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => router.push(`/admin/plans/show/${plan.id}`)}>
                              <Eye /> {t("admin.planList.table.body.viewPlan")}
                              </DropdownMenuItem>
                              <PermissionGuard requiredPermission={permissions.plan_update}>
                                <DropdownMenuItem onClick={() => router.push(`/admin/plans/edit/${plan.id}`) } >
                                <Pencil/> {t("admin.planList.table.body.editPlan")}
                                </DropdownMenuItem>
                              </PermissionGuard>
                              <DropdownMenuSeparator />
                              <PermissionGuard requiredPermission={permissions.plan_list}>
                                <DropdownMenuItem onClick={(e) => {
                                      e.preventDefault(); // Evita que el menú se cierre automáticamente
                                      setOpen(true);
                                      setSelectedPlan(plan);
                                    }}>
                                  <Trash2 color="red" />
                                  <span className="text-red-500" >{t("admin.planList.table.body.deletePlan")}</span>
                                </DropdownMenuItem>
                              </PermissionGuard>
                              
                          </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          {t("admin.planList.table.body.noPlans")}
                        </TableCell>
                      </TableRow>
                  )
                    }
                  </TableBody>
                </Table>

                {/** Delete confirmation */}

                <AlertDialog open={open} onOpenChange={setOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("admin.planList.deleteDialog.title")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("admin.planList.deleteDialog.description")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel >{t("common.cancel")}</AlertDialogCancel>
                      <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={() => handleDelete(selectedPlan?.id)} >{t("common.continue")}</AlertDialogAction>
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

export default withAuth(PlansList, permissions.plan_list);
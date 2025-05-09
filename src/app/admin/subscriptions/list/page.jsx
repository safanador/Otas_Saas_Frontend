"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../components/SideBar/AdminLayout";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeftRight, Eye, MoreHorizontal, Pencil, ReceiptEuro, Repeat, Trash2 } from "lucide-react";
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

const SubscritionList = () => {

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

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState();

  const formattedDate = (date) => {
    const locale = {
      en: 'en-US',
      es: 'es-ES',
      pt: 'pt-BR'
    }[preferredLanguage] || 'en-US';
  
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await fetchData(endpoints.subscription_getAll());
        if(response.error) {
          return console.log(response.error);
        }
        setSubscriptions(response);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);

   // Filtrar roles en función del término de búsqueda
   const filteredSubscriptions = subscriptions?.filter((subscription) =>
    subscription.agency.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      
      const response = await fetchData(endpoints.subscription_delete(id), {
        method: 'DELETE',
      });

      if (response.error) {
        return console.log(response.error);
      }

      toast({
        variant: "success",
        title: t('toast.success.title'),
        description: t('toast.success.subscriptionStatusChanged'),
      })
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
        toast({
          variant: "destructive",
          title: t('toast.error.title'),
          description: t('toast.error.serverConnection'),
        })
    }
  };

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.subscriptionsList.title')}</CardTitle>
          <CardDescription>{t('admin.subscriptionsList.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container mx-auto py-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center gap-2">
                <Input 
                type="search" 
                placeholder={t('admin.subscriptionsList.searchPlaceholder')}
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
                    <TableHead className="text-center">
                        {t('admin.subscriptionsList.table.headers.item')}
                    </TableHead>
                      <TableHead className="text-left">
                        {t('admin.subscriptionsList.table.headers.agency')}
                      </TableHead>
                      <TableHead className="text-left">
                        {t('admin.subscriptionsList.table.headers.validity')}
                      </TableHead>
                      <TableHead className="text-left">
                        {t('admin.subscriptionsList.table.headers.plan')}
                      </TableHead>
                      <TableHead className="text-left">
                        {t('admin.subscriptionsList.table.headers.price')}
                      </TableHead>
                      <TableHead className="text-left">
                        {t('admin.subscriptionsList.table.headers.duration')}
                      </TableHead>
                      <TableHead className="text-left">
                        {t('admin.subscriptionsList.table.headers.status')}
                      </TableHead>
                      <TableHead className="text-left">
                        {t('admin.subscriptionsList.table.headers.actions')}
                      </TableHead>

                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.length > 0 ? (filteredSubscriptions.map((sub, index) => (
                      <TableRow key={sub.id}>
                        <TableCell className="text-center" >{index+1}</TableCell>
                        <TableCell className="capitalize" >{sub.agency.name}</TableCell>
                        <TableCell className="" > {formattedDate(sub.startDate)} <span className="text-xs text-gray-600">→</span> {formattedDate(sub.endDate)}
                        </TableCell>
                        <TableCell className="capitalize" >{sub.plan.name}</TableCell>
                        <TableCell>
                          {sub.plan.price}
                        </TableCell>
                        <TableCell>
                          {sub.plan.durationInDays} {t('admin.subscriptionsList.table.body.days')}
                        </TableCell>
                        <TableCell>
                          {sub.isActive ? t('admin.subscriptionsList.table.body.active') : t('admin.subscriptionsList.table.body.inactive')}
                        </TableCell>
                        <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                              >
                              <span className="sr-only">{t('common.openMenu')}</span>
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
                              <DropdownMenuLabel>{t('common.actions')}</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => router.push(`/admin/subscriptions/show/${sub.id}`)}>
                                <Eye />  {t('admin.subscriptionsList.table.actions.view')}
                              </DropdownMenuItem>
                              {/*<PermissionGuard requiredPermission={permissions.subscription_update}>
                                <DropdownMenuItem onClick={() => router.push(`/admin/subscriptions/edit/${sub.id}`) } >
                                  <Pencil /> {t('admin.subscriptionsList.table.actions.edit')}
                                </DropdownMenuItem>
                              </PermissionGuard> No hay una funcionalidad clara a editar */}
                              <DropdownMenuSeparator />
                              <PermissionGuard requiredPermission={permissions.subscription_delete}>
                                <DropdownMenuItem onClick={(e) => {
                                      e.preventDefault();
                                      setOpen(true);
                                      setSelectedSubscription(sub);
                                    }}>
                                <Repeat color="red" /> 
                                  <span className="text-red-500" >{t('admin.subscriptionsList.table.actions.changeStatus')}</span>
                                </DropdownMenuItem>
                              </PermissionGuard>      
                          </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          {t('admin.subscriptionsList.table.body.noSubscriptions')}
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
                      <AlertDialogTitle>{t('admin.subscriptionsList.changeStatusDialog.title')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('admin.subscriptionsList.changeStatusDialog.description')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel >{t('common.cancel')}</AlertDialogCancel>
                      <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={() => handleDelete(selectedSubscription?.id)} >{t('common.continue')}</AlertDialogAction>
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

export default withAuth(SubscritionList, permissions.subscription_list);
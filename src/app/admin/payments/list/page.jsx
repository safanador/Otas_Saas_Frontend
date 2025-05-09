"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import AdminLayout from "../../components/SideBar/AdminLayout";
import PermissionGuard from "@/components/PermissionGuard";
import React, { useEffect, useState } from "react";
import withAuth from "@/app/middleware/withAuth";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import permissions from "@/lib/permissions";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const PaymentsList = () => {
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

  const [searchTerm, setSearchTerm] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

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
    const fetchPayments = async () => {
      try {
        const data = await fetchData(endpoints.payment_getAll());

        if (data.error) {
          return console.log(data.error);
        }

        setPayments(data);
      } catch (error) {
        console.log("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

   const filteredPayments = payments?.filter((payment) =>
    payment.subscription.agency.name.toLowerCase().includes(searchTerm.toLowerCase())
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

      const data = await fetchData(endpoints.payment_delete(id), {
        method: 'DELETE',
      });

      if (data.error) {
        return
      }

      toast({
        variant: "success",
        title: t('toast.success.title'),
        description: t('toast.success.paymentDeleted'),
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
          <CardTitle>{t('admin.paymentList.title')}</CardTitle>
          <CardDescription>{t('admin.paymentList.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container mx-auto py-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center gap-2">
                <Input 
                type="search" 
                placeholder={t('admin.paymentList.searchPlaceholder')}
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
                    <TableHead className="text-center">{t('admin.paymentList.table.headers.item')}</TableHead>
                      <TableHead className="text-left">{t('admin.paymentList.table.headers.agency')}</TableHead>
                      <TableHead className="text-left">{t('admin.paymentList.table.headers.plan')}</TableHead>
                      <TableHead className="text-left">{t('admin.paymentList.table.headers.payment')}</TableHead>
                      <TableHead className="text-left">{t('admin.paymentList.table.headers.status')}</TableHead>
                      <TableHead className="text-left">{t('admin.paymentList.table.headers.paymentMethod')}</TableHead>
                      <TableHead className="text-left">{t('admin.paymentList.table.headers.paymentId')}</TableHead>
                      <TableHead className="text-left">{t('admin.paymentList.table.headers.paymentDate')}</TableHead>
                      <TableHead className="text-left">{t('admin.paymentList.table.headers.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length > 0 ? (filteredPayments.map((payment, index) => (
                      <TableRow key={payment.id}>
                        <TableCell className="text-center" >{index+1}</TableCell>
                        <TableCell className="capitalize" >{payment.subscription.agency.name}</TableCell>
                        <TableCell className="capitalize" >{payment.subscription.plan.name}</TableCell>
                        <TableCell className="capitalize" >{payment.amount}</TableCell>
                        <TableCell className="capitalize" >{payment.status}</TableCell>
                        <TableCell className="capitalize" >{payment.paymentMethod}</TableCell>
                        <TableCell className="capitalize" >{payment.transactionId}</TableCell>
                        <TableCell className="capitalize" >{formattedDate(payment.createdAt)}</TableCell>
                        <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
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
                              <PermissionGuard requiredPermission={permissions.payment_update}>
                                <DropdownMenuItem onClick={() => router.push(`/admin/payments/edit/${payment.id}`) } >
                                  <Pencil /> {t('admin.paymentList.table.body.editPayment')}
                                </DropdownMenuItem>
                              </PermissionGuard>
                              
                              <DropdownMenuSeparator />
                              <PermissionGuard requiredPermission={permissions.payment_delete}>
                                <DropdownMenuItem onClick={(e) => {
                                      e.preventDefault();
                                      setOpen(true);
                                    }}>
                                <Trash2 color="red" /> 
                                  <span className="text-red-500" >{t('admin.paymentList.table.body.deletePayment')}</span>
                                </DropdownMenuItem>
                              </PermissionGuard>

                              {/** Delete confirmation */}
                              <AlertDialog open={open} onOpenChange={setOpen}>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>{t('admin.paymentList.table.deleteDialog.title')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {t('admin.paymentList.table.deleteDialog.description')}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel >{t('common.cancel')}</AlertDialogCancel>
                                    <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={() => handleDelete(payment.id)} >{t('common.continue')}</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              
                          </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          {t('admin.paymentList.table.body.noPayments')}
                        </TableCell>
                      </TableRow>
                  )
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

export default withAuth(PaymentsList, permissions.payment_list) ;

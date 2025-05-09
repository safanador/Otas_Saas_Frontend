"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "../../components/SideBar/AdminLayout";
import React, { useEffect, useState } from "react";
import withAuth from "@/app/middleware/withAuth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import permissions from "@/lib/permissions";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const PaymentCreate = () => {
  const { preferredLanguage } = useSelector((state) => state.auth.user);
  const { t, i18n } = useTranslation();
    
  useEffect(() => {
    if (preferredLanguage) {
       i18n.changeLanguage(preferredLanguage);
     }
  }, [preferredLanguage, i18n]);  
  
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    subscriptionId: null,
    amount: 0,
    paymentMethod: "",
    transactionId: "",
    status: ""
  });
  const [buttonLoading, setButtonLoading] = useState(false);
  const [errorData, setErrorData] = useState();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();


  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const data = await fetchData(endpoints.subscription_getAll());

        if (data.error) {
          return
        }
        
        setSubscriptions(data.filter((sub) => !sub.plan.isTrial));
      } catch (error) {
        console.log("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
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
    const handleCreate = async () => {
      try {
        setButtonLoading(true);
        setErrorData([])
        
        const data = await fetchData(endpoints.payment_create(), {
          method: 'POST',
          body: JSON.stringify(form),
        });

        if (data.error) {
          setErrorData(data.error);
          return
        }

        toast({
          variant: "success",
          title: t("toast.success.title"),
          description: t("toast.success.paymentCreated"),
        })
        setForm({
          subscriptionId: null,
          amount: 0,
          paymentMethod: "",
          transactionId: "",
          status: ""
        });

      } catch (error) {
        console.log("Error fetching subscriptions:", error);
        toast({
          variant: "destructive",
          title: t("toast.error.title"),
          description: t("toast.error.serverConnection"),
        })
      } finally{
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
          <CardTitle>{t("admin.paymentCreate.title")}</CardTitle>
          <CardDescription>
          {t("admin.paymentCreate.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">
            <div className="grid w-full max-w-lg items-center gap-1.5" >
              <Label htmlFor="user-type" >{t("admin.paymentCreate.fields.agency")}</Label>
              <Select
                value={form.subscriptionId}
                onValueChange={(value) => setForm({...form, subscriptionId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.paymentCreate.placeholders.agency")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("admin.paymentCreate.selectLabels.agency")}</SelectLabel>
                      {subscriptions.map((subscription) => (
                          <SelectItem key={subscription.id} value={subscription.id} >
                            {subscription.agency.name}
                          </SelectItem>
                        ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errorData && renderFieldErrors('subscriptionId',errorData)}
            </div>

            {/** price Done */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="name">{t("admin.paymentCreate.fields.amount")}</Label>
                <Input 
                  type="number" 
                  id="corporateEmail" 
                  placeholder={t("admin.paymentCreate.placeholders.amount")}
                  value={form.amount}
                  onChange={(e) => setForm({...form, amount: Number(e.target.value)})} 
                />
                {errorData && renderFieldErrors('amount',errorData)}
              </div>

              <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="name">{t("admin.paymentCreate.fields.paymentMethod")}</Label>
                <Input 
                  type="text" 
                  id="name" 
                  placeholder={t("admin.paymentCreate.placeholders.paymentMethod")}
                  value={form.paymentMethod}
                  onChange={(e) => setForm({...form, paymentMethod: e.target.value})} />
                  {errorData && renderFieldErrors('paymentMethod',errorData)}
              </div>

              <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="name">{t("admin.paymentCreate.fields.transactionId")}</Label>
                <Input 
                  type="text" 
                  id="name" 
                  placeholder={t("admin.paymentCreate.placeholders.transactionId")}
                  value={form.transactionId}
                  onChange={(e) => setForm({...form, transactionId: e.target.value})} />
                  {errorData && renderFieldErrors('transactionId',errorData)}
              </div>

              <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="name">{t("admin.paymentCreate.fields.status")}</Label>
                <Input 
                  type="text" 
                  id="name" 
                  placeholder={t("admin.paymentCreate.placeholders.status")}
                  value={form.status}
                  onChange={(e) => setForm({...form, status: e.target.value})} />
                  {errorData && renderFieldErrors('status',errorData)}
              </div>
          </div>
        </CardContent>
        <CardFooter className="w-full">
          <Button                 
            onClick={() => setOpen(true)}
            className="w-full md:w-auto" >
              { buttonLoading 
                ? (<span className="w-4 h-4 border-[1.5px] border-white border-t-transparent rounded-full animate-spin"></span>)
                : (<span>{t("common.save")}</span>) }
          </Button>

          <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("admin.paymentCreate.confirmation.title")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("admin.paymentCreate.confirmation.description")}
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

export default withAuth(PaymentCreate, permissions.payment_create) ;

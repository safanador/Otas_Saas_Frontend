"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../../components/SideBar/AdminLayout";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";


const PaymentEdit = () => {
  const { preferredLanguage } = useSelector((state) => state.auth.user);
  const { t, i18n } = useTranslation();
    
  useEffect(() => {
    if (preferredLanguage) {
       i18n.changeLanguage(preferredLanguage);
     }
  }, [preferredLanguage, i18n]);  

  const [buttonLoading, setButtonLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const { toast } = useToast();
  const { id } = useParams();

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
    const fetchPaymentAndSubscriptions = async () => {
      try {
        const responseSubscriptions = await fetchData(endpoints.subscription_getAll());

        if (responseSubscriptions.error) {
          return console.log(responseSubscriptions.error);
        }
        setSubscriptions(responseSubscriptions.filter((sub) => !sub.plan.isTrial));

        const responseForm = await fetchData(endpoints.payment_getOne(id));
        if (responseForm.error) {
          return console.log(responseForm.error);
        }
        const { amount , paymentMethod,transactionId, status, ...rest} = responseForm;
        setForm({
          subscriptionId: responseForm.subscription.id,
          amount: amount  ,
          paymentMethod: paymentMethod,
          transactionId: transactionId, 
          status: status,
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentAndSubscriptions();
    
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

    const handleEdit = async () => {
      try {
        setButtonLoading(true);
        setErrorData([])
        const {status, ...rest} = form;
        let updatedForm = {status: status};

        const data = await fetchData(endpoints.payment_update(id), {
          method: 'PUT',
          body: JSON.stringify(updatedForm),
        });

        if (data.error) {
          setErrorData(data.error);
          return
        }

        toast({
          variant: "success",
          title: t("toast.success.title"),
          description: t("toast.success.paymentEdited"),
        })

      } catch (error) {
        setButtonLoading(false);
        console.log(error);
        toast({
          variant: "destructive",
          title: t("toast.error.title"),
          description: t("toast.error.serverConnection"),
        })
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
          <CardTitle>{t("admin.paymentEdit.title")}</CardTitle>
          <CardDescription>{t("admin.paymentEdit.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">
            <div className="grid w-full max-w-lg items-center gap-1.5" >
              <Label htmlFor="user-type" >{t("admin.paymentEdit.fields.agency")}</Label>
              <Select
                value={form.subscriptionId}
                onValueChange={(value) => setForm({...form, subscriptionId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.paymentEdit.placeholders.agency")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("admin.paymentEdit.selectLabels.agency")}</SelectLabel>
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
                <Label htmlFor="name">{t("admin.paymentEdit.fields.amount")}</Label>
                <Input 
                  type="number" 
                  id="corporateEmail" 
                  placeholder={t("admin.paymentEdit.placeholders.amount")}
                  value={form.amount}
                  onChange={(e) => setForm({...form, amount: e.target.value})} 
                />
                {errorData && renderFieldErrors('amount',errorData)}
              </div>

              <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="name">{t("admin.paymentEdit.fields.paymentMethod")}</Label>
                <Input 
                  type="text" 
                  id="name" 
                  placeholder={t("admin.paymentEdit.placeholders.paymentMethod")}
                  value={form.transactionId}
                  onChange={(e) => setForm({...form, transactionId: e.target.value})} />
                  {errorData && renderFieldErrors('paymentMethod',errorData)}
              </div>

              <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="name">{t("admin.paymentEdit.fields.transactionId")}</Label>
                <Input 
                  type="text" 
                  id="name" 
                  placeholder={t("admin.paymentEdit.placeholders.transactionId")}
                  value={form.transactionId}
                  onChange={(e) => setForm({...form, transactionId: e.target.value})} />
                  {errorData && renderFieldErrors('transactionId',errorData)}
              </div>

              <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="name">{t("admin.paymentEdit.fields.status")}</Label>
                <Input 
                  type="text" 
                  id="name" 
                  placeholder={t("admin.paymentEdit.placeholders.status")}
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
                  <AlertDialogTitle>{t("admin.paymentEdit.confirmation.title")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("admin.paymentEdit.confirmation.description")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel >{t("common.cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleEdit} >{t("common.continue")}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default withAuth(PaymentEdit, permissions.payment_update) ;
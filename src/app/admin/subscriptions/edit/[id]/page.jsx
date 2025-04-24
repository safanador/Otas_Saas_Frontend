"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "../../../components/SideBar/AdminLayout";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useEffect, useState } from "react";
import withAuth from "@/app/middleware/withAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
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


const SubscriptionEdit = () => {

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

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [agencies, setAgencies] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { id } = useParams();
  const [buttonLoading, setButtonLoading] = useState(false);
  const foundPlan = form.planId ? plans.find(plan => plan.id === form.planId) : '';


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
    const fetchSubscriptions = async () => {
      try {
        const data = await fetchData(endpoints.subscription_getOne(id));
        if(data.error) {
          return console.log(data.error);
        }
        let updatedForm = {...data , agencyId: data.agency.id , planId: data.plan.id};
        const { agencyId, planId , ...rest} = updatedForm;
        updatedForm = { agencyId, planId};
        setForm(updatedForm);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } 
    };

    fetchSubscriptions();

    const fetchPlans = async () => {
      try {
        const data = await fetchData(endpoints.plan_getAll());
        if(data.error) {
          return console.log(data.error);
        }
        setPlans(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } 
    };

    fetchPlans();

    const fetchAgencies = async () => {
      try {
        const agencies = await fetchData(endpoints.agency_getAll());

        if(agencies.error) {
          return console.log(agencies.error);
        }
        setAgencies(agencies);
      } catch (error) {
        console.error("Error fetching agencies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
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
        
        const response = await fetchData(endpoints.subscription_update(id), {
          method: 'PUT',
          body: JSON.stringify(form),
        });

        if (response.error) {
          setErrorData(response.error)
          return          
        }

        toast({
          variant: "success",
          title: t("toast.success.title"),
          description: t("toast.success.subscriptionEdited"),
        })

      } catch (error) {
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
          <CardTitle>{t("admin.subscriptionEdit.title")}</CardTitle>
          <CardDescription>{t("admin.subscriptionEdit.description")}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="container space-y-4 mx-auto py-2">
              <div className="grid w-full max-w-lg items-center gap-1.5" >
                <Label htmlFor="user-type" >{t("admin.subscriptionEdit.fields.agency")}</Label>
                <Select
                  disabled
                  value={form.agencyId}
                  onValueChange={(value) => setForm({...form, agencyId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.subscriptionEdit.placeholders.agency")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("admin.subscriptionEdit.selectLabels.agency")}</SelectLabel>
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

              <div className="grid w-full max-w-lg items-center gap-1.5" >
                <Label htmlFor="user-type" >{t("admin.subscriptionEdit.fields.plan")}</Label>
                <Select
                  value={form.planId}
                  onValueChange={(value) => setForm({...form, planId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.subscriptionEdit.placeholders.plan")}/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("admin.subscriptionEdit.selectLabels.plan")}</SelectLabel>
                        {plans.map((plan) => (
                            <SelectItem key={plan.id} value={plan.id} >
                              {plan.name}
                            </SelectItem>
                          ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errorData && renderFieldErrors('planId',errorData)}
              </div>

              { form.planId && (
                <div className="container space-y-4 mx-auto py-2">
                  <div className="grid w-full max-w-lg items-center gap-1.5">
                    <Label htmlFor="name">{t("admin.subscriptionEdit.fields.description")}</Label>
                    <Input 
                      disabled
                      type="text" 
                      id="email" 
                      value={foundPlan.description}/>
                  </div>

                    {/** price Done */}
                  <div className="grid w-full max-w-lg items-center gap-1.5">
                    <Label htmlFor="name">{t("admin.subscriptionEdit.fields.price")}</Label>
                    <Input 
                      disabled
                      type="text" 
                      id="corporateEmail" 
                      value={foundPlan.price}/>
                  </div>

                    {/** Duration in Days Done*/}
                  <div className="grid w-full max-w-lg items-center gap-1.5">
                    <Label htmlFor="name">{t("admin.subscriptionEdit.fields.duration")}</Label>
                    <Input 
                      disabled
                      type="text" 
                      id="address" 
                      value={foundPlan.durationInDays}
                      onChange={(e) => setForm({...form, durationInDays: e.target.value})} />
                  </div>

                  {/** Trial in Days Done*/}
                  <div className="flex items-center w-full max-w-lg justify-between gap-1.5">
                    <Label htmlFor="name">{t("admin.subscriptionEdit.fields.trial")}</Label>
                    <Checkbox disabled checked={foundPlan.isTrial}  />
                  </div>
                </div>
              )}
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
                  <AlertDialogTitle>{t("admin.subscriptionEdit.confirmation.title")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("admin.subscriptionEdit.confirmation.description")}
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

export default withAuth(SubscriptionEdit, permissions.subscription_update);
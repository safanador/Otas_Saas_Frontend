"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

const SubscriptionShow = () => {

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
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const foundPlan = form.planId ? plans.find(plan => plan.id === form.planId) : '';
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
    const fetchSubscriptions = async () => {
      try {
        const data = await fetchData(endpoints.subscription_getOne(id));
        if(data.error) {
          console.error("Error fetching subscription:", data.error);
          return;
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
        const response = await fetchData(endpoints.plan_getAll());
        if(response.error) {
          return console.log(response.error);
        }
        setPlans(response);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } 
    };

    fetchPlans();

    const fetchAgencies = async () => {
      try {
        const agencies = await fetchData(endpoints.agency_getAll());
        if(agencies.error) {
          return console.log(data.error);
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

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.subscriptionShow.title")}</CardTitle>
          <CardDescription>{t("admin.subscriptionShow.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">
              <div className="grid w-full max-w-lg items-center gap-1.5" >
                <Label htmlFor="user-type" >{t("admin.subscriptionShow.fields.agency")}</Label>
                <Select
                  disabled
                  value={form.agencyId}
                  onValueChange={(value) => setForm({...form, agencyId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.subscriptionShow.placeholders.agency")}/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("admin.subscriptionShow.selectLabels.agency")}</SelectLabel>
                        {agencies.map((agency) => (
                            <SelectItem key={agency.id} value={agency.id} >
                              {agency.name}
                            </SelectItem>
                          ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {/*{errorData && renderFieldErrors('agencyId',errorData)} */}
              </div>

              <div className="grid w-full max-w-lg items-center gap-1.5" >
                <Label htmlFor="user-type" >{t("admin.subscriptionShow.fields.plan")}</Label>
                <Select
                  disabled
                  value={form.planId}
                  onValueChange={(value) => setForm({...form, planId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.subscriptionShow.placeholders.plan")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("admin.subscriptionShow.selectLabels.plan")}</SelectLabel>
                        {plans.map((plan) => (
                            <SelectItem key={plan.id} value={plan.id} >
                              {plan.name}
                            </SelectItem>
                          ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {/*{errorData && renderFieldErrors('planId',errorData)} */}
              </div>

              { form.planId && (
                <div className="container space-y-4 mx-auto py-2">
                  <div className="grid w-full max-w-lg items-center gap-1.5">
                    <Label htmlFor="name">{t("admin.subscriptionShow.fields.description")}</Label>
                    <Input 
                      disabled
                      type="text" 
                      id="email" 
                      value={foundPlan.description}/>
                  </div>

                    {/** price Done */}
                  <div className="grid w-full max-w-lg items-center gap-1.5">
                    <Label htmlFor="name">{t("admin.subscriptionShow.fields.price")}</Label>
                    <Input 
                      disabled
                      type="text" 
                      id="corporateEmail" 
                      value={foundPlan.price}/>
                  </div>

                    {/** Duration in Days Done*/}
                  <div className="grid w-full max-w-lg items-center gap-1.5">
                    <Label htmlFor="name">{t("admin.subscriptionShow.fields.duration")}</Label>
                    <Input 
                      disabled
                      type="text" 
                      id="address" 
                      value={foundPlan.durationInDays}
                      onChange={(e) => setForm({...form, durationInDays: e.target.value})} />
                  </div>

                  {/** Trial in Days Done*/}
                  <div className="flex items-center w-full max-w-lg justify-between gap-1.5">
                    <Label htmlFor="name">{t("admin.subscriptionShow.fields.trial")}</Label>
                    <Checkbox disabled checked={foundPlan.isTrial}  />
                  </div>
                </div>
              )}
            </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default withAuth(SubscriptionShow, permissions.subscription_show);
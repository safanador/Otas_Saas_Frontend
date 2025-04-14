"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../components/SideBar/AdminLayout";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Eye, Globe, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { Countries } from "../../components/CountryStateCity/Country";
import { City, Country, State } from "country-state-city";
import { States } from "../../components/CountryStateCity/State";
import { Cities } from "../../components/CountryStateCity/Cities";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";
import PermissionGuard from "@/components/PermissionGuard";
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const AgenciesList = () => {
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

  const [agencies, setAgencies] = useState([]);
  const [agencyId, setAgencyId] = useState();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openT, setOpenT] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState();
  

  const countries = Country.getAllCountries();
  const states = (country) => {
    return State.getStatesOfCountry(country);
  } 
  const cities = (country, state) => {
    return City.getCitiesOfState(country, state);
  } 

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const agencies = await fetchData(endpoints.agency_getAll());
        
        if (agencies.error) {
          return console.log(agencies.error);
        }
        setAgencies(agencies);
      } catch (error) {
        console.error(t('errors.fetchingAgencies'), error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [t]);

  const filteredAgencies = agencies?.filter((agency) =>
    agency.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleDeleteAgency = async (id) => {
    try {
      const data = await fetchData(endpoints.agency_delete(id), {
        method: 'DELETE',
      });

      if (data.error) {
        toast({
          variant: "destructive",
          title: t('toast.error.title'),
          description: t('toast.error.tryLater'),
        })
        return
      }

      toast({
        variant: "success",
        title: t('toast.success.title'),
        description: t('toast.success.agencyDeleted'),
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

  const handleToggleAgencyState = async (id) => {
    try {
      const response = await fetchData(endpoints.agency_toogleStatus(id), {
        method: 'PATCH',
      });

      if (response.error) {
        toast({
          variant: "destructive",
          title: t('toast.error.title'),
          description: t('toast.error.tryLater'),
        })
        return
      }

      toast({
        variant: "success",
        title: t('toast.success.title'),
        description: t('toast.success.agencyStatusChanged'),
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
          <CardTitle>{t('agencies.list.title')}</CardTitle>
          <CardDescription>{t('agencies.list.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container mx-auto py-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div></div>
              <div className="flex items-center gap-2">
                <Input 
                  type="search" 
                  placeholder={t('common.searchName')}
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64" 
                />
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <div className="overflow-x-auto bg-white rounded-lg shadow dark:bg-gray-800">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">{t('common.item')}</TableHead>
                      <TableHead className="text-left">{t('agencies.fields.name')}</TableHead>
                      <TableHead className="text-left">{t('agencies.fields.email')}</TableHead>
                      <TableHead className="text-left">{t('agencies.fields.phone')}</TableHead>
                      <TableHead className="text-left">{t('agencies.fields.address')}</TableHead>
                      <TableHead className="text-left">{t('agencies.fields.city')}</TableHead>
                      <TableHead className="text-left">{t('agencies.fields.state')}</TableHead>
                      <TableHead className="text-left">{t('agencies.fields.country')}</TableHead>
                      <TableHead className="text-left">{t('agencies.fields.web')}</TableHead>
                      <TableHead className="text-left">{t('agencies.fields.status')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAgencies.length > 0 ? (filteredAgencies.map((agency, index) => (
                      <TableRow key={agency.id}>
                        <TableCell className="text-center" >{index+1}</TableCell>
                        <TableCell className="capitalize" >{agency.name}</TableCell>
                        <TableCell className="capitalize" >{agency.email}</TableCell>
                        <TableCell className="capitalize" >{agency.phone}</TableCell>
                        <TableCell className="capitalize" >{agency.address}</TableCell>

                        <TableCell className="capitalize" >
                          {agency.country && agency.state && agency.city && (<div className="grid w-full max-w-lg items-center gap-1.5">
                            <Cities
                              disabled={true}
                              cities={cities(agency.country, agency.state)} 
                              selectedCity={agency.city} 
                              />
                          </div>)}
                        </TableCell>
                        <TableCell className="capitalize" >
                          { agency.country && agency.state && (<div className="grid w-full max-w-lg items-center gap-1.5">
                            <States 
                              disabled={true}
                              states={states(agency.country)} 
                              selectedState={agency.state} 
                              />
                          </div>)}
                        </TableCell>
                        <TableCell className="capitalize" >
                          {agency.country && (<div className="grid w-full max-w-lg items-center gap-1.5">
                          <Countries 
                            disabled={true}
                            countries={countries} 
                            selectedCountry={agency.country}
                            />
                        </div>)}
                        </TableCell>
                        <TableCell className="capitalize" >{ agency.url && (<Link target="_blank" href={agency.url}><Globe/></Link>)}</TableCell>
                        <TableCell className="capitalize" >
                          <Switch checked={agency.isActive} onCheckedChange={() => {setOpenT(true); setSelectedAgency(agency);} } />
                        </TableCell>
                        <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">{t('common.openMenu')}</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuLabel>{t('common.actions')}</DropdownMenuLabel>
                              <PermissionGuard requiredPermission={permissions.agency_show}>
                                <DropdownMenuItem onClick={() => router.push(`/admin/agency/show/${agency.id}`)}>
                                  <Eye /> {t('agencies.actions.view')}
                                </DropdownMenuItem>
                              </PermissionGuard>
                              <PermissionGuard requiredPermission={permissions.agency_update}>
                                <DropdownMenuItem onClick={() => router.push(`/admin/agency/edit/${agency.id}`) } >
                                  <Pencil/> {t('agencies.actions.edit')}
                                </DropdownMenuItem>
                              </PermissionGuard>
                              <DropdownMenuSeparator />
                              <PermissionGuard requiredPermission={permissions.agency_delete}>
                                <DropdownMenuItem onClick={(e) => {
                                      e.preventDefault();
                                      setOpen(true);
                                      setSelectedAgency(agency);
                                    }}>
                                  <Trash2 color="red" />
                                  <span className="text-red-500" >{t('agencies.actions.delete')}</span>
                                </DropdownMenuItem>
                              </PermissionGuard>
                          </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center">
                          {t('agencies.list.noAgenciesFound')}
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
                      <AlertDialogTitle>{t('agencies.delete.confirmTitle')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('agencies.delete.confirmDescription')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                      <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={() => handleDeleteAgency(selectedAgency.id)}>{t('common.continue')}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/** Toggle Agency state confirmation */}
                <AlertDialog open={openT} onOpenChange={setOpenT}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('agencies.toggleState.confirmTitle')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {selectedAgency?.isActive 
                          ? t('agencies.toggleState.deactivateDescription')
                          : t('agencies.toggleState.activateDescription')
                        }
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                      <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={() => handleToggleAgencyState(selectedAgency.id)}>{t('common.continue')}</AlertDialogAction>
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

export default withAuth(AgenciesList, permissions.agency_list);
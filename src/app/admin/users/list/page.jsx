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
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";
import endpoints from "@/lib/endpoints";
import { fetchData } from "@/services/api";
import PermissionGuard from "@/components/PermissionGuard";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { States } from "../../components/CountryStateCity/State";
import { City, Country, State } from "country-state-city";
import { Cities } from "../../components/CountryStateCity/Cities";
import { Countries } from "../../components/CountryStateCity/Country";

const UsersList = () => {
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

  const [users, setUsers] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [agencyId, setAgencyId] = useState();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openT, setOpenT] = useState(false);
  const [selectedUser, setSelectedUser] = useState();

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
        const url = agencyId 
        ? endpoints.user_getAllByAgency(agencyId)
        : endpoints.user_getAll();
        console.log("URL:", url);
        const data = await fetchData(url);

        if (data.error) {
          return console.log(data.error);
        }
        console.log("Data:", data);
        setUsers(data);

        // fetch agencies
        const agenciesData = await fetchData(endpoints.agency_getAll());

        if (agenciesData.error) {
          return console.log(agenciesData.error);
        }
        console.log("Agencies Data:", agenciesData);
        setAgencies(agenciesData);
      } catch (error) {
        console.log("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [agencyId]);

   // Filtrar roles en función del término de búsqueda
   const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
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
// eliminacion de usuario
  const handleDeleteUser = async (id) => {
    try {
      const data = await fetchData(endpoints.user_delete(id), {
        method: 'DELETE',
      });

      if (data.error) {
        console.log(data.error)
        return
      }

      toast({
        variant: "success",
        title: t("toast.success.title"),
        description: t("toast.success.userDeleted"),
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

  // toggle user state
  const handleToggleUserState = async (userId) => {
    try {
      const data = await fetchData(endpoints.user_toogleStatus(userId), {
        method: 'PATCH',
      });

      if (data.error) {
        console.log(data.error);
        return
      }

      toast({
        variant: "success",
        title: t("toast.success.title"),
        description: t("toast.success.userStatus"),
      })
      setTimeout(() => {
        window.location.reload(); // Recargar la página actual
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
          <CardTitle>{t("admin.usersList.title")}</CardTitle>
          <CardDescription>{t("admin.usersList.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container mx-auto py-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center gap-2">
                <Input 
                  type="search" 
                  placeholder={t('common.searchName')}
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el estado al escribir
                  className="w-full md:w-64" 
                />
                <Select
                  value={agencyId}
                  onValueChange={(value) => setAgencyId(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.usersList.filters.selectAgency")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("admin.usersList.filters.selectLabel")}</SelectLabel>
                      <SelectItem  value={null} >
                        {t("admin.usersList.filters.allAgencies")}
                        </SelectItem>
                      {agencies.map((agency) => (
                        <SelectItem key={agency.id} value={agency.id} >
                          {agency.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <div className="overflow-x-auto bg-white rounded-lg shadow dark:bg-gray-800">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">{t("admin.usersList.fields.item")}</TableHead>
                      <TableHead className="text-left">{t("admin.usersList.fields.name")}</TableHead>
                      <TableHead className="text-left">{t("admin.usersList.fields.role")}</TableHead>
                      <TableHead className="text-left">{t("admin.usersList.fields.roleType")}</TableHead>
                      <TableHead className="text-left">{t("admin.usersList.fields.AssociatedAgency")}</TableHead>
                      <TableHead className="text-left">{t("admin.usersList.fields.city")}</TableHead>
                      <TableHead className="text-left">{t("admin.usersList.fields.state")}</TableHead>
                      <TableHead className="text-left">{t("admin.usersList.fields.country")}</TableHead>
                      <TableHead className="text-left">{t("admin.usersList.fields.status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (filteredUsers.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell className="text-center" >{index+1}</TableCell>
                        <TableCell className="capitalize" >{user.name}</TableCell>
                        <TableCell className="capitalize" >{user.role.name}</TableCell>
                        <TableCell className="capitalize" >{user.role.scope === 'agency' ? `Agencias` : "Empresa desarrolladora"}</TableCell>
                        <TableCell className="capitalize" >{user.agency?.name}</TableCell>
                        <TableCell className="capitalize" >
                          {
                            user.country && user.state && user.city && 
                              (<div className="grid w-full max-w-lg items-center gap-1.5">
                                  <Cities
                                    disabled={true}
                                    isList={true}
                                    cities={cities(user.country, user.state)} 
                                    selectedCity={user.city} 
                                  />
                                </div>)
                          }
                        </TableCell>
                        <TableCell>
                          { user.country && user.state && 
                            (<div className="grid w-full max-w-lg items-center gap-1.5">
                                <States 
                                  disabled={true}
                                  isList={true}
                                  states={states(user.country)} 
                                  selectedState={user.state} 
                                />
                            </div>)
                          }
                        </TableCell>
                        <TableCell>
                          {
                            user.country && 
                              (<div className="grid w-full max-w-lg items-center gap-1.5">
                                  <Countries
                                    isList={true}
                                    disabled={true}
                                    countries={countries} 
                                    selectedCountry={user.country}
                                  />
                                </div>)
                          }
                        </TableCell>
                        <TableCell className="capitalize" >
                          <Switch checked={user.isActive} onCheckedChange={() => {
                            setOpenT(true);
                            setSelectedUser(user);
                            }} />
                        </TableCell>
                        <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuLabel>{t('common.actions')}</DropdownMenuLabel>
                              <PermissionGuard requiredPermission={permissions.user_show}>
                                <DropdownMenuItem onClick={() => router.push(`/admin/users/show/${user.id}`)}>
                                  <Eye /> {t("admin.usersList.actions.view")}
                                </DropdownMenuItem>
                              </PermissionGuard>
                              <PermissionGuard requiredPermission={permissions.user_update}>
                                <DropdownMenuItem onClick={() => router.push(`/admin/users/edit/${user.id}`) } >
                                  <Pencil/> {t("admin.usersList.actions.edit")}
                                </DropdownMenuItem>
                              </PermissionGuard>
                              <DropdownMenuSeparator />
                              <PermissionGuard requiredPermission={permissions.user_delete}>
                                <DropdownMenuItem onClick={(e) => {
                                      e.preventDefault(); // Evita que el menú se cierre automáticamente
                                      setOpen(true);
                                      setSelectedUser(user);
                                    }}>
                                  <Trash2 color="red" />
                                  <span className="text-red-500" >{t("admin.usersList.actions.delete")}</span>
                                </DropdownMenuItem>
                              </PermissionGuard>
                          </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center">
                          {t("admin.usersList.noUsersFound")}
                        </TableCell>
                      </TableRow>
                  )
                    }
                  </TableBody>
                </Table>
                {/** Toggle user state confirmation */}
                <AlertDialog open={openT} onOpenChange={setOpenT}>
                  <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>                          
                        {t("admin.usersList.toggleState.confirmTitle")}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {
                          selectedUser?.isActive 
                          ? t("admin.usersList.toggleState.deactivateDescription") 
                          : t("admin.usersList.toggleState.activateDescription")
                        }
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel >{t("common.cancel")}
                      </AlertDialogCancel>
                      <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={() => handleToggleUserState(selectedUser?.id)} >{t("common.continue")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/** Delete confirmation */}
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                              {t("admin.usersList.delete.confirmTitle")}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {t("admin.usersList.delete.confirmDescription")}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel >{t("common.cancel")}</AlertDialogCancel>
                          <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={() => handleDeleteUser(selectedUser?.id)} >{t("common.continue")}</AlertDialogAction>
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

export default withAuth(UsersList, permissions.user_list);
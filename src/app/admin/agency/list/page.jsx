"use client";

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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Countries } from "../../components/CountryStateCity/Country";
import { City, Country, State } from "country-state-city";
import { States } from "../../components/CountryStateCity/State";
import { Cities } from "../../components/CountryStateCity/Cities";

const AgenciesList = () => {
  const [agencies, setAgencies] = useState([]);
  const [agencyId, setAgencyId] = useState();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openT, setOpenT] = useState(false);


  const countries = Country.getAllCountries(); // it's an Array
  const states =  (country) => {
    return State.getStatesOfCountry(country);
  } 
  const cities = (country, state) => {
    return City.getCitiesOfState(country, state);
  } 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch agencies
        const agenciesData = await fetch("http://localhost:3000/api/v1/agencies", {
          credentials: 'include'
        });
        if (agenciesData.status === 401) {
          window.location.href = '/auth/login';
        }
        if (agenciesData.status === 403) {
          window.location.href = '/admin/unauthorized';
        }
        const agencies = await agenciesData.json();
        setAgencies(agencies);
      } catch (error) {
        console.error("Error fetching Agencies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

   // Filtrar roles en función del término de búsqueda
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
// eliminacion de usuario
  const handleDeleteAgency = async (id) => {
    try {
      
      const response = await fetch(`http://localhost:3000/api/v1/agencies/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          variant: "success",
          title: "Realizado!",
          description: "Agencia eliminada exitosamente.",
        })
        setTimeout(() => {
          window.location.reload(); // Recargar la página actual
        }, 1000);
      }else{
        console.log(response)
        toast({
          variant: "destructive",
          title: "Uh oh! Parece que algo salió mal.",
          description: "Por favor, intenta más tarde.",
        })
      }
      
    } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Parece que algo salió mal.",
          description: "No se pudo conectar con el servidor. Por favor, intenta más tarde.",
        })
    }
  };

  // toggle Agency state
  const handleToggleAgencyState = async (id) => {
    try {
      
      const response = await fetch(`http://localhost:3000/api/v1/agencies/${id}/toggle-state`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          variant: "success",
          title: "Realizado!",
          description: "El estatus de la agencia ha sido cambiado exitosamente.",
        })
        setTimeout(() => {
          window.location.reload(); // Recargar la página actual
        }, 1000);
      }else{
        console.log(response)
        toast({
          variant: "destructive",
          title: "Uh oh! Parece que algo salió mal.",
          description: "Por favor, intenta más tarde.",
        })
      }
      
    } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Parece que algo salió mal.",
          description: "No se pudo conectar con el servidor. Por favor, intenta más tarde.",
        })
    }
  };

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Agencias</CardTitle>
          <CardDescription>A continuación se presenta una lista con aspectos generales de las agencias.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container mx-auto py-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Lista de agencias</h1>
              <div className="flex items-center gap-2">
                <Input 
                type="search" 
                placeholder="Buscar nombre..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el estado al escribir
                className="w-full md:w-64" />
                <Select
                  value={agencyId}
                  onValueChange={(value) => setAgencyId(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una agencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Agencias</SelectLabel>
                      <SelectItem  value={null} >
                          Todas
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
                      <TableHead className="text-center">Item</TableHead>
                      <TableHead className="text-left">Nombre</TableHead>
                      <TableHead className="text-left">Correo</TableHead>
                      <TableHead className="text-left">Teléfono</TableHead>
                      <TableHead className="text-left">Dirección</TableHead>
                      <TableHead className="text-left">Ciudad</TableHead>
                      <TableHead className="text-left">Estado</TableHead>
                      <TableHead className="text-left">País</TableHead>
                      <TableHead className="text-left">Web</TableHead>
                      <TableHead className="text-left">Estatus</TableHead>
                      <TableHead className="text-left">Creación</TableHead>
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
                          <Switch checked={agency.isActive} onCheckedChange={() => setOpenT(true) } />
                            {/** Toggle Agency state confirmation */}
                              <AlertDialog open={openT} onOpenChange={setOpenT}>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Estás seguro de cambiar el estado de esta agencia?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción {agency.isActive ? 'desactivará' : 'activará' } la agencia en la base de datos, sus usuarios {agency.isActive ? 'no podrán' : 'podrán' } utilizar sus credenciales y utilizar la plataforma.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel >Cancelar</AlertDialogCancel>
                                    <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={() => handleToggleAgencyState(agency.id)} >Continuar</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                        </TableCell>
                        <TableCell>{new Date(agency.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => router.push(`/admin/agency/show/${agency.id}`)}>
                              <Eye /> Ver Agencia
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/admin/agency/edit/${agency.id}`) } >
                               <Pencil/> Editar Agencia
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={(e) => {
                                    e.preventDefault(); // Evita que el menú se cierre automáticamente
                                    setOpen(true);
                                  }}>
                                <Trash2 color="red" />
                                <span className="text-red-500" >Eliminar Agencia</span>
                              </DropdownMenuItem>
                              {/** Delete confirmation */}

                              <AlertDialog open={open} onOpenChange={setOpen}>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Estás seguro de eliminar esta agencia?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción no se puede deshacer. La agencia será permanentemente eliminada de la base de datos, por favor verifique esta acción antes de realizarla.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel >Cancelar</AlertDialogCancel>
                                    <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={() => handleDeleteAgency(agency.id)} >Continuar</AlertDialogAction>
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
                        <TableCell colSpan={12} className="text-center">
                          No se encontraron agencias.
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

export default AgenciesList;

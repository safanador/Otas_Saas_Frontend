"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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


const RolesShow = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const { id } = useParams();

   // Renderiza un estado de carga mientras `id` no esté disponible
   if (!id) {
    return (
    <AdminLayout>
      <p>Cargando...</p>
    </AdminLayout>
    );
  }

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        //permisos de la tabla de permisos
        const response = await fetch("http://localhost:3000/api/v1/permissions/");
        const data = await response.json();
        setPermissions(data);

        //role desde base de datos
        const responseForm = await fetch(`http://localhost:3000/api/v1/roles/${id}`, {
          credentials: 'include'
        });
        const dataForm = await responseForm.json();

        //modificar los permisos del form
        const formattedPermissions = dataForm.permissions.map((p)=> data.find((pDb) => pDb.description === p.description)?.description);

        // Actualizar el formulario con permisos formateados
      setForm({
        ...dataForm,
        permissions: formattedPermissions,
      });
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
    
  }, [id]);

  if (loading) {
    return (
        <AdminLayout>
            <div className="flex items-center justify-center h-full">
                <p className="text-center">Cargando...</p>
            </div>
        </AdminLayout>
    );
  }

  // tabla de permisos
  const entities = [
    { spanish: 'Dashboard', english: 'dashboard' },
    { spanish: 'Rol', english: 'role' },
    { spanish: 'Usuario', english: 'user' },
    { spanish: 'Agencia', english: 'agency' },
    { spanish: 'Planes', english: 'plan' },
    { spanish: 'Suscripciones', english: 'subscription' },
    { spanish: 'Pagos', english: 'payment' },
    { spanish: 'Logs', english: 'log' },
  ];

  const getPermission = (action, entity) => {
    const permissionString = `${action} ${entity}`;
    return permissions.find((p) => p.description === permissionString);
  };

  const handleCheckboxChange = (permission) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((perm) => perm !== permission)
        : [...prev.permissions, permission],
    }));
  };

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Detalles del Rol</CardTitle>
          <CardDescription>A continuación disponible toda la información relacionada al rol.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-2">
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Rol</h1>
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="name">Nombre del rol</Label>
            <Input 
              disabled
              type="text" 
              id="name" 
              placeholder="Nombre..." 
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})} />
          </div>

            <div className="grid w-full max-w-lg items-center gap-1.5" >
              <Label htmlFor="user-type" >Tipo de usuario</Label>
              <Select
                disabled
                value={form.scope}
                onValueChange={(value) => setForm({...form, scope: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de usuario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipos</SelectLabel>
                    <SelectItem value="agency">Agencia</SelectItem>
                    <SelectItem value="global">Empresa desarrolladora</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            { form.scope === 'agency' && (
              <div className="grid w-full max-w-lg items-center gap-1.5" >
                <Label htmlFor="user-type" >Agencia asociada</Label>
                <Select
                  disabled
                  value={form.agency.id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una agencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Agencias</SelectLabel>
                        <SelectItem key={form.agency.id} value={form.agency.id} >
                          {form.agency.name}
                        </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid w-full max-w-lg items-center gap-1.5" >
            <Label htmlFor="permissions" >Selecciona permisos</Label>
            <div className="overflow-x-auto bg-white rounded-lg shadow dark:bg-gray-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Entidades</TableHead>
                    <TableHead className="text-center">Ver</TableHead>
                    <TableHead className="text-center">Listar</TableHead>
                    <TableHead className="text-center">Crear</TableHead>
                    <TableHead className="text-center">Actualizar</TableHead>
                    <TableHead className="text-center">Borrar</TableHead>
                    <TableHead className="text-center">Desactivar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entities.map((entity, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center" >{entity.spanish}</TableCell>
                      {["show", "list", "create", "update", "delete", "activate"].map(
                        (action,index) => (
                            <td key={index} className="border p-2 text-center">
                            {getPermission(action, entity.english) && (
                                <Checkbox
                                disabled
                                id={`permission-${action}-${index}`}
                                checked={form.permissions.includes(
                                    `${action} ${entity.english}`
                                )}
                                onCheckedChange={() =>
                                    handleCheckboxChange(
                                    `${action} ${entity.english}`
                                    )
                                }
                                />
                            )}
                            </td>
                        )
                        )}
                    </TableRow>
                  ))
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

export default withAuth(RolesShow, permissions.role_show);
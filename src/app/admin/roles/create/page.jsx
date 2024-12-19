"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import AdminLayout from "../../components/SideBar/AdminLayout";

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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";


const RolesCreate = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({name: "", type: "", permissionIds: []});
  const { toast } = useToast();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/permissions/");
        const data = await response.json();
        setPermissions(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

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
    { spanish: 'Rol', english: 'role' },
    { spanish: 'Usuario', english: 'user' },
  ];


  const getPermission = (action, entity) => {
    const permissionString = `${action} ${entity}`;
    return permissions.find((p) => p.description === permissionString);
  };

  const handleCheckboxChange = (permission) => {
    setForm((prev) => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permission)
        ? prev.permissionIds.filter((perm) => perm !== permission)
        : [...prev.permissionIds, permission],
    }));
  };

    const handleCreateRole = async () => {
      try {

        const formattedPermissions = form.permissionIds.map((p)=> permissions.find((pDb) => pDb.description === p)?.id).filter((id) => id !== undefined)
        console.log(formattedPermissions);
        
        // Sobrescribir directamente los permisos en una copia del estado
        const updatedForm = { ...form, permissionIds: formattedPermissions };

        console.log("Formulario actualizado:", updatedForm);
        const response = await fetch("http://localhost:3000/api/v1/roles", {
          method: 'post',
          headers: {
            'Content-Type': 'application/json', // Corrección
          },
          body: JSON.stringify(updatedForm),
        });

        if (response.ok) {
          toast({
            title: "Realizado!",
            description: "Rol creado exitosamente.",
          })
        }else{
          console.log(response)
          toast({
            title: "Uh oh! Parece que algo salió mal.",
            description: "Por favor, intenta más tarde.",
          })
        }
        
      } catch (error) {
          console.error('Error en la solicitud:', error);
          toast({
            title: "Uh oh! Parece que algo salió mal.",
            description: "Por favor, intenta más tarde.",
          })
      }
    };

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Creación de rol</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="container space-y-4 mx-auto py-8">
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Rol</h1>
          <div className="grid w-full max-w-lg items-center gap-1.5">
            <Label htmlFor="name">Nombre del rol</Label>
            <Input 
              type="text" 
              id="name" 
              placeholder="Nombre..." 
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})} />
          </div>

            <div className="grid w-full max-w-lg items-center gap-1.5" >
              <Label htmlFor="user-type" >Tipo de usuario</Label>
              <Select
                value={form.type}
                onValueChange={(value) => setForm({...form, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de usuario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipos</SelectLabel>
                    <SelectItem value="ota">OTA's</SelectItem>
                    <SelectItem value="system">Software</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
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
                                id={`permission-${action}-${index}`}
                                checked={form.permissionIds.includes(
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
        <CardFooter className="w-full">
          <Button                 
            onClick={handleCreateRole}
            className="w-full md:w-[100px]" >Crear Rol</Button>
        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default RolesCreate;

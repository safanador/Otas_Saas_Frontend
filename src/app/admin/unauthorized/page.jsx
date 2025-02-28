"use client"
import AdminLayout from "../components/SideBar/AdminLayout"
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Button } from "@/components/ui/button"
  import { useRouter } from 'next/navigation'


export default function UnauthorizedPage() {
    const router = useRouter();
  return (
    <AdminLayout>
        <Card>
            <CardHeader>
                <CardTitle>
                    <h1 className="text-xl font-semibold">Acceso Denegado
                    </h1>
                </CardTitle>
                <CardDescription>
                    <p>El acceso a esta acción ha sido denegado</p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>
                    No tienes los permisos requeridos para realizar esta operación.
                    Si crees que esto es un error, contacta al administrador.
                    </p>            
            </CardContent>
            <CardFooter>
                
            </CardFooter>
        </Card>
    </AdminLayout>
)
}

"use client"
import { useSelector } from "react-redux";
import AdminLayout from "../components/SideBar/AdminLayout";

export default function Dashboard() {
    const user = JSON.parse(sessionStorage.getItem("user"));

      console.log(user);
    return(
        <AdminLayout>
            <p>Saludos desde el dashboard</p>
            <p>{user ? `Usuario: ${user.name}` : "No hay usuario autenticado"}</p>
        </AdminLayout>
    )
}
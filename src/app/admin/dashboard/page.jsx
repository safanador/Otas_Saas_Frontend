"use client"
import { useSelector } from "react-redux";
import AdminLayout from "../components/SideBar/AdminLayout";

export default function Dashboard() {

    return(
        <AdminLayout>
            <p>Saludos desde el dashboard</p>
        </AdminLayout>
    )
}
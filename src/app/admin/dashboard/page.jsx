"use client"
import { useSelector, useDispatch } from "react-redux";
import AdminLayout from "../components/SideBar/AdminLayout";

export default function Dashboard() {
    const user = useSelector((state) => state.auth.user);
    console.log(user);

    return(
        <AdminLayout>
            <p>{user?.name}</p>
            <p>Saludos desde el dashboard</p>
        </AdminLayout>
    )
}
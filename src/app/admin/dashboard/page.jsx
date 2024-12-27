"use client"
import { useSelector } from "react-redux";
import AdminLayout from "../components/SideBar/AdminLayout";

export default function Dashboard() {
    const state = useSelector((state) => state.auth.value)
      console.log(state);
    return(
        <AdminLayout>
            <p>
                Saludos desde el dashboard
            </p>
            <p>
                {state}
            </p>
        </AdminLayout>
    )
}
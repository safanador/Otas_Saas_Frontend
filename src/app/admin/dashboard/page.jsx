"use client"
import { useSelector, useDispatch } from "react-redux";
import AdminLayout from "../components/SideBar/AdminLayout";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";

const Dashboard = () => {
    const user = useSelector((state) => state.auth.user);
    console.log(user);

    return(
        <AdminLayout>
            <p>{user?.name}</p>
            <p>Saludos desde el dashboard</p>
        </AdminLayout>
    )
}

export default withAuth( Dashboard, permissions.dashboard_show);
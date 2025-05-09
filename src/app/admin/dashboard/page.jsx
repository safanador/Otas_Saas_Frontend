"use client"
import { useSelector, useDispatch } from "react-redux";
import AdminLayout from "../components/SideBar/AdminLayout";
import withAuth from "@/app/middleware/withAuth";
import permissions from "@/lib/permissions";

const Dashboard = () => {
    const user = useSelector((state) => state.auth.user);

    const { preferredLanguage } = useSelector((state) => state.auth.user);
    const { t, i18n } = useTranslation();
    useEffect(() => {
        if (preferredLanguage) {
            i18n.changeLanguage(preferredLanguage);
        }
    }, [preferredLanguage, i18n]);

    return(
        <AdminLayout>
            <p>{user?.name}</p>
            <p>Saludos desde el dashboard</p>
        </AdminLayout>
    )
}

export default withAuth( Dashboard, permissions.dashboard_show);
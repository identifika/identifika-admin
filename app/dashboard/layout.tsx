'use client';
import DashboardSidebar from "./components/dashboard.sidebar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
    var pathname = usePathname()
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">

            <div className="w-full flex-none md:w-64">
                <DashboardSidebar />
            </div>
            <div className="flex-grow p-4 md:overflow-y-auto md:px-12">
                {children}
            </div>

        </div>

    )
}
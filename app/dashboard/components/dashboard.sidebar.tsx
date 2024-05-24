'use client';
import Link from "next/link";
import NavLinks from "./dashboard.navlinks";
import { Building2Icon, CheckIcon, PowerIcon, Settings2Icon, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { RxDashboard } from "react-icons/rx";
import { PiUsers } from "react-icons/pi";
import { TbFaceId, TbReportAnalytics } from "react-icons/tb";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { usePathname } from "next/navigation";

import clsx from "clsx";
import { BiListOl } from "react-icons/bi";
import { useState, useEffect } from "react";

async function getUsers() {
    try {
        const res = await fetch('http://localhost:3000/api/profile')
        if (res.status === 200) {
            const data = await res.json()
            return data
        } else {
            return null
        }
    }
    catch (error) {
        console.error(error)
        return null
    }
}

type User = {
    name: string;
    email: string;
    role: string;
    active: boolean;
}



export default function DashboardSidebar() {
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        getUsers().then(data => {
            setUser(data.data)
        })
    }, [])

    return (
        <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:border-slate-800 dark:bg-slate-800">
            <a href="#" className="mx-auto">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
                    Identifika.
                </h1>
            </a>
            <div className="flex flex-col items-center mt-2 mx-2 mb-4">
                {/* <img
                    className="object-cover w-24 h-24 mx-2 rounded-full"
                    src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                    alt="avatar"
                /> */}
                <Link href="/dashboard/profile" className="flex flex-col items-center">
                    <h4 className="mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200">
                        {user?.name}
                    </h4>
                    <p className="mx-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                        {user?.email}
                    </p>
                    {
                        user?.active ? (
                            <div className="flex items-center justify-center px-2 py-1 mt-1 text-xs font-medium text-green-600 bg-green-100 rounded-full mt-3">
                                <CheckIcon className="w-3 h-3" />
                                <span className="mx-1">Email Confirmed</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center px-2 py-1 mt-1 text-xs font-medium text-red-600 bg-red-100 rounded-full mt-3">
                                <CheckIcon className="w-3 h-3" />
                                <span className="mx-1">Email Not Confirmed</span>
                            </div>
                        )
                    }
                </Link>
            </div>
            <div className="flex flex-col justify-between flex-1 mt-6">
                <nav>

                    <Link
                        className={
                            clsx(
                                "flex items-center px-4 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700",
                                pathname === "/dashboard" ? "bg-gray-100 dark:bg-gray-700" : ""
                            )
                        }
                        href="/dashboard"
                    >
                        <RxDashboard className="w-5 h-5" />
                        <span className="mx-4 font-medium">Dashboard</span>
                    </Link>
                    {
                        user?.role === "admin" && (
                            <Link
                                className={
                                    clsx(
                                        "flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700",
                                        pathname === "/dashboard/users" ? "bg-gray-100 dark:bg-gray-700" : ""
                                    )
                                }
                                href="/dashboard/users"
                            >
                                <PiUsers className="w-5 h-5" />
                                <span className="mx-4 font-medium">Users</span>
                            </Link>)
                    }

                    <Link
                        className={
                            clsx(
                                "flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700",
                                pathname === "/dashboard/clients" ? "bg-gray-100 dark:bg-gray-700" : ""
                            )
                        }
                        href="/dashboard/clients"
                    >
                        <Building2Icon className="w-5 h-5" />
                        <span className="mx-4 font-medium">Client</span>
                    </Link>
                    <Link
                        className={
                            clsx(
                                "flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700",
                                pathname === "/dashboard/faces" ? "bg-gray-100 dark:bg-gray-700" : ""
                            )
                        }
                        href="/dashboard/faces"
                    >
                        <TbFaceId className="w-5 h-5" />
                        <span className="mx-4 font-medium">Faces</span>
                    </Link>
                    {/* divider */}
                    <hr className="my-6 dark:border-gray-700" />
                    <Link
                        className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
                        href="/dashboard/logs"
                    >
                        <BiListOl className="w-5 h-5" />
                        <span className="mx-4 font-medium">Bulk Import Logs</span>
                    </Link>
                    {
                        user?.role === "admin" && (
                            <Link
                                className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
                                href="/dashboard/reports"
                            >
                                <TbReportAnalytics className="w-5 h-5" />
                                <span className="mx-4 font-medium">Report</span>
                            </Link>
                        )
                    }

                </nav>
            </div>
            <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="grid grid-cols-2 gap-4">
                    <SignOutButton />
                    <ThemeToggle />
                </div>
            </div>
        </aside >
    )
}


function SignOutButton() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant='outline'
                    size='icon'
                >
                    <PowerIcon className="w-5 h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sign Out</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to sign out?
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-4 p-4">
                    <Button
                        variant='outline'
                        className="bg-rose-900 light:bg-rose-800 dark:bg-rose-900 text-white"
                        onClick={() => signOut()}
                    >
                        Yes
                    </Button>
                    <Button
                        variant='outline'

                        onClick={() => { }}
                    >
                        No
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
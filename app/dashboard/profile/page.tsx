'use client';

import clsx from "clsx";
import { CheckIcon, XCircleIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import DialogUpdateProfile from "./components/dialog.update.profile";
import DialogReconfirmEmail from "./components/dialog.reconfirm.email";
import { API_URL } from "@/constants/url_constant";
import DeleteProfileDialog from "./components/dialog.delete.profile";
import { signOut } from "next-auth/react";

async function getUsers() {
    try {
        const res = await fetch(`${API_URL}/api/profile`)
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
    id: string,
    name: string,
    email: string,
    active: boolean,
    role: string,
    createdAt: string,
    updatedAt: string,
    _count: {
        clients: number
    }
}

enum Status {
    IDLE,
    LOADING,
    SUCCESS,
    ERROR,
}

export default function Page() {
    const { userId } = useParams()
    const [userData, setUserData] = useState<User | null>(null)
    const [status, setStatus] = useState<Status>(Status.IDLE)

    useEffect(() => {
        getUsers().then(data => {
            setUserData(data.data)
        })
    }, [])

    const refetchData = async () => {
        const data = await getUsers()
        setUserData(data.data)
    }

    const logout = async () => {
        try {
            signOut();
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 py-4">
                Users
            </h1>

            {userData ? (
                <div className="flex flex-col space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">User Information</span>

                                </div>
                                <div className="flex items-center space-x-2">

                                </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Name: {userData.name}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Email: {userData.email}</span>
                                {
                                    userData?.active ? (
                                        <div className="flex items-center justify-center px-2 py-1 mt-2 text-xs text-blue-500 bg-blue-100 rounded-full">
                                            <CheckIcon className="w-3 h-3 mr-1" />
                                            Email Confirmed
                                        </div>
                                    ) : (
                                        <DialogReconfirmEmail email={userData.email} />
                                    )
                                }
                            </div>
                        </div>

                    </div>
                    {/* show 3 tombol to edit, delete, back */}
                    <div className="flex justify-start">
                        <DeleteProfileDialog userId={userData.id} afterDelete={logout} />
                        <DialogUpdateProfile userId={userData.id} onStatusChange={refetchData} isActive={userData.active} role={userData.role} name={userData.name} />
                    </div>

                </div>
            ) : (
                <div className="flex justify-center">
                    <span className="text-gray-800 dark:text-gray-200">Loading...</span>
                </div>
            )}
        </div>
    )
}
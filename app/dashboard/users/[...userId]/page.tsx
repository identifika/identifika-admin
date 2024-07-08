'use client';

import clsx from "clsx";
import Link from "next/link";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import DialogActive from "./components/dialog.active";
import DialogChangeRole from "./components/dialog.change.role";
import DialogUpdateUser from "./components/dialog.update.user";
import { API_URL } from "@/constants/url_constant";

async function getUsers(userId: string) {
    try {
        const res = await fetch(`${API_URL}/api/users/${userId}`)
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
        getUsers(userId.toString()).then(data => {
            setUserData(data.data)
        })
    }, [])

    const refetchData = async () => {
        const data = await getUsers(userId.toString())
        setUserData(data.data)
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
                                    <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">{userData.name}</span>

                                </div>
                                <div className="flex items-center space-x-2">
                                    <DialogActive isActive={userData.active} userId={userData.id} onStatusChange={refetchData} />
                                    <DialogChangeRole role={userData.role} userId={userData.id} onStatusChange={refetchData} />
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Name: {userData.name}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Email: {userData.email}</span>

                            </div>
                        </div>
                        <div className="flex flex-col space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">Clients</span>
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                    {userData._count.clients}
                                </span>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Total Clients: {userData._count.clients}</span>
                            </div>
                            <Link href={`/dashboard/clients?userId=${userId}`}>
                                <div className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500 text-blue-100 w-full text-center cursor-pointer">
                                    Show Clients
                                </div>
                            </Link>
                        </div>
                    </div>
                    {/* show 3 tombol to edit, delete, back */}
                    <div className="flex justify-end">

                        {/* <button className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-red-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-red-600 dark:hover:bg-red-500 dark:bg-red-600 ml-2" >
                            Delete
                        </button> */}
                        <DialogUpdateUser userId={userData.id} onStatusChange={refetchData} isActive={userData.active} role={userData.role} />
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
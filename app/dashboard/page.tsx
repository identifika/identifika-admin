'use client'
import useFetch from "http-react"
import { Building2Icon } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { PiUsers } from "react-icons/pi"
import { TbFaceId } from "react-icons/tb"
import { useState, useEffect, useRef } from "react"
import { API_URL } from "@/constants/url_constant"


async function fetchUserTotal() {
    const res = await fetch(`${API_URL}/api/dashboard`)
    if (!res.ok) {
        return {
            data: {
                faces: 0,
                users: 0,
                clients: 0
            }
        }
    }
    const data = await res.json()
    return data
}

export default  function DashboardPage() {
    const [data, setData] = useState<any>({ data: { faces: 0, users: 0, clients: 0 } })
    const { data: userData } = useSession()
    const isMounted = useRef(true)

    useEffect(() => {
        fetchUserTotal().then((data) => {
            if (isMounted.current) {
                setData(data)
            }
        })

        return () => {
            isMounted.current = false
        }
    }, [])


    return (
        <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 py-4">
                Dashboard
            </h1>
            <div className="grid grid-cols-1 gap-8 mt-6 lg:grid-cols-3 xl:mt-12">
                <Link href="/dashboard/faces">

                    <div className="flex items-center justify-between px-8 py-4 border cursor-pointer rounded-xl dark:border-gray-700">
                        <div className="flex flex-col items-center space-y-1">
                            <TbFaceId className="w-5 h-5 text-gray-400 sm:h-7 sm:w-7" />
                            <h2 className="text-lg font-medium text-gray-700 sm:text-xl dark:text-gray-200">
                                {data.data.faces}
                            </h2>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-500 sm:text-3xl dark:text-gray-300">
                            Faces
                        </h2>
                    </div>
                </Link>
                {
                    (userData?.user?.role === "admin") && (<Link href="/dashboard/users">
                        <div className="flex items-center justify-between px-8 py-4 border cursor-pointer rounded-xl dark:border-gray-700">
                            <div className="flex flex-col items-center space-y-1">
                                <PiUsers className="w-5 h-5 text-gray-400 sm:h-7 sm:w-7" />
                                <h2 className="text-lg font-medium text-gray-700 sm:text-xl dark:text-gray-200">
                                    {data.data.users}
                                </h2>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-500 sm:text-3xl dark:text-gray-300">
                                Users
                            </h2>
                        </div>
                    </Link>)
                }

                <Link href="/dashboard/clients">
                    <div className="flex items-center justify-between px-8 py-4 border cursor-pointer rounded-xl dark:border-gray-700">
                        <div className="flex flex-col items-center space-y-1">
                            <Building2Icon className="w-5 h-5 text-gray-400 sm:h-7 sm:w-7" />
                            <h2 className="text-lg font-medium text-gray-700 sm:text-xl dark:text-gray-200">
                                {data.data.clients}
                            </h2>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-500 sm:text-3xl dark:text-gray-300">
                            Client
                        </h2>
                    </div>
                </Link>
            </div>

        </div>
    )
}
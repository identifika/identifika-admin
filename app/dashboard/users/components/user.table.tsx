'use client';

import clsx from "clsx";
import { ArrowLeft, ArrowRight, MoreVertical, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";


async function fetchUsers(
    page: number,
    limit: number,
    search: string
) {
    const res = await fetch(
        `http://localhost:3000/api/users?page=${page}&limit=${limit}&search=${search}`
    )
    if (!res.ok) {
        return {
            data: [],
            meta: {
                page: 1,
                limit: 10,
                totalPages: 1,
                total: 0,
            },
        }
    }
    const data = await res.json()
    return data
}

type UserTableProps = {
    page: number
    limit: number
    search: string
}

export default async function UserTable(props: UserTableProps) {
    const data = await fetchUsers(
        props.page,
        props.limit,
        props.search
    )
    return (
        <section className="container px-4 mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-x-3">
                        <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                            Users
                        </h2>
                        <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
                            {data.meta.total} users
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                        These are the users that are currently registered in the system
                    </p>
                </div>
                <div className="flex items-center mt-4 gap-x-3">
                    <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700">
                        <svg
                            width={20}
                            height={20}
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clipPath="url(#clip0_3098_154395)">
                                <path
                                    d="M13.3333 13.3332L9.99997 9.9999M9.99997 9.9999L6.66663 13.3332M9.99997 9.9999V17.4999M16.9916 15.3249C17.8044 14.8818 18.4465 14.1806 18.8165 13.3321C19.1866 12.4835 19.2635 11.5359 19.0351 10.6388C18.8068 9.7417 18.2862 8.94616 17.5555 8.37778C16.8248 7.80939 15.9257 7.50052 15 7.4999H13.95C13.6977 6.52427 13.2276 5.61852 12.5749 4.85073C11.9222 4.08295 11.104 3.47311 10.1817 3.06708C9.25943 2.66104 8.25709 2.46937 7.25006 2.50647C6.24304 2.54358 5.25752 2.80849 4.36761 3.28129C3.47771 3.7541 2.70656 4.42249 2.11215 5.23622C1.51774 6.04996 1.11554 6.98785 0.935783 7.9794C0.756025 8.97095 0.803388 9.99035 1.07431 10.961C1.34523 11.9316 1.83267 12.8281 2.49997 13.5832"
                                    stroke="currentColor"
                                    strokeWidth="1.67"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_3098_154395">
                                    <rect width={20} height={20} fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        <span>Import</span>
                    </button>
                    <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>Add User</span>
                    </button>
                </div>
            </div>
            
            <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                        >
                                            <button className="flex items-center gap-x-3 focus:outline-none">
                                                <span>Users</span>
                                            </button>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                        >
                                            Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                        >
                                            Role
                                        </th>
                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">

                                    {
                                        data.data.map((user: any) => (
                                            <tr key={user.id}>
                                                <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                                    <div>
                                                        <h2 className="font-medium text-gray-800 dark:text-white ">
                                                            {user.name}
                                                        </h2>
                                                        <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                                                    <div className={
                                                        clsx(
                                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                            {
                                                                "bg-green-100 text-green-800": user.active === true,
                                                                "bg-red-100 text-red-800": user.active === false,
                                                            }
                                                        )
                                                    }>
                                                        {user.active === true ? "Active" : "Inactive"}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                    <div className={
                                                        clsx(
                                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                            {
                                                                "bg-yellow-100 text-yellow-800": user.role === "admin",
                                                                "bg-blue-100 text-blue-800": user.role === "user",
                                                            }
                                                        )
                                                    }>
                                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                    <button className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg dark:text-gray-300 hover:bg-gray-100">
                                                        <MoreVerticalIcon className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 sm:flex sm:items-center sm:justify-between ">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Page{" "}
                    <span className="font-medium text-gray-700 dark:text-gray-100">
                       {props.page} of {data.meta.totalPages}
                    </span>
                </div>
                <div className="flex items-center mt-4 gap-x-4 sm:mt-0">
                    <Link
                        href={
                            props.page === 1 || props.page === 0
                                ? "#"
                                : `/dashboard/users?page=${props.page - 1}&limit=${props.limit}&search=${props.search}`
                        }
                        className={
                            clsx(
                                "flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2",
                                {
                                    "hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800": props.page === 1 || props.page === 0,
                                }
                            )
                        }
                    >
                        <ArrowLeft className="w-5 h-5 rtl:-scale-x-100" />
                        <span>previous</span>
                    </Link>
                    <a
                        href="#"
                        className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                        <span>Next</span>
                        <ArrowRight className="w-5 h-5 rtl:-scale-x-100" />
                    </a>
                </div>
            </div>
        </section>

    );
} 
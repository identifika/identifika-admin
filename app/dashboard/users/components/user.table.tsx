'use client';

import clsx from "clsx";
import { ArrowLeft, ArrowRight, MoreVertical, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserSearchComponent from "./user.search.component";

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

export default function UserTable(props: UserTableProps) {
    const [data, setData] = useState({
        data: [],
        meta: {
            page: 1,
            limit: 10,
            totalPages: 1,
            total: 0,
        },
    })

    useEffect(() => {
        fetchUsers(props.page, props.limit, props.search).then((data) => {
            setData(data)
        })
    }, [props.page, props.limit, props.search])
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
                <UserSearchComponent limit={props.limit} page={props.page} search={props.search} />
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
                                            Email Confirmed
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                        >
                                            Role
                                        </th>
                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            Clients Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">

                                    {
                                        data.data.map((user: any) => (
                                            <tr key={user.id}>
                                                <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                                    <Link href={`/dashboard/users/${user.id}`}>
                                                        <div>
                                                            <h2 className="font-medium text-gray-800 dark:text-white ">
                                                                {user.name}
                                                            </h2>
                                                            <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </Link>
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
                                                        {user.active === true ? "Confirmed" : "Not Confirmed"}
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
                                                    {user._count.clients}
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
                        href={
                            props.page === data.meta.totalPages
                                ? "#"
                                : `/dashboard/users?page=${props.page + 1}&limit=${props.limit}&search=${props.search}`
                        }
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
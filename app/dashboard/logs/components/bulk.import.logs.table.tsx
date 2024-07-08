'use client';

import { API_URL } from "@/constants/url_constant";
import clsx from "clsx";
import { ArrowLeft, ArrowRight, MoreVertical, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";


async function fetchLogs(
    page: number,
    limit: number,
) {
    try {
        const res = await fetch(
            `${API_URL}/api/queue_task?page=${page}&limit=${limit}`,
        )

        if (!res.ok) {
            return {
                data: [],
                meta: {
                    totalPages: 1,
                    total_data: 0,
                    page: 1,
                },
            }
        }
        const data = await res.json()
        return data
    } catch (error) {
        console.error(error)
        return {
            data: [],
            meta: {
                totalPages: 1,
                total_data: 0,
                page: 1,
            },
        }
    }
}


async function fetchBulkRegisterStatus(taskId: string) {
    try {
        const res = await fetch(`${API_URL}/api/queue_task/${taskId}/status_bulk`)
        const data = await res.json()
        return data
    }
    catch (error) {
        console.error(error)
        return null
    }

}

type ReportTableProps = {
    page: number
    limit: number
}

export default function BulkImportLogsTable(props: ReportTableProps) {

    const [data, setData] = useState({ data: [], meta: { totalPages: 1, total_data: 0, page: 1 } });

    useEffect(() => {
        fetchLogs(props.page, props.limit)
            .then(x => {
                setData(x);

            })
            .catch(err => {
                console.error(err)
                setData({
                    data: [],
                    meta: {
                        totalPages: 1,
                        total_data: 0,
                        page: 1,
                    }
                });
            });
    }, [props.page, props.limit]);




    return (
        <section className="container px-4 mx-auto">

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
                                            Client Name
                                        </th>

                                        <th
                                            scope="col"
                                            className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                        >
                                            Task Id
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
                                            Message
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                        >
                                            Error File
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">

                                    {
                                        data.data.map((logs: any, index: number) => (
                                            <tr key={index}>
                                                <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">

                                                    <Link href={`/dashboard/logs/${logs.task_id}`}>
                                                        <div>
                                                            <h2 className="font-medium text-gray-800 dark:text-white ">
                                                                {logs.client.client_name}
                                                            </h2>
                                                        </div>
                                                    </Link>
                                                </td>

                                                <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                                                    <Link href={`/dashboard/logs/${logs.task_id}`}>

                                                        <div>
                                                            <h2 className="font-medium text-gray-800 dark:text-white ">
                                                                {logs.task_id}
                                                            </h2>
                                                        </div>
                                                    </Link>
                                                </td>

                                                <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                                                    <div>
                                                        <h2 className="font-medium text-gray-800 dark:text-white ">
                                                            {logs.status}
                                                        </h2>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                    <div>
                                                        <h2 className="font-medium text-gray-800 dark:text-white ">
                                                            {logs.message.length > 15 ? `${logs.message.substring(0, 15)}...` : logs.message}
                                                        </h2>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                    <div>
                                                        <h2 className="font-medium text-gray-800 dark:text-white ">
                                                            {logs.csv_error_file.length > 15 ? `${logs.csv_error_file.substring(0, 15)}...` : logs.csv_error_file}
                                                        </h2>
                                                    </div>
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
                                : {
                                    pathname: "/dashboard/logs",
                                    query: { page: props.page - 1, limit: props.limit },
                                }
                        }
                        scroll={false}
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
                    <Link
                        href={
                            props.page === data.meta.totalPages || props.page === 0 || props.page > data.meta.totalPages
                                ? "#"
                                : {
                                    pathname: "/dashboard/logs",
                                    query: { page: props.page + 1, limit: props.limit },
                                }
                        }
                        scroll={false}
                        className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                        <ArrowRight className="w-5 h-5 rtl:-scale-x-100" />
                        <span>next</span>
                    </Link>

                </div>
            </div>
        </section>

    );
} 
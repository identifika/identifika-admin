'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { API_URL } from "@/constants/url_constant";
import clsx from "clsx";
import { ArrowLeft, ArrowRight, MoreVertical, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";


async function fetchReport(
    page: number,
    limit: number,
    search: string
) {
    try {
        const res = await fetch(
            `${API_URL}/api/report?page=${page}&limit=${limit}&search=${search}`,
        )

        if (!res.ok) {
            return {
                data: [],
                meta: {
                    total_page: 1,
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
                total_page: 1,
                total_data: 0,
                page: 1,
            },
        }
    }
}

type ReportTableProps = {
    page: number
    limit: number
    search: string
}

export default function ReportTable(props: ReportTableProps) {

    const [data, setData] = useState({ data: [], meta: { total_page: 1 } });

    useEffect(() => {
        fetchReport(props.page, props.limit, props.search)
            .then(x => {
                setData(x.data);

            })
            .catch(err => {
                console.error(err);
            });
    }, [props.page, props.limit, props.search]);



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
                                            <button className="flex items-center gap-x-3 focus:outline-none">
                                                <span>Endpoint</span>
                                            </button>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                        >
                                            Method
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                        >
                                            Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                        >
                                            Elapsed Time
                                        </th>
                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            Timestamp
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">

                                    {
                                        data.data.map((report: any, index: number) => (
                                            <tr key={index}>
                                                <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <div>
                                                                <h2 className="font-medium text-gray-800 dark:text-white ">
                                                                    {report.endpoint}
                                                                </h2>
                                                            </div>
                                                        </DialogTrigger>
                                                        <DialogContent className={"lg:max-w-screen-lg overflow-y-scroll max-h-screen"}>
                                                            <DialogHeader>
                                                                <DialogTitle>
                                                                    Request Body
                                                                </DialogTitle>
                                                            </DialogHeader>
                                                            <div>
                                                                {/* method */}
                                                                <div className="text-sm font-medium text-gray-800 dark:text-white">
                                                                    Method
                                                                </div>
                                                                <div className="text-sm font-normal text-gray-800 dark:text-white">
                                                                    {report.method}
                                                                </div>
                                                                {/* status */}
                                                                <div className="text-sm font-medium text-gray-800 dark:text-white mt-4">
                                                                    Status
                                                                </div>
                                                                <div className={
                                                                    clsx(
                                                                        "text-sm font-medium whitespace-nowrap",
                                                                        {
                                                                            "text-green-500": report.status_code < 300 && report.status_code >= 200,
                                                                            "text-red-500": report.status_code >= 400,
                                                                        }
                                                                    )
                                                                }>
                                                                    {report.status_code}
                                                                </div>
                                                                {/* headers */}
                                                                <div className="text-sm font-medium text-gray-800 dark:text-white mt-4">
                                                                    Headers
                                                                </div>
                                                                <div className="text-sm font-normal text-gray-800 dark:text-white lg:max-w-screen-lg overflow-x-auto">
                                                                    <pre>
                                                                        {
                                                                            JSON.stringify(report.headers, null, 2)
                                                                        }
                                                                    </pre>
                                                                </div>
                                                                {/* response */}
                                                                <div className="text-sm font-medium text-gray-800 dark:text-white mt-4">
                                                                    Response
                                                                </div>
                                                                <div className="text-sm font-normal text-gray-800 dark:text-white lg:max-w-screen-lg overflow-x-auto">
                                                                    <pre>
                                                                        {
                                                                            report.response && typeof report.response === "string" && report.response.startsWith("{") && report.response.endsWith("}")
                                                                                ? JSON.parse(JSON.stringify(report.response, null, 2))
                                                                                : report.response
                                                                        }
                                                                    </pre>
                                                                </div>
                                                            </div>

                                                        </DialogContent>

                                                    </Dialog>
                                                </td>
                                                <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                                                    <div>
                                                        <h2 className="font-medium text-gray-800 dark:text-white ">
                                                            {report.method}
                                                        </h2>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                    <div>
                                                        <h2 className={
                                                            clsx(
                                                                "font-medium text-gray-800",
                                                                {
                                                                    "text-green-500": report.status_code < 300 && report.status_code >= 200,
                                                                    "text-red-500": report.status_code >= 400,
                                                                }
                                                            )
                                                        }>
                                                            {report.status_code}
                                                        </h2>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                    <div>
                                                        <h2 className="font-medium text-gray-800 dark:text-white ">
                                                            {report.elapsed_time}
                                                        </h2>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                    <div>
                                                        <h2 className="font-medium text-gray-800 dark:text-white ">
                                                            {/* make timestamp more readable */}
                                                            {new Date(report.timestamp).toLocaleString()}
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
                        {props.page} of {data.meta.total_page}
                    </span>
                </div>
                <div className="flex items-center mt-4 gap-x-4 sm:mt-0">
                    <Link
                        href={
                            props.page === 1 || props.page === 0
                                ? "#"
                                : {
                                    pathname: `/dashboard/reports`,
                                    query: {
                                        page: props.page - 1,
                                        limit: props.limit,
                                        ...(props.search && { search: props.search }),
                                    }
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
                            props.page === data.meta.total_page || props.page === 0 || props.page > data.meta.total_page
                                ? "#"
                                : {
                                    pathname: `/dashboard/reports`,
                                    query: {
                                        page: props.page + 1,
                                        limit: props.limit,
                                        ...(props.search && { search: props.search }),
                                    }
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
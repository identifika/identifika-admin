'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel, } from "@/components/ui/dropdown-menu";
import clsx from "clsx";
import { ArrowLeft, ArrowRight, MoreVertical, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import AddClientDialog from "./add.client.dialog";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { FaInfoCircle } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import GenerateTokenDialog from "./generate.token.dialog";
import { IoAddCircle } from "react-icons/io5";
import { useEffect, useState } from "react";
import ClientSearchComponent from "./client.search.component";

async function fetchClients(
    page: number,
    limit: number,
    search: string,
    clientId: string
) {
    const res = await fetch(`http://localhost:3000/api/clients?search=${search}&page=${page}&limit=${limit}&userId=${clientId}`);

    if (!res.ok) {
        return {
            data: [],
            meta: {
                page: 1,
                limit: 10,
                totalPages: 1,
                total: 0,
            },
        };
    }

    return res.json();
}


type ClientTableProps = {
    page: number;
    limit: number;
    search: string;
    clientId: string;
}

export default function ClientTable(props: ClientTableProps) {
    const [data, setData] = useState({
        data: [],
        meta: {
            page: 1,
            limit: 10,
            totalPages: 1,
            total: 0,
        },
    });

    useEffect(() => {
        fetchClients(props.page, props.limit, props.search, props.clientId).then((data) => {
            setData(data);
        });
    }, [props.page, props.limit, props.search]);

    const reFetchClients = () => {
        fetchClients(props.page, props.limit, props.search, props.clientId).then((data) => {
            setData(data);
        });
    }

    return (
        <section className="container px-4 mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-x-3">
                        <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                            Clients
                        </h2>
                        <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
                            {data.meta.total} Clients
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                        These are the clients that are currently registered in the system.
                    </p>
                </div>
                <div className="flex items-center mt-4 gap-x-3">
                    <AddClientDialog afterSubmit={reFetchClients} />
                </div>
            </div>
            <ClientSearchComponent page={props.page} limit={props.limit} search={props.search} />
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
                                                <span>Client Name</span>
                                            </button>
                                        </th>

                                        <th
                                            scope="col"
                                            className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                        >
                                            Total Registered Faces
                                        </th>
                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            Generate Token
                                        </th>

                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">

                                    {
                                        data.data.map((client: any) => (
                                            <tr key={client.id}>
                                                <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                                    {
                                                        (() => {
                                                            if (client.external_token == null || client.external_token == "") {
                                                                return (

                                                                    <HoverCard>
                                                                        <HoverCardTrigger className="">
                                                                            <Link href={`/dashboard/clients/${client.id}`}>

                                                                                <div className="flex items-center gap-x-2">
                                                                                    <div>
                                                                                        <h2 className="font-medium text-gray-800 dark:text-white ">
                                                                                            {client.client_name}
                                                                                        </h2>
                                                                                        <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                                                                                            {client.user.name}
                                                                                        </p>
                                                                                    </div>
                                                                                    <FaInfoCircle className="text-gray-800 dark:text-yellow-200 ml-2" />

                                                                                </div>
                                                                            </Link>
                                                                        </HoverCardTrigger>
                                                                        <HoverCardContent className="w-80">
                                                                            <div className="flex justify-between space-x-4">
                                                                                <p>
                                                                                    Before you can use this client,
                                                                                    <br />
                                                                                    you need to add an external token.
                                                                                    <br />
                                                                                    Generate a token from the actions menu.
                                                                                </p>
                                                                            </div>
                                                                        </HoverCardContent>
                                                                    </HoverCard>


                                                                )
                                                            } else {
                                                                return (
                                                                    <Link href={`/dashboard/clients/${client.id}`}>
                                                                        <h2 className="font-medium text-gray-800 dark:text-white ">
                                                                            {client.client_name}
                                                                        </h2>
                                                                        <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                                                                            {client.user.name}
                                                                        </p>
                                                                    </Link>
                                                                )
                                                            }
                                                        })()
                                                    }

                                                </td>
                                                <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                                                    <span className="text-gray-800 dark:text-white">
                                                        {client._count.faces}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                    {
                                                        (() => {
                                                            if (client.external_token == null || client.external_token == "") {
                                                                return (
                                                                    <GenerateTokenDialog clientId={client.id} afterGenerate={reFetchClients} />
                                                                )
                                                            } else {
                                                                return (
                                                                    <span className="text-gray-800 dark:text-white">
                                                                        Token Generated
                                                                    </span>
                                                                )
                                                            }
                                                        })()
                                                    }
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
                                : `/dashboard/clients?page=${props.page - 1}&limit=${props.limit}&search=${props.search}`
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
                    <Link
                        href={
                            props.page === data.meta.totalPages || data.meta.totalPages === 0 
                                ? "#"
                                : `/dashboard/clients?page=${props.page + 1}&limit=${props.limit}&search=${props.search}`
                        }
                        className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                        <span>Next</span>
                        <ArrowRight className="w-5 h-5 rtl:-scale-x-100" />
                    </Link>
                </div>
            </div>
        </section>

    );
}
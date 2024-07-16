'use client';

import clsx from "clsx";
import { ArrowLeft, ArrowRight, } from "lucide-react";
import Link from "next/link";
import { BiSolidFileImport } from "react-icons/bi";
import AddFaceDialog from "./add.face.dialog";
import SearchComponent from "./search.component";
import { IoAddCircle } from "react-icons/io5";
import ImportFaceDialog from "./import.face.dialog";
import { useState, useEffect, useRef } from "react";
import { TbTrash } from "react-icons/tb";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DeleteFaceDialog from "./delete.face.dialog";
import { API_URL } from "@/constants/url_constant";


async function fetchFaces(
    page: number,
    limit: number,
    search: string,
    clientId?: string
) {

    const res = await fetch(
        `${API_URL}/api/faces?page=${page}&limit=${limit}&search=${search}&client_id=${clientId}`,
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


type FaceTableProps = {
    page: number
    limit: number
    search: string
    clientId?: string
}

enum Status {
    IDLE,
    LOADING,
    SUCCESS,
    ERROR,
}

export default function FaceTable(props: FaceTableProps) {

    const [data, setData] = useState<any>({ data: [], meta: { page: 1, limit: 10, totalPages: 1, total: 0 } })


    useEffect(() => {
        fetchFaces(props.page, props.limit, props.search, props.clientId).then((data) => {
            setData(data)
        })
    }, [props.page, props.limit, props.search, props.clientId])

    const refetchData = () => {
        fetchFaces(props.page, props.limit, props.search, props.clientId).then((data) => {
            setData(data)
        })
    }

    return (
        <section className="container px-4 mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-x-3">
                        <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                            Faces
                        </h2>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                        These are the faces that have been indexed by the system.
                    </p>
                </div>
                <div className="flex items-center mt-4 gap-x-3">
                    <ImportFaceDialog />

                    <AddFaceDialog afterSubmit={refetchData} />
                </div>
            </div>
            <SearchComponent page={props.page} limit={props.limit} clientId={props.clientId} />
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
                                                <span>Id</span>
                                            </button>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                        >
                                            Username
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                        >
                                            Client
                                        </th>
                                        <th scope="col" className="px-8 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">

                                    {
                                        data.data.map((face: any) => (
                                            <tr key={face.id}>
                                                <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                                    <div>
                                                        <h2 className="font-medium text-gray-800 dark:text-white ">
                                                            {face.id}
                                                        </h2>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                    <div>
                                                        <h2 className="font-medium text-gray-800 dark:text-white ">
                                                            {face.user_name}
                                                        </h2>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                    <div>
                                                        <h2 className="font-medium text-gray-800 dark:text-white ">
                                                            {face.client.client_name}
                                                        </h2>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm font-medium whitespace-nowrap flex items-center gap-x-4">
                                                    <AddFaceDialog afterSubmit={refetchData} faceId={face.id} name={face.user_name} clientId={face.client_id} clientName={face.client.client_name} />
                                                    <DeleteFaceDialog faceId={face.id} clientId={face.client_id} afterDelete={refetchData} />
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
                                    pathname: "/dashboard/faces",
                                    query: {
                                        page: props.page - 1,
                                        limit: props.limit,
                                        ...props.search && { search: props.search },
                                        ...props.clientId && { client_id: props.clientId },
                                    },
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
                            props.page === data.meta.totalPages || data.meta.totalPages === 0 
                                ? "#"
                                : {
                                    pathname: "/dashboard/faces",
                                    query: {
                                        page: props.page + 1,
                                        limit: props.limit,
                                        ...props.search && { search: props.search },
                                        ...props.clientId && { client_id: props.clientId },
                                    },
                                
                                }
                        }
                        scroll={false}
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


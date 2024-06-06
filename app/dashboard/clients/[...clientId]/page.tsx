'use client';
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoAddCircle, IoTrash } from "react-icons/io5";
import EditClientDialog from "./components/edit.client.dialog";
import GenerateTokenDialog from "../components/generate.token.dialog";
import RevokeTokenDialog from "../components/revoke.token.dialog";
import DeleteClientDialog from "./components/delete.client.dialog";
import { API_URL } from "@/constants/url_constant";

async function getClientDetail(clientId: string) {
    try {
        const res = await fetch(`${API_URL}/api/clients/${clientId}`)
        if (res.status === 200) {
            const data = await res.json()
            return data
        } else {
            return null
        }
    } catch (error) {
        console.error(error)
        return null
    }
}

export default function DetailClientPage() {
    const { clientId } = useParams()

    const [clientData, setClientData] = useState({
        data: {
            id: '',
            client_name: '',
            external_token: '',
            recognition_type: {
                face_detector: '',
                face_model: '',
                recognition_type: ''
            },
            user_id: '',
            user: {
                name: '',
                email: ''
            },
            _count: {
                faces: 0
            }
        }
    })

    useEffect(() => {
        getClientDetail(clientId.toString()).then(data => {
            setClientData(data)
        })
    }, [])

    const refetchData = async () => {
        const data = await getClientDetail(clientId.toString())
        setClientData(data)
    }

    if (!clientData) {
        return (
            <div className="flex flex-col space-y-4">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 py-4">
                    Client Detail
                </h1>
                <div className="flex justify-center">
                    <span className="text-gray-800 dark:text-gray-200">Loading...</span>
                </div>
            </div>
        )
    }
    return (
        <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 py-4">
                Client Detail
            </h1>
            <div className="flex flex-col space-y-4">
                {/* create a container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Client Information</h2>
                        <div className="flex flex-col space-y-2">
                            <div>
                                <span className="text-gray-800 dark:text-gray-200">{clientData.data.client_name}</span>
                            </div>
                            {
                                // button to generate token if token is null or empty
                                (clientData.data.external_token == null || clientData.data.external_token == '') ? (
                                    <div>
                                        <GenerateTokenDialog clientId={clientId[0]} afterGenerate={refetchData} />
                                    </div>
                                ) : (
                                    // revoke token
                                    <div>
                                        <RevokeTokenDialog clientId={clientId[0]} token={clientData.data.external_token} afterGenerate={refetchData} />
                                    </div>
                                )
                            }

                        </div>
                    </div>
                    <div className="flex flex-col space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">User Information</h2>
                        <div className="flex flex-col space-y-2">
                            <div>
                                <span className="text-gray-800 dark:text-gray-200">{clientData.data.user.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-800 dark:text-gray-200">{clientData.data.user.email}</span>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="flex flex-col space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Face Count</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span className="text-gray-800 dark:text-gray-200">Total Faces: {clientData.data._count.faces}</span>
                        </div>
                        <div className="flex justify-end">
                            <Link href={`/dashboard/faces?client_id=${clientId}`}>
                                <button className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                                    View Faces
                                </button>
                            </Link>
                        </div>

                    </div>
                </div>

                <div className="flex flex-col space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Recognition Type</h2>
                    <div className="flex flex-col space-y-2">
                        <div>
                            <span className="text-gray-800 dark:text-gray-200">Face Detector: {clientData.data.recognition_type.face_detector}</span>
                        </div>
                        <div>
                            <span className="text-gray-800 dark:text-gray-200">Face Model: {clientData.data.recognition_type.face_model}</span>
                        </div>
                        <div>
                            <span className="text-gray-800 dark:text-gray-200">Recognition Type: {clientData.data.recognition_type.recognition_type}</span>
                        </div>
                    </div>
                </div>

                {/* button to edit or delete */}
                <div className="flex justify-end">
                    {/* button back in the start justify*/}
                    <Link href="/dashboard/clients">
                        <button className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600 mr-2" >
                            Back
                        </button>
                    </Link>

                    <EditClientDialog clientId={clientId[0]} clientName={clientData.data.client_name} />

                    <DeleteClientDialog clientId={clientId[0]} />

                </div>
            </div>
        </div>
    )
}
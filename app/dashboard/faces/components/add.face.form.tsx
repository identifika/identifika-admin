// Code: AddFaceForm component
// Path: app/dashboard/faces/components/add.face.form.tsx

// 'use client'
import { headers } from "next/headers"
import { useState, useEffect, useRef } from "react"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { FaQuestionCircle } from "react-icons/fa"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

enum Status {
    IDLE,
    LOADING,
    SUCCESS,
    ERROR,
}

type AddFaceFormProps = {
    clientId?: any,
}

async function fetchClients() {
    const res = await fetch(
        `http://localhost:3000/api/clients`,
    )
    if (!res.ok) {
        return {
            data: []
        }
    }
    const data = await res.json()

    return data
}

export default function AddFaceForm(props: AddFaceFormProps) {
    const [clients, setClients] = useState<any[]>([])
    const [selectedClient, setSelectedClient] = useState<any>(null)
    const [identifier, setIdentifier] = useState<any>(null)
    const [name, setName] = useState<any>(null)
    const [image, setImage] = useState<File | null>(null)
    const [status, setStatus] = useState<Status>(Status.IDLE)

    const ref = useRef<HTMLInputElement>(null)

    const onSelectedClient = (e: any) => {
        setSelectedClient(e.target.value)
    }

    const onIdentifierChange = (e: any) => {
        setIdentifier(e.target.value)
    }

    const onNameChange = (e: any) => {
        setName(e.target.value)
    }

    const onImageChange = (e: any) => {
        setImage(e.target.files[0])
    }

    useEffect(() => {
        fetchClients().then((data) => {
            setClients(data.data)
        })
    }, [])

    const onSaveClick = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setStatus(Status.LOADING)
            const formData = new FormData()
            formData.append('client_id', selectedClient)
            if (identifier) {
                formData.append('identifier', identifier)
            }
            formData.append('real_name', name)
            formData.append('image', image as Blob)

            const res = await fetch(
                `http://localhost:3000/api/faces`,
                {
                    method: 'POST',
                    body: formData,
                }
            )

            if (!res.ok) {
                setStatus(Status.ERROR)
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
            setStatus(Status.SUCCESS)

            const data = await res.json()
        } catch (error) {
            return {
                data: [],
                meta: {
                    page: 1,
                    limit: 10,
                    totalPages: 1,
                    total: 0,
                },
            }
            setStatus(Status.ERROR)
        }
    }


    return (
        <form onSubmit={onSaveClick}>
            {(() => {
                switch (status) {
                    case Status.IDLE:
                        return (
                            <div className="flex flex-col space-y-4 my-4">
                                <div className="flex flex-col space-y-4">
                                    <label className="text-gray-800 dark:text-gray-200">Client</label>
                                    <select className="border border-gray-200 dark:border-gray-800 rounded-lg p-2" onChange={onSelectedClient}>
                                        <option value="">Select a client</option>
                                        {clients.map((client) => {
                                            return <option key={client.id} value={client.id}>{client.client_name}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="flex flex-col space-y-4">

                                    <HoverCard>
                                        <HoverCardTrigger className="flex items-center">

                                            <label className="text-gray-800 dark:text-gray-200 mr-2">
                                                Identifier (Optional)
                                            </label>
                                            <FaQuestionCircle className="text-gray-800 dark:text-gray-200 ml-2" />

                                        </HoverCardTrigger>
                                        <HoverCardContent>
                                            <p className="text-gray-800 dark:text-gray-200">
                                                Identifier is a unique value that can be used to identify a face. If you don't provide an identifier, a random identifier will be generated.
                                            </p>
                                        </HoverCardContent>
                                    </HoverCard>
                                    <input className="border border-gray-200 dark:border-gray-800 rounded-lg p-2" onChange={onIdentifierChange} ref={ref} />
                                </div>
                                <div className="flex flex-col space-y-4">
                                    <label className="text-gray-800 dark:text-gray-200">Name</label>
                                    <input type="text" className="border border-gray-200 dark:border-gray-800 rounded-lg p-2" onChange={onNameChange} ref={ref} />
                                </div>
                                <div className="flex flex-col space-y-4">
                                    <label className="text-gray-800 dark:text-gray-200">Image</label>
                                    <input type="file" className="border border-gray-200 dark:border-gray-800 rounded-lg p-2" onChange={onImageChange} accept="image/*" ref={ref} />
                                </div>
                                <button className="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                                    Save
                                </button>
                            </div>

                        )
                    case Status.LOADING:
                        return (
                            <div className="flex flex-col space-y-4 my-4">
                                <Alert>
                                    <AlertTitle>
                                        Loading...
                                    </AlertTitle>
                                    <AlertDescription>
                                        Please wait while we save the data
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )
                    case Status.SUCCESS:
                        return (
                            <div className="flex flex-col space-y-4 my-4">
                                <Alert>
                                    <AlertTitle>
                                        Success
                                    </AlertTitle>
                                    <AlertDescription>
                                        Data saved successfully
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )
                    case Status.ERROR:
                        return (
                            <div className="flex flex-col space-y-4 my-4">
                                <Alert variant={'destructive'}>
                                    <AlertTitle>
                                        Error
                                    </AlertTitle>
                                    <AlertDescription>
                                        Failed to save data
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )
                    default:
                        return null
                }
            })()}


        </form>
    )
}
// loading ? (
//     <Alert>
//         <AlertTitle>
//             Loading...
//         </AlertTitle>
//         <AlertDescription>
//             Please wait while we save the data
//         </AlertDescription>
//     </Alert>
// ) : <div className="flex flex-col space-y-4 my-4">
//     <div className="flex flex-col space-y-4">
//         <label className="text-gray-800 dark:text-gray-200">Client</label>
//         <select className="border border-gray-200 dark:border-gray-800 rounded-lg p-2" onChange={onSelectedClient}>
//             <option value="">Select a client</option>
//             {clients.map((client) => {
//                 return <option key={client.id} value={client.id}>{client.client_name}</option>
//             })}
//         </select>
//     </div>
//     <div className="flex flex-col space-y-4">

//         <HoverCard>
//             <HoverCardTrigger className="flex items-center">

//                 <label className="text-gray-800 dark:text-gray-200 mr-2">
//                     Identifier (Optional)
//                 </label>
//                 <FaQuestionCircle className="text-gray-800 dark:text-gray-200 ml-2" />

//             </HoverCardTrigger>
//             <HoverCardContent>
//                 <p className="text-gray-800 dark:text-gray-200">
//                     Identifier is a unique value that can be used to identify a face. If you don't provide an identifier, a random identifier will be generated.
//                 </p>
//             </HoverCardContent>
//         </HoverCard>
//         <input className="border border-gray-200 dark:border-gray-800 rounded-lg p-2" onChange={onIdentifierChange} ref={ref} />
//     </div>
//     <div className="flex flex-col space-y-4">
//         <label className="text-gray-800 dark:text-gray-200">Name</label>
//         <input type="text" className="border border-gray-200 dark:border-gray-800 rounded-lg p-2" onChange={onNameChange} ref={ref} />
//     </div>
//     <div className="flex flex-col space-y-4">
//         <label className="text-gray-800 dark:text-gray-200">Image</label>
//         <input type="file" className="border border-gray-200 dark:border-gray-800 rounded-lg p-2" onChange={onImageChange} accept="image/*" ref={ref} />
//     </div>
//     <button className="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
//         Save
//     </button>
// </div>

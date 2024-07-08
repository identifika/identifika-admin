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
import { API_URL } from "@/constants/url_constant"

enum Status {
    IDLE,
    LOADING,
    SUCCESS,
    ERROR,
}

type AddFaceFormProps = {
    clientId?: any,
    faceId?: any,
    name?: any,
    clientName?: any,
}

async function fetchClients() {
    const res = await fetch(
        `${API_URL}/api/clients`,
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
    const [identifier, setIdentifier] = useState<any>('')
    const [name, setName] = useState<any>('')
    const [image, setImage] = useState<File | null>(null)
    const [status, setStatus] = useState<Status>(Status.IDLE)
    const [message, setMessage] = useState<string>('')

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
        if (props.faceId !== undefined && props.faceId !== null) {
            setIdentifier(props.faceId)
        }
        if (props.name !== undefined && props.name !== null) {
            setName(props.name)
        }
        if (props.clientId !== undefined && props.clientId !== null) {
            setSelectedClient(props.clientId)
        }

    }, [])

    const validateForm = () => {
        if (!selectedClient) {
            setMessage('Please select a client');
            return false;
        }

        if (!name) {
            setMessage('Please enter a name');
            return false;
        }

        if (props.faceId === undefined || props.faceId === null) {
            if (!image) {
                setMessage('Please select an image');
                return false;
            }
        }

        return true;
    };

    const createFormData = () => {
        const formData = new FormData();
        formData.append('client_id', selectedClient);
        if (identifier) {
            formData.append('identifier', identifier);
        }
        formData.append('real_name', name);
        if (image) {
            formData.append('image', image as Blob);
        }
        return formData;
    };

    const fetchFaceData = async (formData: FormData) => {
        const url = props.faceId
            ? `${API_URL}/api/faces/${props.faceId}`
            : `${API_URL}/api/faces`;
        const method = props.faceId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method: method,
            body: formData,
        });

        if (!res.ok) {
            throw new Error('Failed to fetch');
        }

        return res.json();
    };

    const onSaveClick = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setStatus(Status.LOADING);

        try {
            const formData = createFormData();
            const data = await fetchFaceData(formData);
            setStatus(Status.SUCCESS);
            return data;
        } catch (error) {
            setStatus(Status.ERROR);
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
    };


    return (
        <form onSubmit={onSaveClick}>
            {(() => {
                switch (status) {
                    case Status.IDLE:
                        return (
                            <div className="flex flex-col space-y-4 my-4">
                                <div className="flex flex-col space-y-4">
                                    <label className="text-gray-800 dark:text-gray-200">Client</label>
                                    {
                                        props.clientId !== undefined && props.clientId !== null ? (
                                            <input type="text" className="border border-gray-200 dark:border-gray-800 rounded-lg p-2" value={props.clientName} disabled />
                                        ) : (
                                            <select className="border border-gray-200 dark:border-gray-800 rounded-lg p-2" onChange={onSelectedClient}>
                                                <option value="">Select a client</option>
                                                {clients.map((client) => {
                                                    return <option key={client.id} value={client.id}>{client.client_name}</option>
                                                })}
                                            </select>
                                        )
                                    }
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
                                    <input className="border border-gray-200 dark:border-gray-800 rounded-lg p-2" onChange={onIdentifierChange} ref={ref} value={identifier} disabled={props.faceId !== undefined && props.faceId !== null} />
                                </div>
                                <div className="flex flex-col space-y-4">
                                    <label className="text-gray-800 dark:text-gray-200">Name</label>
                                    <input type="text" className="border border-gray-200 dark:border-gray-800 rounded-lg p-2" onChange={onNameChange} ref={ref} value={name} />
                                </div>
                                <div className="flex flex-col space-y-4">
                                    <label className="text-gray-800 dark:text-gray-200">Image</label>
                                    <input type="file" className="border border-gray-200 dark:border-gray-800 rounded-lg p-2" onChange={onImageChange} accept="image/*" ref={ref} />
                                </div>
                                {
                                    message && (
                                        <Alert variant={'destructive'}>
                                            <AlertTitle>
                                                Error
                                            </AlertTitle>
                                            <AlertDescription>
                                                {message}
                                            </AlertDescription>
                                        </Alert>
                                    )
                                }
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
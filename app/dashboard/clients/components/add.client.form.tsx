import { useState, useRef, useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type AddClientProps = {
    clientId?: string
}

enum Status {
    IDLE,
    LOADING,
    SUCCESS,
    ERROR,
}

async function fetchRecognitionType() {
    const res = await fetch(
        `http://localhost:3000/api/recognition_type`,
    )
    if (!res.ok) {
        return {
            data: [],
        }
    }
    const data = await res.json()

    return data
}


export default function AddClientForm(props: AddClientProps) {
    const [recognition_types, setRecognitionTypes] = useState<any[]>([])
    const [selectedRecognitionType, setSelectedRecognitionType] = useState<any>(null)
    const [status, setStatus] = useState<Status>(Status.IDLE)
    const [clientName, setClientName] = useState<string>('')


    useEffect(() => {
        fetchRecognitionType().then((data) => {
            setRecognitionTypes(data.data)
        })
    }, [])

    const onClientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClientName(e.target.value)
    }

    const onSelectedClient = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const rType = recognition_types.find((client) => client.id === e.target.value)
        setSelectedRecognitionType(rType)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!selectedRecognitionType) {
            console.error('Recognition Type is required')
            return
        }

        setStatus(Status.LOADING)

        try {

            let formData = new FormData();
            formData.append('recognition_type', selectedRecognitionType.id);
            formData.append('client_name', clientName);

            const res = await fetch(
                `http://localhost:3000/api/clients`,
                {
                    method: 'POST',
                    body: formData,
                }
            )
            if (!res.ok) {
                setStatus(Status.ERROR)
                return
            }
            setStatus(Status.SUCCESS)
        } catch (error) {
            console.error('An error occurred:', error)
            setStatus(Status.ERROR)
        }
    }


    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4 my-4">
                {(() => {
                    switch (status) {
                        case Status.IDLE:
                            return (
                                <>
                                    <div className="flex flex-col space-y-4">
                                        <label className="text-gray-800 dark:text-gray-200">Client</label>
                                        <select className="border border-gray-200 dark:border-gray-800 rounded-lg p-2" onChange={onSelectedClient}>
                                            <option value="">Select a Recognition Type</option>
                                            {recognition_types.map((client) => {
                                                return <option key={client.id} value={client.id}>{client.recognition_type}</option>
                                            })}
                                        </select>
                                    </div>
                                    <div className="flex flex-col space-y-4">
                                        <label className="text-gray-800 dark:text-gray-200">Client Name</label>
                                        <input type="text" className="border border-gray-200 dark:border-gray-800 rounded-lg p-2" onChange={onClientNameChange} />
                                    </div>

                                    <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500">
                                        Add Client
                                    </button>
                                </>
                            )
                        case Status.LOADING:
                            return <Alert>
                                <AlertTitle>
                                    Loading...
                                </AlertTitle>
                                <AlertDescription>
                                    Please wait while we save the data
                                </AlertDescription>
                            </Alert>
                        case Status.SUCCESS:
                            return <Alert>
                                <AlertTitle>
                                    Success
                                </AlertTitle>
                                <AlertDescription>
                                    Client added successfully
                                </AlertDescription>
                            </Alert>
                        case Status.ERROR:
                            return <Alert>
                                <AlertTitle>
                                    Error
                                </AlertTitle>
                                <AlertDescription>
                                    Failed to add client
                                </AlertDescription>
                            </Alert>
                        default:
                            return null
                    }
                })()}
            </div>
        </form>
    )
}
import { useState, useRef, useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { API_URL } from '@/constants/url_constant'

type ImportFaceProps = {
    clientId?: string
}

enum Status {
    IDLE,
    LOADING,
    SUCCESS,
    ERROR,
}

async function fetchClients() {
    const res = await fetch(
        `${API_URL}/api/clients`,
    )
    if (!res.ok) {
        return {
            data: [],
        }
    }
    const data = await res.json()

    return data
}


export default function ImportFaceForm(props: ImportFaceProps) {
    const [clients, setClients] = useState<any[]>([])
    const [selectedClient, setSelectedClient] = useState<any>(null)
    const [file, setFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [status, setStatus] = useState<Status>(Status.IDLE)


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            setFile(files[0])
        }
    }

    const onSelectedClient = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const client = clients.find((client) => client.id === e.target.value)
        setSelectedClient(client)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!selectedClient) {
            console.error('Client is required')
            return
        }

        if (!file) {
            console.error('File is required')
            return
        }

        const data = new FormData()
        data.append('excel_file', file as Blob)
        data.append('client_id', selectedClient.id)

        try {
            setStatus(Status.LOADING)
            const res = await fetch(`${API_URL}/api/faces/import`, {
                method: 'POST',
                body: data
            })
            setStatus(res.ok ? Status.SUCCESS : Status.ERROR)
            if (res.ok) {
                console.log('Imported successfully')
            } else {
                console.error('Failed to import')
            }
        } catch (error) {
            setStatus(Status.ERROR)
            console.error(error)
        }
    }

    useEffect(() => {
        fetchClients().then((data) => {
            setClients(data.data)
        })
    }, [])


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
                                            <option value="">Select a client</option>
                                            {clients.map((client) => {
                                                return <option key={client.id} value={client.id}>{client.client_name}</option>
                                            })}
                                        </select>
                                    </div>
                                    <div className="flex flex-col space-y-4">
                                        <label className="text-gray-800 dark:text-gray-200">File</label>
                                        <input type="file" className="border border-gray-200 dark:border-gray-800 rounded-lg p-2" ref={fileInputRef} onChange={handleFileChange} accept='xlsx' />
                                    </div>
                                    <button type="submit">Import</button>
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
                                    Your data has been imported in background. You can check the status in the logs.
                                </AlertDescription>
                            </Alert>
                        case Status.ERROR:
                            return <Alert>
                                <AlertTitle>
                                    Error
                                </AlertTitle>
                                <AlertDescription>
                                    Failed to import
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
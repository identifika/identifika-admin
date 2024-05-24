import { useState, useEffect } from "react"

type EditClientProps = {
    clientId?: string,
    clientName?: string,
}

enum Status {
    IDLE,
    LOADING,
    SUCCESS,
    ERROR,
}

export default function EditClientForm(props: EditClientProps) {
    const [clientName, setClientName] = useState<string>('')
    const [status, setStatus] = useState<Status>(Status.IDLE)

    useEffect(() => {
        if (props.clientName) {
            setClientName(props.clientName)
        }
    }, [props.clientName])

    const onClientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClientName(e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setStatus(Status.LOADING)

        try {
            const formData = new FormData()
            formData.append('client_name', clientName)
            const res = await fetch('http://localhost:3000/api/clients/' + props.clientId, {
                method: 'PUT',
                body: formData,
            })

            if (res.status === 200) {
                setStatus(Status.SUCCESS)
            } else {
                setStatus(Status.ERROR)
            }
        } catch (error) {
            console.error(error)
            setStatus(Status.ERROR)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4">
                <label htmlFor="client_name" className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Client Name
                </label>
                <input
                    id="client_name"
                    type="text"
                    value={clientName}
                    onChange={onClientNameChange}
                    className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg"
                >
                    Save
                </button>
                {status === Status.SUCCESS && (
                    <span className="text-green-500">Client updated successfully</span>
                )}
                {status === Status.ERROR && (
                    <span className="text-red-500">Failed to update client</span>
                )}
            </div>
        </form>
    )
}
'use client'
import { set } from "date-fns"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"

type DetailLogsProps = {
    taskId: string
}

enum Status {
    IDLE,
    LOADING,
    SUCCESS,
    ERROR,
}

async function fetchTaskLogs(taskId: string) {
    try {
        const res = await fetch(`http://localhost:3000/api/queue_task/${taskId}`)
        const data = await res.json()
        return data
    }
    catch (error) {
        console.error(error)
        return null
    }
}

async function fetchBulkRegisterStatus(taskId: string) {
    try {
        const res = await fetch(`http://localhost:3000/api/queue_task/${taskId}/status_bulk`)
        const data = await res.json()
        return data
    }
    catch (error) {
        console.error(error)
        return null
    }

}

export default function DetailLogsPage() {
    const { taskId } = useParams()
    const [status, setStatus] = useState<Status>(Status.IDLE)
    const [task, setTask] = useState({
        id: '',
        task_name: '',
        task_id: '',
        status: '',
        created_at: '',
        csv_error_file: '',
        message: '',
        client_id: '',
        client: {
            client_name: ''
        },
        user_id: '',
        user: {
            name: '',
            email: ''
        }
    })

    function downloadUrlMaker(url: string): string {
        const data = url.split('/')
        const filename = data[data.length - 1]
        return `http://127.0.0.1:8000/error_bulk_import/${filename}`
    }

    async function refresher() {
        setStatus(Status.LOADING)
        await Promise.all([
            fetchBulkRegisterStatus(taskId.toString()),
            fetchTaskLogs(taskId.toString()).then(data => {
                setTask(data.data)
            }),

        ]);
        setStatus(Status.IDLE)
    }

    useEffect(() => {
        setStatus(Status.LOADING)

        fetchTaskLogs(taskId.toString()).then(data => {
            setTask(data.data)
        })
        setStatus(Status.IDLE)
    }, [])


    if (status === Status.LOADING) {
        return (
            <div className="flex flex-col space-y-4">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 py-4">
                    Logs Detail
                </h1>
                <p className="text-gray-800 dark:text-gray-200">
                    Loading...
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 py-4">
                Logs Detail
            </h1>

            <div className="flex flex-col space-y-4">
                {/* add container with border */}
                <div className="border p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-800 dark:text-gray-200 font-semibold">Task Name</p>
                            <p className="text-gray-800 dark:text-gray-200">{task.task_name}</p>
                        </div>
                        <div>
                            <p className="text-gray-800 dark:text-gray-200 font-semibold">Task ID</p>
                            <p className="text-gray-800 dark:text-gray-200">{task.task_id}</p>
                        </div>
                        <div>
                            <p className="text-gray-800 dark:text-gray-200 font-semibold">Status</p>
                            <p className="text-gray-800 dark:text-gray-200">{task.status}</p>
                        </div>
                        <div>
                            <p className="text-gray-800 dark:text-gray-200 font-semibold">Created At</p>
                            <p className="text-gray-800 dark:text-gray-200">{new Date(task.created_at).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-gray-800 dark:text-gray-200 font-semibold">Client Name</p>
                            <p className="text-gray-800 dark:text-gray-200">{task.client.client_name}</p>
                        </div>
                        <div>
                            <p className="text-gray-800 dark:text-gray-200 font-semibold">User Name</p>
                            <p className="text-gray-800 dark:text-gray-200">{task.user.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-800 dark:text-gray-200 font-semibold">User Email</p>
                            <p className="text-gray-800 dark:text-gray-200">{task.user.email}</p>
                        </div>
                        <div>
                            <p className="text-gray-800 dark:text-gray-200 font-semibold">Message</p>
                            <p className="text-gray-800 dark:text-gray-200">{task.message}</p>
                        </div>
                    </div>
                </div>
                <div className="border p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-2">
                            <p className="text-gray-800 dark:text-gray-200 font-semibold">CSV Error File</p>
                        </div>
                        {/* download button */}
                        {
                            task.csv_error_file && (
                                <div className="flex justify-end">
                                    <a href={downloadUrlMaker(task.csv_error_file)} target="_blank">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                            Download
                                        </button>
                                    </a>
                                </div>
                            )
                        }
                    </div>
                </div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={refresher}>
                    Refresh
                </button>
            </div>
        </div>
    )
}
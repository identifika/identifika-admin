'use client';

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type DeleteClientDialogProps = {
    clientId: string;
}

enum Status {
    IDLE,
    LOADING,
    SUCCESS,
    ERROR,
}

export default function DeleteClientDialog(props: DeleteClientDialogProps) {
    const [status, setStatus] = useState<Status>(Status.IDLE);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const onDelete = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus(Status.LOADING);
        const res = await fetch(`http://localhost:3000/api/clients/${props.clientId}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            setError('Failed to delete client');
            setStatus(Status.ERROR);
            return;
        } else {
            setStatus(Status.SUCCESS);
            router.back();
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-red-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-red-600 dark:hover:bg-red-500 dark:bg-red-600 ml-2" >
                    Delete
                </button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={onDelete}>
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="client_name" className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                            Are you sure you want to delete this client? All data that belongs to this client will be deleted.
                        </label>
                        <button
                            type="submit"
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                        >
                            Delete
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
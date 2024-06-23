
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { API_URL } from "@/constants/url_constant";
import { useState } from "react";
import { TbTrash } from "react-icons/tb";

enum Status {
    IDLE,
    LOADING,
    SUCCESS,
    ERROR,
}


type DeleteFaceDialogProps = {
    faceId: string;
    clientId: string;
    afterDelete?: () => void;
}


export default function DeleteFaceDialog(props: DeleteFaceDialogProps) {
    const [status, setStatus] = useState<Status>(Status.IDLE);
    const [error, setError] = useState<string | null>(null);

    const onDelete = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus(Status.LOADING);
        const formData = new FormData();
        formData.append('client_id', props.clientId);
        const res = await fetch(`${API_URL}/api/faces/${props.faceId}`, {
            method: 'DELETE',
            body: formData,
        });
        if (!res.ok) {
            setError('Failed to delete face');
            setStatus(Status.ERROR);
            return;
        }
        setStatus(Status.SUCCESS);
    }

    return (
        <Dialog onOpenChange={() => {
            if (status === Status.SUCCESS) {
                props.afterDelete && props.afterDelete();
            }
        }}>
            <DialogTrigger asChild>
                <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-red-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-red-600 dark:hover:bg-red-500 dark:bg-red-600" >
                    <TbTrash className="w-5 h-5" />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader >
                    <DialogTitle>
                        Delete Face
                    </DialogTitle>
                </DialogHeader>
                <div>
                    {
                        status === Status.ERROR && (
                            <div className="text-red-500">
                                {error}
                            </div>
                        )
                    }
                    {
                        status === Status.SUCCESS && (
                            <div className="text-green-500">
                                Face deleted successfully
                            </div>
                        )
                    }
                    {
                        status === Status.IDLE && (
                            <form onSubmit={onDelete}>
                                <div className="flex flex-col space-y-4">
                                    <label htmlFor="client_name" className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Are you sure you want to delete this face? All data that belongs to this face will be deleted.
                                    </label>
                                    <button
                                        type="submit"
                                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </form>
                        )
                    }
                    {
                        status === Status.LOADING && (
                            <div className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600 mt-4">
                                <span>Deleting Face...</span>
                            </div>
                        )
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}
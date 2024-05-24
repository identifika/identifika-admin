import { DialogHeader, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { IoTrash } from "react-icons/io5";

enum Status {
    IDLE,
    LOADING,
    SUCCESS,
    ERROR,
}

async function revokeExternalToken(
    clientId: string,
    token: string,
) {
    const formData = new FormData();
    formData.append('client_id', clientId);
    formData.append('token', token);

    const res = await fetch(`http://localhost:3000/api/clients/token/revoke?clientId=${clientId}`, {
        method: 'PUT',
        body: formData,
    });

    if (!res.ok) {
        return {
            status: 'error',
            message: 'Failed to revoke token'
        };
    }

    return res.json();
}

type GenerateTokenDialogProps = {
    clientId: string;
    token: string;
    afterGenerate?: () => void;
}

export default function RevokeTokenDialog(props: GenerateTokenDialogProps) {

    const [status, setStatus] = useState<Status>(Status.IDLE);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);


    const onsubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus(Status.LOADING);
        const res = await revokeExternalToken(props.clientId, props.token);
        if (res.status === 'error') {
            setError(res.message);
            setStatus(Status.ERROR);
            return;
        } else {
            setStatus(Status.SUCCESS);
        }
    }

    return (
        <Dialog onOpenChange={(open) => {
            if (!open) {
                setStatus(Status.IDLE);
                if (props.afterGenerate) {
                    props.afterGenerate();
                }
            }
        }}>
            <DialogTrigger asChild>
                <div className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-red-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-red-600 dark:hover:bg-red-500 dark:bg-red-600" >
                    <IoTrash className="w-5 h-5" />
                    <span>Revoke Token</span>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader >
                    <DialogTitle>
                        Revoke Access Token
                    </DialogTitle>
                </DialogHeader>
                <div className="max-w-md w-full space-y-4">
                    <DialogDescription>
                        Are you sure you want to revoke the access token?
                    </DialogDescription>
                    {
                        (() => {
                            switch (status) {
                                case Status.IDLE:
                                    return (
                                        <form onSubmit={onsubmit}>
                                            <div className="flex flex-col gap-4 mt-4">
                                                {/* button */}
                                                <button className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-red-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-red-600 dark:hover:bg-red-500 dark:bg-red-600">
                                                    <IoTrash className="w-5 h-5" />
                                                    <span>Revoke Token</span>
                                                </button>
                                            </div>

                                        </form>
                                    )
                                case Status.LOADING:
                                    return (
                                        <div className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600 mt-4">
                                            <span>Revoking Token...</span>
                                        </div>
                                    )
                                case Status.SUCCESS:
                                    return (
                                        <div className="flex flex-col gap-4 mt-4 max-w-md">
                                            <div className="flex flex-col space-y-2">
                                                <div>
                                                    <span className="text-gray-800 dark:text-gray-200">Token revoked successfully</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                case Status.ERROR:
                                    return (
                                        <div className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-red-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-red-600 dark:hover:bg-red-500 dark:bg-red-600 mt-4">
                                            <span>{error}</span>
                                        </div>
                                    )
                            }
                        })()
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}
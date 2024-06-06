'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { IoAddCircle, IoClose } from "react-icons/io5";
import { IoCopy } from "react-icons/io5";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner"
import { API_URL } from "@/constants/url_constant";

enum Status {
    IDLE,
    LOADING,
    SUCCESS,
    ERROR,
}

async function generateExternalToken(
    clientId: string
) {
    const formData = new FormData();
    formData.append('client_id', clientId);

    const res = await fetch(`${API_URL}/api/clients/token`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        return {
            status: 'error',
            message: 'Failed to generate token'
        };
    }

    return res.json();
}

type GenerateTokenDialogProps = {
    clientId: string;
    afterGenerate?: () => void;
}

export default function GenerateTokenDialog(props: GenerateTokenDialogProps) {

    const [status, setStatus] = useState<Status>(Status.IDLE);
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);


    const onsubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus(Status.LOADING);
        const res = await generateExternalToken(props.clientId);
        if (res.status === 'error') {
            setError(res.message);
            setStatus(Status.ERROR);
            return;
        }
        setToken(res.data.result);
        setStatus(Status.SUCCESS);
    }

    const onCopy = () => {
        if (token) {
            navigator.clipboard.writeText(token);
            toast('Token copied to clipboard');
        }
    }

    return (
        <Dialog onOpenChange={(open) => {
            if (!open) {
                setStatus(Status.IDLE);
                setToken(null);
                setError(null);
                if (props.afterGenerate) {
                    props.afterGenerate();
                }
            }
        }}>
            <DialogTrigger asChild>
                <div className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600" >
                    <IoAddCircle className="w-5 h-5" />
                    <span>Generate Token</span>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader >
                    <DialogTitle>
                        Generate Access Token
                    </DialogTitle>
                </DialogHeader>
                <div className="max-w-md w-full space-y-4">
                    <DialogDescription>
                        You can generate an access token for this client. This token will be used to authenticate the client when you make requests to the API.
                    </DialogDescription>
                    {
                        (() => {
                            switch (status) {
                                case Status.IDLE:
                                    return (
                                        <form onSubmit={onsubmit}>
                                            <div className="flex flex-col gap-4 mt-4">
                                                {/* button */}
                                                <button className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                                                    <IoAddCircle className="w-5 h-5" />
                                                    <span>Generate Token</span>
                                                </button>
                                            </div>

                                        </form>
                                    )
                                case Status.LOADING:
                                    return (
                                        <div className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600 mt-4">
                                            <span>Generating Token...</span>
                                        </div>
                                    )
                                case Status.SUCCESS:
                                    return (
                                        <div className="flex flex-col gap-4 mt-4 max-w-md">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">Your token has been generated successfully. You can copy it below <br/>{token}</p>

                                            <div onClick={onCopy}
                                            className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-green-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-green-600 dark:hover:bg-green-500 dark:bg-green-600 mt-4">
                                                <IoCopy className="w-5 h-5" />
                                                <span >Copy Token</span>
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
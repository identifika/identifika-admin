'use client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { API_URL } from "@/constants/url_constant";
import clsx from "clsx";
import { useState } from "react";

enum Status {
    IDLE,
    LOADING,
    SUCCESS,
    ERROR,
}

type Props = {
    isActive: boolean;
    userId: string;
    onStatusChange?: () => void;
}

async function changeStatus(isActive: boolean, userId: string) {
    try {
        const formData = new FormData();
        formData.append('active', isActive.toString());

        const res = await fetch(`${API_URL}/api/users/${userId}`, {
            method: 'PUT',
            body: formData,
        });
        if (res.status === 200) {
            return {
                status: 'success',
                message: 'User status changed successfully',
            };
        } else {
            return {
                status: 'error',
                message: 'Failed to change user status',
            };
        }
    } catch (error) {
        console.error(error);
        return {
            status: 'error',
            message: 'Failed to change user status',
        };
    }
}

export default function DialogActive(props: Props) {

    const [status, setStatus] = useState<Status>(Status.IDLE);

    const onsubmit = async () => {
        setStatus(Status.LOADING);
        const res = await changeStatus(!props.isActive, props.userId);
        if (res.status === 'error') {
            setStatus(Status.ERROR);
            return;
        }
        setStatus(Status.SUCCESS);
    }


    return (
        <Dialog onOpenChange={(open) => {
            if (!open) {
                setStatus(Status.IDLE);
                if (props.onStatusChange) {
                    props.onStatusChange();
                }
            }
        }}>
            <DialogTrigger asChild>
                <div className={
                    clsx(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        {
                            "bg-green-100 text-green-800": props.isActive === true,
                            "bg-red-100 text-red-800": props.isActive === false,
                        }
                    )
                }>
                    {props.isActive === true ? "Confirmed" : "Unconfirmed"}
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Change Status
                    </DialogTitle>
                </DialogHeader>
                {
                    status === Status.IDLE && (
                        <div className="flex flex-col space-y-4">
                            <DialogDescription>
                                You can change the status of the user
                            </DialogDescription>
                            <div className="flex flex-col gap-4 mt-4">
                                <button className={
                                    clsx(
                                        'flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 rounded-lg shrink-0 sm:w-auto gap-x-2',
                                        props.isActive ? 'bg-red-500 hover:bg-red-600 dark:hover:bg-red-500 dark:bg-red-600' : 'bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600'
                                    )
                                } onClick={onsubmit}>
                                    {props.isActive ? 'Unconfirm' : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    )
                }
                {
                    status === Status.LOADING && (
                        <div className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                            <span>Changing status...</span>
                        </div>
                    )
                }
                {
                    status === Status.SUCCESS && (
                        <div className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-green-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-green-600 dark:hover:bg-green-500 dark:bg-green-600">
                            <span>Status changed successfully</span>
                        </div>
                    )
                }
                {
                    status === Status.ERROR && (
                        <div className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-red-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-red-600 dark:hover:bg-red-500 dark:bg-red-600">
                            <span>Failed to change status</span>
                        </div>
                    )
                }
            </DialogContent>
        </Dialog>
    )
}
'use client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import clsx from "clsx";
import { useState } from "react";

enum Status {
    IDLE,
    LOADING,
    SUCCESS,
    ERROR,
}

type Props = {
    role: string;
    userId: string;
    onStatusChange?: () => void;
}

async function changeRole(role: string, userId: string) {
    try {
        const formData = new FormData();
        formData.append('role', role);

        const res = await fetch('http://localhost:3000/api/users/' + userId, {
            method: 'PUT',
            body: formData,
        });
        if (res.status === 200) {
            return {
                status: 'success',
                message: 'User role changed successfully',
            };
        } else {
            return {
                status: 'error',
                message: 'Failed to change user role',
            };
        }
    } catch (error) {
        console.error(error);
        return {
            status: 'error',
            message: 'Failed to change user role',
        };
    }
}

export default function DialogChangeRole(props: Props) {
    const [status, setStatus] = useState<Status>(Status.IDLE);
    const [role, setRole] = useState<string>(props.role);

    const onsubmit = async () => {
        setStatus(Status.LOADING);
        const res = await changeRole(role, props.userId);
        if (res.status === 'error') {
            setStatus(Status.ERROR);
            return;
        }
        setStatus(Status.SUCCESS);
    }

    const upperCaseFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
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
                <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
                    {upperCaseFirstLetter(props.role)}
                </span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Active
                    </DialogTitle>
                </DialogHeader>
                {
                    status === Status.IDLE && (
                        <div className="flex flex-col space-y-4">
                            <DialogDescription>
                                You can change the role of the user
                            </DialogDescription>
                            <form onSubmit={onsubmit} className="flex flex-col space-y-4">
                                <select
                                    name="role"
                                    id="role"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:border-gray-700 dark:focus:border-blue-500 dark:focus:ring-blue-600"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                                <button
                                    type="submit"
                                    className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600"
                                >
                                    Change Role
                                </button>
                            </form>

                        </div>
                    )
                }
                {
                    status === Status.LOADING && (
                        <div className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                            <span>Changing role...</span>
                        </div>
                    )
                }
                {
                    status === Status.SUCCESS && (
                        <div className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-green-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-green-600 dark:hover:bg-green-500 dark:bg-green-600">
                            <span>Role changed successfully</span>
                        </div>
                    )
                }
                {
                    status === Status.ERROR && (
                        <div className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-red-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-red-600 dark:hover:bg-red-500 dark:bg-red-600">
                            <span>Failed to change role</span>
                        </div>
                    )
                }
            </DialogContent>
        </Dialog>
    )
}
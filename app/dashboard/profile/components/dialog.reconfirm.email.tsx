import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { API_URL } from "@/constants/url_constant";
import { XCircleIcon } from "lucide-react";
import { useState } from "react";

enum Status {
    IDLE,
    LOADING,
    SUCCESS,
    ERROR,
}

type Props = {
    email: string;
    onStatusChange?: () => void;
}

async function reconfirmEmail() {
    try {
        const res = await fetch(`${API_URL}/api/profile/confirm_email`, {
            method: 'POST',
        });
        if (res.status === 200) {
            return {
                status: 'success',
                message: 'Email sent successfully',
            };
        } else {
            return {
                status: 'error',
                message: 'Failed to send email',
            };
        }
    } catch (error) {
        console.error(error);
        return {
            status: 'error',
            message: 'Failed to send email',
        };
    }
}

export default function DialogReconfirmEmail(props: Props) {
    const [status, setStatus] = useState<Status>(Status.IDLE);

    const onsubmit = async () => {
        setStatus(Status.LOADING);
        const res = await reconfirmEmail();
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
            setStatus(Status.IDLE);
            if (open) {
                props.onStatusChange && props.onStatusChange();
            }
        }}>
            <DialogTrigger asChild>
                <div className="flex items-center justify-center px-2 py-1 mt-2 text-xs text-red-500 bg-red-100 rounded-full">
                    <XCircleIcon className="w-3 h-3 mr-1" />
                    Email Not Confirmed
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Reconfirm Email
                    </DialogTitle>
                </DialogHeader>
                {
                    status === Status.IDLE && (
                        <div className="flex flex-col space-y-4">
                            <DialogDescription>
                                You can reconfirm the email of the user
                            </DialogDescription>
                            <div className="flex flex-col gap-4 mt-4">
                                <button onClick={onsubmit} className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                                    Reconfirm Email
                                </button>
                            </div>

                        </div>
                    )
                }
                {
                    status === Status.LOADING && (
                        <div className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                            <span>Sending email...</span>
                        </div>
                    )
                }
                {
                    status === Status.SUCCESS && (
                        <div className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-green-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-green-600 dark:hover:bg-green-500 dark:bg-green-600">
                            <span>Email sent, check your inbox</span>
                        </div>
                    )
                }
                {
                    status === Status.ERROR && (
                        <div className="flex items-center justify-center w-1/2 px-2 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-red-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-red-600 dark:hover:bg-red-500 dark:bg-red-600">
                            <span>Falied to send email</span>
                        </div>
                    )
                }
            </DialogContent>
        </Dialog>
    )
}
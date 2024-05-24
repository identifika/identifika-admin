'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IoAddCircle, IoClose, IoPencil } from "react-icons/io5";
import EditClientForm from "./edit.client.form";

type EditClientProps = {
    clientId?: string,
    clientName?: string,
}

export default function EditClientDialog(props: EditClientProps) {

    return (
        <Dialog >
            <DialogTrigger asChild>
                <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600" >
                    <span>Edit Client</span>
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader >
                    <DialogTitle>
                        Edit Client
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <DialogDescription>
                        You can edit the client information
                    </DialogDescription>
                    <EditClientForm clientId={props.clientId} clientName={props.clientName} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IoAddCircle, IoClose, IoPencil } from "react-icons/io5";
import AddFaceForm from "./add.face.form";
import { TbEdit } from "react-icons/tb";

type AddFaceDialogProps = {
    faceId?: string;
    name?: string;
    clientId?: string;
    clientName?: string;
    afterSubmit: () => void;
}

export default function AddFaceDialog(props: AddFaceDialogProps) {

    return (
        <Dialog onOpenChange={(open) => {
            if (!open) {
                props.afterSubmit();
            }
        }}>
            <DialogTrigger asChild>
                <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600" >
                    {
                        props.faceId ? <TbEdit className="w-5 h-5" /> : <IoAddCircle className="w-5 h-5" />
                    }
                    {
                        props.faceId ? '' : 'Add Face'
                    }
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader >
                    <DialogTitle>
                        {props.faceId ? 'Edit' : 'Add'} Face
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <DialogDescription>
                        {props.faceId ? 'Edit' : 'Add'} Face
                    </DialogDescription>
                    <AddFaceForm faceId={props.faceId} name={props.name} clientId={props.clientId} clientName={props.clientName} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
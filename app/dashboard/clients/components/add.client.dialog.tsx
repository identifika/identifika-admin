'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IoAddCircle, IoClose } from "react-icons/io5";
import AddClientForm from "./add.client.form";
import { useState, useEffect } from "react";
import { API_URL } from "@/constants/url_constant";

export default function AddClientDialog({ afterSubmit: afterSubmit = () => { },  user: user}) {

    return (
        <Dialog onOpenChange={(open) => {
            if (!open) {
                afterSubmit();
            }
        }}>
            <DialogTrigger asChild>
                <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600" >
                    <IoAddCircle className="w-5 h-5" />
                    <span>Add Client</span>
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader >
                    <DialogTitle>
                        Add Client
                    </DialogTitle>
                </DialogHeader>
                <div>
                    {
                        (user && user.active) ?
                            <>

                                <DialogDescription>
                                    You can add a client by fill below form
                                </DialogDescription>
                                <AddClientForm />
                            </>
                            : <DialogDescription>
                                Please confirm your email address to add a client
                            </DialogDescription>
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}
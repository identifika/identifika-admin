import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AlertDialogTriggerProps } from "@radix-ui/react-alert-dialog"

type customDialogAlertProps = {
    message: string,
    trigger: AlertDialogTriggerProps
}

function customDialogAlert({ message, trigger }: customDialogAlertProps) {
    return (
        <AlertDialog>
            {trigger.children}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Alert</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>{message}</AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Ok</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default customDialogAlert

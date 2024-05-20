'use client'
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { userSchema } from "@/app/schemasValidations";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "http-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";


type FormSchema = z.infer<typeof userSchema>

export default function SignUpForm() {
    const router = useRouter()

    const form = useForm<FormSchema>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            email: '',
            name: '',
            password: ''
        }
    })

    const {
        reFetch: submitPost,
        loading: isSubmitting,
        response: data,
        error
    } = useFetch('/auth/register', {
        method: 'POST',
        auto: false,
        body: form.getValues(),
        onResolve() {
            router.replace('/signin')
            router.refresh()
        },
    })

    const onSubmit = form.handleSubmit(submitPost)

    return (
        <div className="absolute inset-0 flex items-center justify-center max-w-4xl flex items-center mx-auto md:h-screen p-4">
            <Card>
                <CardHeader>
                    <div className="flex justify-end">
                        <h6>Identifika.</h6>
                    </div>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                        Welcome to our registration page! Get started by creating your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form} >
                        {error && (
                            <Alert className='mb-4' variant='destructive'>
                                <AlertCircle className='h-4 w-4' />
                                <AlertTitle>{data.statusText}</AlertTitle>
                            </Alert>
                        )}

                        <form onSubmit={onSubmit} autoComplete="off">
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} autoComplete="off" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" autoComplete="new-password" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* <div className='flex justify-end'>
                                <Button disabled={isSubmitting} type='submit'>
                                    {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                                    Create Post
                                </Button>
                            </div> */}
                            <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                                Create an account
                            </Button>
                            <p className="text-sm mt-6 text-center">
                                Already have an account?{" "}
                                <Link
                                    href="/signin"
                                    className="text-blue-600 font-semibold hover:underline ml-1"
                                >
                                    Login here
                                </Link>
                            </p>
                        </form>
                    </Form>
                </CardContent>
            </Card>

        </div>

    )
}

{/* <form method="post" onSubmit={onSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input name="name" type="text" required placeholder="Enter name" ref={name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input name="email" type="email" required placeholder="Enter email" ref={email} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input name="password" type="password" required placeholder="Enter password" ref={password} />
                            </div>
                            {/* <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="remember-me" className="ml-3 text-sm">
                                    I accept the{" "}
                                    <a
                                        href="javascript:void(0);"
                                        className="text-blue-600 font-semibold hover:underline ml-1"
                                    >
                                        Terms and Conditions
                                    </a>
                                </label>
                            </div> */}
//     {!!props.error && (<p className="text-red-500 text-sm">
//         {props.error}
//     </p>
//     )}
//     <Button type="submit" className="w-full">
//         Create an account
//     </Button>
//     <p className="text-sm mt-6 text-center">
//         Already have an account?{" "}
//         <Link
//             href="/signin"
//             className="text-blue-600 font-semibold hover:underline ml-1"
//         >
//             Login here
//         </Link>
//     </p>
// </div >
// </form > 


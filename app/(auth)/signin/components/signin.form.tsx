'use client'
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { signIn } from "next-auth/react"
import { useRef } from "react"
import Link from "next/link"

type LoginPageProps = {
    error?: string,
    className?: string,
    callbackUrl?: string
}

export default function LoginPage(props: LoginPageProps) {
    const email = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const body = {
            email: email.current?.value,
            password: password.current?.value,
        }
        await signIn("credentials", {
            redirect: true,
            email: body.email,
            password: body.password,
            callbackUrl: props.callbackUrl ?? "/dashboard"
        })
    }

    function errorTranslation(error: string) {
        switch (error) {
            case "CredentialsSignin":
                return "Invalid email or password"
                break;
            default:
                return "An error occurred"
                break;
        }
    }

    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <Card className="mx-auto max-w-sm">
                <CardHeader className="space-y-1">
                    <div className="flex justify-end">
                        <h6>Identifika.</h6>
                    </div>
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <CardDescription>Enter your email and password to login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form method="post" onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" placeholder="your@email.com" required type="email" name="email" ref={email} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" required type="password" name="password" ref={password} />
                            </div>
                            {!!props.error && (<p className="text-red-500 text-sm">
                                {errorTranslation(props.error)}
                            </p>
                            )}
                            <Button className="w-full" type="submit" >
                                Sign In
                            </Button>
                            <p className="text-sm mt-6 text-center">
                                Don't have an account?{" "}
                                <Link
                                    href="/signup"
                                    className="text-blue-600 font-semibold hover:underline ml-1"
                                >
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

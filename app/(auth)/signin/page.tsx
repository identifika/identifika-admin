import LoginPage from "./components/signin.form";
import React from "react";

type Props = {
    searchParams?: Record<"callbackUrl"|"error", string>
}

export default function SignIn(props: Props) {
    return (
        <LoginPage error={props.searchParams?.error} callbackUrl={props.searchParams?.callbackUrl} />
    )
}
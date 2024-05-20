import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

        if (!token) {
            return NextResponse.json({
                'status': 'error',
                'message': 'Unauthorized'
            }, { status: 401 })
        }

        var eFaceApiKey = (token as { user: { token: string } })?.user?.token;

        const formData = await request.formData()

        const response = await fetch('http://127.0.0.1:8000/admin_bulk_register', {
            method: 'POST',
            body: formData,
            mode: 'cors',
            headers: {
                'e-face-api-key': eFaceApiKey,
            }
        });

        if (response.status !== 200) {
            var res = await response.json()
            return NextResponse.json({
                res
            }, { status: response.status })
        } else {
            return NextResponse.json({
                'status': 'success',
                'message': 'Face registration success'
            }, { status: 200 })
        }

    } catch (error) {
        console.error(error)
        return NextResponse.json({
            'status': 'error',
            'message': error
        }, { status: 500 })
    }
}

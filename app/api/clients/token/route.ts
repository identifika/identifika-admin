
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function POST(request: NextRequest) {
    try {
        var token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

        if (!token) {
            return NextResponse.json({
                'status': 'error',
                'message': 'Unauthorized'
            }, { status: 401 })
        }
        var eFaceApiKey = (token as { user: { token: string } })?.user?.token;

        const formData = await request.formData()

        const response = await fetch('http://127.0.0.1:8000/generate_external_token', 
        {
            method: 'POST',
            body: formData,
            headers: {
                'e-face-api-key': eFaceApiKey,
            }
        });

        if (response.status !== 200) {
            var res = await response.json()
            return NextResponse.json({
                res
            }, { status: response.status })
        }

        return NextResponse.json({
            'status': 'success',
            'data': await response.json()
        }, { status: 200 })


    } catch (error) {
        return NextResponse.json({
            'status': 'error',
            'message': error
        }, { status: 500 })
    }

}
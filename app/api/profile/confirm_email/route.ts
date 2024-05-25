import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

        if (!token) {
            return NextResponse.json({
                'status': 'error',
                'message': 'Unauthorized'
            }, { status: 401 })
        }

        var eFaceApiKey = (token as { user: { token: string } })?.user?.token;
        const baseIdentifikaUrl = process.env.IDENTIFIKA_API_URL

        const res = await fetch(
            `${baseIdentifikaUrl}/resend_email_confirmation`,
            {
                method: 'POST',
                headers: {
                    'e-face-api-key': eFaceApiKey,
                }
            }
        )

        if (res.status !== 200) {
            var response = await res.json()
            return NextResponse.json({
                'status': 'error',
                'message': response.message
            }, { status: 500 })
        }

        return NextResponse.json({
            'status': 'success',
            'message': 'Email confirmation has been sent successfully'
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            'status': 'error',
            'message': error.message
        }, { status: 500 })
    }
}
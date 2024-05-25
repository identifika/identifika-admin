import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {

    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const page = Number(searchParams.get('page')) || 1
        const limit = Number(searchParams.get('limit')) || 10

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
            `${baseIdentifikaUrl}/logs?page=${page}&limit=${limit}&filter=${search}`
            , {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'e-face-api-key': eFaceApiKey,
                }
            }
        )

        if (!res.ok) {
            return NextResponse.json({
                'status': 'error',
                'message': 'Unauthorized'
            }, { status: 401 })
        }
        if (res.status !== 200) {
            const data = await res.json()
            return NextResponse.json({
                'status': 'error',
                'message': data.message
            }, { status: res.status })
        } else {
            const data = await res.json()
            return NextResponse.json({
                'status': 'success',
                'data': data.data,
                'meta': data.meta,
            }, { status: 200 })
        }

    } catch (error) {
        return NextResponse.json({
            'status': 'error',
            'message': error.message
        }, { status: 500 })
    }

}
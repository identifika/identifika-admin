import { prisma } from "@/server"
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { taskId: string } }) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

        if (!token) {
            return NextResponse.json({
                'status': 'error',
                'message': 'Unauthorized'
            }, { status: 401 })
        }

        var eFaceApiKey = (token as { user: { token: string } })?.user?.token;

        const taskId = params.taskId

        const response = await fetch(`http://127.0.0.1:8000/admin_bulk_register/${taskId}`, {
            method: 'GET',
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
            var res = await response.json()
            return NextResponse.json({
                'status': 'success',
                'data': res.task_result,
            }, { status: 200 })
        }
    } catch (error) {
        return NextResponse.json({
            'status': 'error',
            'message': error.message
        }, { status: 500 })
    }
}
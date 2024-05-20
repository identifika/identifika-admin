import { prisma } from 'server'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = Number(searchParams.get('page')) || 1
        const limit = Number(searchParams.get('limit')) || 10

        var token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

        if (!token) {
            return NextResponse.json({
                'status': 'error',
                'message': 'Unauthorized'
            }, { status: 401 })
        }

        var role = (token as { user: { role: string } })?.user?.role;
        var userId = (token as { user: { _id: string } })?.user?._id;

        if (role === 'user') {
            const logs = await prisma.$transaction([
                prisma.queue_task.findMany({
                    where: {
                        user_id: userId,
                    },
                    select: {
                        id: true,
                        task_name: true,
                        status: true,
                        created_at: true,
                        task_id: true,
                        client: true,
                        user: true,
                        message:true,
                        csv_error_file: true,
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                }),
                prisma.queue_task.count({
                    where: {
                        user_id: userId,
                    }
                })
            ])

            const meta = {
                total: logs[1],
                page: page,
                limit: limit,
                totalPages: Math.ceil(logs[1] / limit)
            }

            return NextResponse.json({
                'status': 'success',
                'data': logs[0],
                'meta': meta
            }, { status: 200 })

        } else {
            const logs = await prisma.$transaction([
                prisma.queue_task.findMany({
                    select: {
                        id: true,
                        task_name: true,
                        status: true,
                        created_at: true,
                        task_id: true,
                        client: true,
                        user: true,
                        message:true,
                        csv_error_file: true,
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                }),
                prisma.queue_task.count({})
            ])

            const meta = {
                total: logs[1],
                page: page,
                limit: limit,
                totalPages: Math.ceil(logs[1] / limit)
            }

            return NextResponse.json({
                'status': 'success',
                'data': logs[0],
                'meta': meta
            }, { status: 200 })
        }
    } catch (error) {
        return NextResponse.json({
            'status': 'error',
            'message': error
        }, { status: 500 })
    }
}
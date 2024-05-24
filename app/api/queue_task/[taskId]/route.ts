import { prisma } from "@/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { taskId: string } }) {
    try {
        const taskId = params.taskId
        const faces = await prisma.queue_task.findFirst({
            where: {
                task_id: taskId
            },
            select: {
                id: true,
                task_name: true,
                task_id: true,
                status: true,
                created_at: true,
                csv_error_file: true,
                message: true,
                client_id: true,
                client: {
                    select: {
                        client_name: true,
                    }
                },
                user_id: true,
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
            }
        })

        return NextResponse.json({
            'status': 'success',
            'data': faces
        })
    } catch (error) {
        return NextResponse.json({
            'status': 'error',
            'message': error.message
        }, { status: 500 })
    }
}
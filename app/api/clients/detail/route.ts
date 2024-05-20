import { prisma } from 'server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id') || ''

        const client = await prisma.clients.findUnique({
            where: {
                id: id
            },
            select: {
                client_name: true,
                user_id: true,
                user: {
                    select: {
                        name: true,
                    }
                },
            }
        })

        return NextResponse.json({
            'status': 'success',
            'data': client,
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            'status': 'error',
            'message': error
        }, { status: 500 })
    }
}
import { prisma } from 'server'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const users = await prisma.users.count(
            {
                where: {
                    active: true,
                    role: 'user',
                }
            }
        )

        return NextResponse.json({
            'status': 'success',
            'data': users
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            'status': 'error',
            'message': error
        }, { status: 500 })
    }
}
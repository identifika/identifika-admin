
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'server'

export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const clientId = searchParams.get('clientId') || ''

        const data = await request.formData()
        const token = data.get('token') as string

        if (!token) {
            return NextResponse.json({
                'status': 'error',
                'message': 'Token is required'
            }, { status: 400 })
        }

        if (!clientId) {
            return NextResponse.json({
                'status': 'error',
                'message': 'Client ID is required'
            }, { status: 400 })
        }

        const client = await prisma.clients.findFirst({
            where: {
                external_token: token,
                id: clientId
            }
        })

        if (!client) {
            return NextResponse.json({
                'status': 'error',
                'message': 'Client not found'
            }, { status: 404 })
        }

        await prisma.clients.update({
            where: {
                id: client.id
            },
            data: {
                external_token: ''
            }
        })

        return NextResponse.json({
            'status': 'success',
            'message': 'Token revoked'
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            'status': 'error',
            'message': error
        }, { status: 500 })
    }

}
import { prisma } from 'server'
import { NextRequest, NextResponse, } from 'next/server'

export async function GET(request: Request, { params }: { params: { clientId: string } }) {
    try {
        const clientId = params.clientId
        const faces = await prisma.clients.findFirst({
            where: {
                id: clientId
            },
            select: {
                id: true,
                client_name: true,
                external_token: true,
                recognition_type: true,
                user_id: true,
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                _count: {
                    select: {
                        faces: true
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

export async function PUT(request: NextRequest, { params }: { params: { clientId: string } }) {
    try {
        const clientId = params.clientId
        const data = await request.formData()
        const client_name = data.get('client_name') as string

        if (!client_name) {
            return NextResponse.json({
                'status': 'error',
                'message': 'All fields are required'
            }, { status: 400 })
        }

        const client = await prisma.clients.findFirst({
            where: {
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
                client_name: client_name,
            }
        })

        return NextResponse.json({
            'status': 'success',
            'message': 'Client updated'
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            'status': 'error',
            'message': error
        }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { clientId: string } }) {
    try {
        const clientId = params.clientId

        const client = await prisma.clients.findFirst({
            where: {
                id: clientId
            }
        })

        if (!client) {
            return NextResponse.json({
                'status': 'error',
                'message': 'Client not found'
            }, { status: 404 })
        }

        var deleteTransaction = await prisma.$transaction([
             prisma.clients.delete({
                where: {
                    id: client.id
                }
            }),
             prisma.faces.deleteMany({
                where: {
                    client_id: client.id
                }
            })
        ])

        if (deleteTransaction) {
            return NextResponse.json({
                'status': 'success',
                'message': 'Client deleted'
            }, { status: 200 })
        }else {
            return NextResponse.json({
                'status': 'error',
                'message': 'Client not deleted'
            }, { status: 500 })
        
        }
    } catch (error) {
        return NextResponse.json({
            'status': 'error',
            'message': error
        }, { status: 500 })
    }
}
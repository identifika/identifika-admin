import { prisma } from 'server'
import { NextRequest, NextResponse } from 'next/server'
import { get } from 'http'
import { getToken } from 'next-auth/jwt'

async function getUserCount() {
    return await prisma.users.count({
        where: {
            role: 'user',
            active: true
        }
    })
}

async function getFaceCount() {
    return await prisma.faces.count()
}

async function getClientsCount() {
    return await prisma.clients.count()
}

export async function GET(request: NextRequest) {
    try {

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
            const clients = await prisma.clients.findMany({
                where: {
                    user_id: userId
                }
            })

            const clientIds = clients.map(client => client.id)

            const faces = await prisma.faces.count({
                where: {
                    client_id: {
                        in: clientIds
                    }
                }
            })

            const data = {
                users: 0,
                faces,
                clients: clients.length
            }

            return NextResponse.json({
                'status': 'success',
                'data': data
            }, { status: 200 })

        } else {
            const users = await getUserCount()
            const faces = await getFaceCount()
            const clients = await getClientsCount()

            const data = {
                users,
                faces,
                clients
            }

            return NextResponse.json({
                'status': 'success',
                'data': data
            }, { status: 200 })
        }

    } catch (error) {
        return NextResponse.json({
            'status': 'error',
            'message': error
        }, { status: 500 })
    }
}
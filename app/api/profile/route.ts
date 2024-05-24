import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "server"

export async function GET(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

        if (!token) {
            return NextResponse.json({
                'status': 'error',
                'message': 'Unauthorized'
            }, { status: 401 })
        }

        var userId = (token as { user: { _id: string } })?.user?._id;

        const user = await prisma.users.findFirst({
            where: {
                id: userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                active: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                clients: true,
                _count: {
                    select: { clients: true }
                }
            }
        })

        return NextResponse.json({
            'status': 'success',
            'data': user
        })
    } catch (error) {
        return NextResponse.json({
            'status': 'error',
            'message': error.message
        }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

        if (!token) {
            return NextResponse.json({
                'status': 'error',
                'message': 'Unauthorized'
            }, { status: 401 })
        }

        var userData = (token as {
            user: {
                _id: string,
                name: string,
                email: string,
                active: boolean,
                role: string,
            }
        })?.user;

        const formData = await request.formData()
        const name = formData.get('name') as string || userData.name
        const email = formData.get('email') as string || userData.email
        const active = formData.get('active') as string || userData.active
        const role = formData.get('role') as string || userData.role

        const user = await prisma.users.update({
            where: {
                id: userData._id
            },
            data: {
                name: name,
                email: email,
                active: active == 'true' ? true : false,
                role: role
            },
            select: {
                id: true,
                name: true,
                email: true,
                active: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                clients: true,
                _count: {
                    select: { clients: true }
                }
            }
        })

        return NextResponse.json({
            'status': 'success',
            'data': user
        })
    } catch (error) {
        return NextResponse.json({
            'status': 'error',
            'message': error.message
        }, { status: 500 })
    }
}
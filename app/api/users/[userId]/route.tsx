import { NextRequest, NextResponse } from "next/server";
import { prisma } from "server";

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const userId = params.userId
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

export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const userId = params.userId
        const user = await prisma.users.findFirst({
            where: {
                id: userId
            }
        })

        if (!user) {
            return NextResponse.json({
                'status': 'error',
                'message': 'User not found'
            }, { status: 404 });
        }

        const formData = await request.formData();

        const updatedUser = await prisma.users.update({
            where: {
                id: userId
            },
            data: {
                role: formData.get('role') as string || user.role,
                active: formData.get('active') != null ? formData.get('active') == 'true' ? true : false : user.active
            }
        });

        return NextResponse.json({
            'status': 'success',
            'message': 'User updated',
            'data': updatedUser,
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            'status': 'error',
            'message': error.message
        }, { status: 500 });
    }
}
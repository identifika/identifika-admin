import { NextRequest, NextResponse } from "next/server";
import { prisma } from "server";

export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId') || '';

        const user = await prisma.users.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            return NextResponse.json({
                'status': 'error',
                'message': 'User not found'
            }, { status: 404 });
        }

        const updatedClient = await prisma.users.update({
            where: {
                id: userId
            },
            data: {
                active: !user.active
            }
        });

        if (updatedClient){
            return NextResponse.json({
                'status': 'success',
                'message': 'User deactivated'
            }, { status: 200 });
        }

        return NextResponse.json({
            'status': 'error',
            'message': 'Failed to deactivate user'
        }, { status: 500 });

    } catch (error) {
        return NextResponse.json({
            'status': 'error',
            'message': error
        }, { status: 500 });
    }
}
import { prisma } from 'server'
import { NextRequest, NextResponse } from 'next/server'
import { decode, getToken } from 'next-auth/jwt'
import { getSession } from 'next-auth/react'
import { NextApiRequest } from 'next'

async function fetchFaces(query: any, page: number, limit: number) {
    return await prisma.$transaction([
        prisma.faces.findMany({
            where: query,
            select: {
                user_name: true,
                id: true,
                knn_indexing: true,
                client_id: true,
                client: true,
            },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.faces.count({
            where: query,
        })
    ]);
}

async function getClientIds(userId: string) {
    const clients = await prisma.clients.findMany({
        where: { user_id: userId },
        select: { id: true }
    });
    return clients.map(client => client.id);
}

async function getFacesResponse(query: any, page: number, limit: number) {
    const [faces, total] = await fetchFaces(query, page, limit);
    const meta = {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        total,
    };
    return NextResponse.json({
        status: 'success',
        data: faces,
        meta,
    }, { status: 200 });
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = Number(searchParams.get('page')) || 1;
        const limit = Number(searchParams.get('limit')) || 10;
        const clientId = searchParams.get('client_id') || '';

        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            return NextResponse.json({
                status: 'error',
                message: 'Unauthorized'
            }, { status: 401 });
        }

        const role = (token as { user: { role: string } })?.user?.role;
        const userId = (token as { user: { _id: string } })?.user?._id;

        let query: any = {
            user_name: {
                contains: search,
                mode: 'insensitive',
            }
        };

        if (role === 'user') {
            const clientsId = await getClientIds(userId);
            if (clientId && clientsId.includes(clientId)) {
                query.client_id = clientId;
            } else {
                query.client_id = { in: clientsId };
            }
        } else {
            if (clientId) {
                query.client_id = clientId;
            }
        }

        return await getFacesResponse(query, page, limit);
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

        if (!token) {
            return NextResponse.json({
                'status': 'error',
                'message': 'Unauthorized'
            }, { status: 401 })
        }

        var eFaceApiKey = (token as { user: { token: string } })?.user?.token;

        const formData = await request.formData()
        const baseIdentifikaUrl = process.env.IDENTIFIKA_API_URL


        const response = await fetch(
            `${baseIdentifikaUrl}/admin_face_registration`,
            {
                method: 'POST',
                body: formData,
                mode: 'cors',
                headers: {
                    'e-face-api-key': eFaceApiKey,
                }
            });


        if (response.status !== 200) {
            var res = await response.json()
            return NextResponse.json({
                res
            }, { status: response.status })
        } else {
            return NextResponse.json({
                'status': 'success',
                'message': 'Face registration success'
            }, { status: 200 })
        }

    } catch (error) {
        console.error(error)
        return NextResponse.json({
            'status': 'error',
            'message': error
        }, { status: 500 })
    }
}

import { prisma } from 'server'
import { NextRequest, NextResponse } from 'next/server'
import { count } from 'console'
import { getToken } from 'next-auth/jwt'

async function fetchClients(query: any, page: number, limit: number) {
    return await prisma.$transaction([
        prisma.clients.findMany({
            where: query,
            select: {
                client_name: true,
                id: true,
                user_id: true,
                external_token: true,
                user: {
                    select: {
                        name: true,
                    }
                },
                parent_id: true,
                parent: {
                    select: {
                        client_name: true
                    }
                },
                _count: {
                    select: {
                        faces: true
                    }
                }
            },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.clients.count({
            where: query
        })
    ]);
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = Number(searchParams.get('page')) || 1;
        const limit = Number(searchParams.get('limit')) || 10;
        const paramUserId = searchParams.get('userId') || '';
        const paramParentId = searchParams.get('parentId') || '';

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
            client_name: {
                contains: search,
                mode: 'insensitive',
            },
            parent_id: {
                equals: paramParentId || null,
            },
        };

        if (role === 'user') {
            query.user_id = { equals: userId };
        } else if (paramUserId) {
            query.user_id = { equals: paramUserId };
        }

        const [clients, totalClients] = await fetchClients(query, page, limit);

        const meta = {
            page,
            limit,
            totalPages: Math.ceil(totalClients / limit),
            total: totalClients,
        };

        return NextResponse.json({
            status: 'success',
            data: clients,
            meta: meta,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData()

        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

        if (!token) {
            return NextResponse.json({
                'status': 'error',
                'message': 'Unauthorized'
            }, { status: 401 })
        }

        var eFaceApiKey = (token as { user: { token: string } })?.user?.token;
        const baseIdentifikaUrl = process.env.IDENTIFIKA_API_URL

        const res = await fetch(
            `${baseIdentifikaUrl}/clients`
            , {
                method: 'POST',
                body: data,
                headers: {
                    'e-face-api-key': eFaceApiKey,
                }
            }
        )

        if (res.status !== 200) {
            var response = await res.json()
            return NextResponse.json({
                'status': 'error',
                'message': response.message
            }, { status: 500 })
        }

        return NextResponse.json({
            'status': 'success',
            'message': 'Client has been added successfully'
        }, { status: 200 })


    } catch (error) {
        return NextResponse.json({
            'status': 'error',
            'message': error
        }, { status: 500 })
    }
}
import { prisma } from 'server'
import { NextRequest, NextResponse } from 'next/server'
import { count } from 'console'
import { getToken } from 'next-auth/jwt'


export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const page = Number(searchParams.get('page')) || 1
        const limit = Number(searchParams.get('limit')) || 10
        const clientId = searchParams.get('userId') || ''

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
            const clients = await prisma.$transaction([
                prisma.clients.findMany({
                    where: {
                        client_name: {
                            // ignore case
                            contains: search,
                            mode: 'insensitive',
                        },
                        user_id: {
                            equals: userId
                        }
                    },
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
                    where: {
                        client_name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                        user_id: {
                            equals: userId
                        }
                    }
                })
            ])
            const meta = {
                page,
                limit,
                totalPages: Math.ceil(clients[1] / limit),
                total: clients[1],
            }

            return NextResponse.json({
                'status': 'success',
                'data': clients[0],
                'meta': meta,
            }, { status: 200 })
        } else {
            if (clientId) {

                const clients = await prisma.$transaction([
                    prisma.clients.findMany({
                        where: {
                            client_name: {
                                // ignore case
                                contains: search,
                                mode: 'insensitive',
                            },
                            user_id: {
                                equals: clientId
                            }
                        },
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
                        where: {
                            client_name: {
                                contains: search,
                                mode: 'insensitive',
                            },
                            user_id: {
                                equals: clientId
                            }
                        }
                    })
                ])
                const meta = {
                    page,
                    limit,
                    totalPages: Math.ceil(clients[1] / limit),
                    total: clients[1],
                }

                return NextResponse.json({
                    'status': 'success',
                    'data': clients[0],
                    'meta': meta,
                }, { status: 200 })
            } else {
                const clients = await prisma.$transaction([
                    prisma.clients.findMany({
                        where: {
                            client_name: {
                                // ignore case
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
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
                        where: {
                            client_name: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        }
                    })
                ])
                const meta = {
                    page,
                    limit,
                    totalPages: Math.ceil(clients[1] / limit),
                    total: clients[1],
                }

                return NextResponse.json({
                    'status': 'success',
                    'data': clients[0],
                    'meta': meta,
                }, { status: 200 })
            }


        }


    } catch (error) {
        return NextResponse.json({
            'status': 'error',
            'message': error
        }, { status: 500 })
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
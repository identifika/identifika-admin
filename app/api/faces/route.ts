import { prisma } from 'server'
import { NextRequest, NextResponse } from 'next/server'
import { decode, getToken } from 'next-auth/jwt'
import { getSession } from 'next-auth/react'
import { NextApiRequest } from 'next'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const page = Number(searchParams.get('page')) || 1
        const limit = Number(searchParams.get('limit')) || 10
        const clientId = searchParams.get('client_id') || ''

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
                    id: true,
                }
            })

            const clientsId = clients.map((client) => client.id)
            if (clientId && clientsId.includes(clientId)) {
                const faces = await prisma.faces.findMany({
                    where: {
                        user_name: {
                            // ignore case
                            contains: search,
                            mode: 'insensitive',
                        },
                        client_id: clientId,
                    },
                    select: {
                        user_name: true,
                        id: true,
                        knn_indexing: true,
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                })

                const total = await prisma.faces.count({
                    where: {
                        user_name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                        client_id: clientId,
                    }
                })

                const meta = {
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    total: total,
                }

                return NextResponse.json({
                    'status': 'success',
                    'data': faces,
                    'meta': meta,
                }, { status: 200 })
            } else {
                const faces = await prisma.faces.findMany({
                    where: {
                        user_name: {
                            // ignore case
                            contains: search,
                            mode: 'insensitive',
                        },
                        client_id: {
                            in: clientsId
                        }
                    },
                    select: {
                        user_name: true,
                        id: true,
                        knn_indexing: true,
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                })

                const total = await prisma.faces.count({
                    where: {
                        user_name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                        client_id: {
                            in: clientsId
                        }
                    }
                })

                const meta = {
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    total: total,
                }

                return NextResponse.json({
                    'status': 'success',
                    'data': faces,
                    'meta': meta,
                }, { status: 200 })

            }
        }
        else {
            if (clientId) {
                const faces = await prisma.faces.findMany({
                    where: {
                        user_name: {
                            // ignore case
                            contains: search,
                            mode: 'insensitive',
                        },
                        client_id: clientId,
                    },
                    select: {
                        user_name: true,
                        id: true,
                        knn_indexing: true,
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                })

                const total = await prisma.faces.count({
                    where: {
                        user_name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                        client_id: clientId,
                    }
                })

                const meta = {
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    total: total,
                }

                return NextResponse.json({
                    'status': 'success',
                    'data': faces,
                    'meta': meta,
                }, { status: 200 })
            } else {
                const faces = await prisma.faces.findMany({
                    where: {
                        user_name: {
                            // ignore case
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    select: {
                        user_name: true,
                        id: true,
                        knn_indexing: true,
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                })

                const total = await prisma.faces.count({
                    where: {
                        user_name: {
                            contains: search,
                            mode: 'insensitive',
                        }
                    }
                })

                const meta = {
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    total: total,
                }

                return NextResponse.json({
                    'status': 'success',
                    'data': faces,
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
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

        if (!token) {
            return NextResponse.json({
                'status': 'error',
                'message': 'Unauthorized'
            }, { status: 401 })
        }

        var eFaceApiKey = (token as { user: { token: string } })?.user?.token;

        const formData = await request.formData()

        const response = await fetch('http://127.0.0.1:8000/admin_face_registration', {
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

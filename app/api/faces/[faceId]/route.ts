import { prisma } from 'server'
import { NextRequest, NextResponse, } from 'next/server'
import { decode, getToken } from 'next-auth/jwt'
import { url } from 'inspector'

export async function GET(request: Request, { params }: { params: { faceId: string } }) {
    try {
        const faceId = params.faceId
        const faces = await prisma.faces.findFirst({
            where: {
                id: faceId
            },
            select: {
                id: true,
                user_name: true,
                knn_indexing: true,
                client_id: true,
                client: {
                    select: {
                        client_name: true,
                        user_id: true,
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
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

export async function DELETE(request: NextRequest, { params }: { params: { faceId: string } }) {
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
        formData.append('identifier', params.faceId)

        const response = await fetch('http://127.0.0.1:8000/admin_delete_face', {
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
                'message': 'Face deleted'
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

import { prisma } from 'server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {

        const recognition_types = await prisma.recognition_types.findMany()

        return NextResponse.json({
            'status': 'success',
            'data': recognition_types,
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            'status': 'error',
            'message': error
        }, { status: 500 })
    }
}
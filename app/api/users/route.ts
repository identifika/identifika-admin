import { prisma } from 'server'
import { NextResponse } from 'next/server'


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10

    const users = await prisma.users.findMany({
      where: {
        name: {
          // ignore case
          contains: search,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { clients: true }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    const totalUsers = await prisma.users.count()

    const meta = {
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
      total: totalUsers,
    }

    return NextResponse.json({
      'status': 'success',
      'data': users,
      'meta': meta,
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({
      'status': 'error',
      'message': error
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const user = await prisma.users.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
        role: body.role,
        active: body.active,
      }
    })

    return NextResponse.json({
      'status': 'success',
      'data': user
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json({
      'status': 'error',
      'message': error
    }, { status: 500 })
  }
}
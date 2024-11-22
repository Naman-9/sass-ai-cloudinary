import { PrismaClient } from '@prisma/client'
import {NextRequest, NextResponse} from "next/server"

// establish connection
const prisma = new PrismaClient()


export async function GET(request:NextRequest) {
    try {
        const videos = await prisma.video.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })
        return NextResponse.json(videos)
    } catch (error) {
        return NextResponse.json(
            {error: "Error fetching videos..."},
             {status: 500}
            )
    } finally {
        // wait for prisma to disconnect
        await prisma.$disconnect
    }
}
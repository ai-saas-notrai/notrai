// pages/api/users/[userId].js

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).end('Method Not Allowed');
    }

    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'A valid userId is required' });
    }

    try {
        // Fetch user basic information
        const userInfo = await prisma.user.findUnique({
            where: { userId },
        });

        // Fetch user subscription details
        const userSubscription = await prisma.userSubscription.findUnique({
            where: { userId },
        });

        // Fetch user API limit
        const userApiLimit = await prisma.userApiLimit.findUnique({
            where: { userId },
        });

        // Fetch user question limit
        const userQuestionLimit = await prisma.userQuestionLimit.findUnique({
            where: { userId },
        });

        // Check if user information is found
        if (!userInfo) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Combine all fetched data into a single object
        const userData = {
            userInfo,
            userSubscription,
            userApiLimit,
            userQuestionLimit,
        };

        // Return the combined user data as JSON
        res.status(200).json(userData);
    } catch (error) {
        console.error('[USER_SETTINGS]:', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// app/api/stateUpdate/route.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb'; // Adjust the import path as needed
import { auth } from "@clerk/nextjs";

type RequestBody = {
  userId: string;
  fileID: string;
  state: string;
};

type ResponseData = {
  message: string;
  updatedUserSubscription?: object; // Replace 'object' with a more specific type if available
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
    try {
      const { userId } = auth();

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { fileID, state } = req.body as RequestBody;

      const updatedUserSubscription = await prismadb.userSubscription.update({
        where: { userId },
        data: { fileID, state },
      });

      res.status(200).json({ message: 'User state updated successfully', updatedUserSubscription });
    } catch (error) {
      console.error('Failed to update user state:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
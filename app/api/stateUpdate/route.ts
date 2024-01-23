// pages/api/updateUserState.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb'; // Adjust the import path as needed

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
      const { userId, fileID, state } = req.body as RequestBody;

      // Update the UserSubscription record with the new fileID and state
      const updatedUserSubscription = await prismadb.userSubscription.update({
        where: {
          userId: userId,
        },
        data: {
          fileID: fileID,
          state: state,
        },
      });

      res.status(200).json({ message: 'User state updated successfully', updatedUserSubscription });
    } catch (error) {
      console.error('Failed to update user state:', error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  } else {
    // Handle any non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end({ message: `Method ${req.method} Not Allowed` });
  }
}

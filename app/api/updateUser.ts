// File: app/api/updateUser.ts

import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { userId } = auth();
  const { state, fileID } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Authentication failed: No user ID" });
  }

  try {
    const userRecord = await prismadb.user.findUnique({
      where: { userId: userId },
    });

    if (userRecord) {
      await prismadb.user.update({
        where: { userId: userId },
        data: { state: state, fileID: fileID },
      });
    } else {
      await prismadb.user.create({
        data: { userId: userId, state: state, fileID: fileID },
      });
    }

    return res.status(200).json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Error updating user" });
  }
}



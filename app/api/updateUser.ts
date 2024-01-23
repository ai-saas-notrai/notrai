// File: pages/api/updateUser.js

import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { userId } = await auth.getUser(req);
    const { state, fileID } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Authentication failed: No user ID" });
    }

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

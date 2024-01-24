import { updateUserInfo} from "@/lib/updateUser";


import { NextResponse, NextRequest } from "next/server";
export  async function Handler(req : NextRequest, res:NextResponse) {
  if (req.method === 'POST') {
    try {

      const { state, fileID } = req.body;
      await updateUserInfo(state, fileID);
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}

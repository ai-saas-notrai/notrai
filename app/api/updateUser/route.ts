import { updateUserInfo} from "@/lib/updateUser";


import { NextResponse } from "next/server";

export async function POST(
    req: Request
  ) {
    try {
    const { state, fileID } = req.body;
    await updateUserInfo(state, fileID);
    NextResponse.json({ message: 'User updated successfully' });
    } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
    }
    
  };
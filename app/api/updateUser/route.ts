import { updateUserInfo } from "@/lib/updateUser";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parsing the request body
    const body = await req.json();
    const { state, fileID } = body;

    // Call the updateUserInfo function
    await updateUserInfo(state, fileID);

    // Return a successful response
    return new NextResponse(JSON.stringify({ message: 'User updated successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(error);
    // Return an error response
    return new NextResponse(JSON.stringify({ message: 'Internal Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

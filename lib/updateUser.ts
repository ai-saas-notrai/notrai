import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export const updateUserInfo = async (newState:string, fileID:string) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Authentication failed: No user ID");
  }

  try {
    // Check if the user record already exists
    const userRecord = await prismadb.user.findUnique({
      where: { userId: userId },
    });

    if (userRecord) {
      // Update the existing user record with the new state and fileID
      await prismadb.user.update({
        where: { userId: userId },
        data: { state: newState, fileID: fileID },
      });
    } else {
      // Create a new user record with the state and fileID
      await prismadb.user.create({
        data: { userId: userId, state: newState, fileID: fileID },
      });
    }
  } catch (error) {
    console.error("Error updating user info:", error);
    throw new Error("Error updating user info");
  }
};

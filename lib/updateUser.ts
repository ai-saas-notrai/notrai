import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export const updateUserInfo = async (newState:string, fileID:string, six_hour_exam:boolean, three_hour_exam:boolean) => {
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
        data: { state: newState, fileID: fileID, six_hour_exam:six_hour_exam, three_hour_exam:three_hour_exam },
      });
    } else {
      // Create a new user record with the state and fileID
      await prismadb.user.create({
        data: { userId: userId, state: newState, fileID: fileID, six_hour_exam:six_hour_exam, three_hour_exam:three_hour_exam },
      });
    }
  } catch (error) {
    console.error("Error updating user info:", error);
    throw new Error("Error updating user info");
  }
};

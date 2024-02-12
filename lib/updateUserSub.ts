import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export const updateUserSub = async (userName:string, six_hour_course:string, three_hour_course:string) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Authentication failed: No user ID");
  }

  try {
    // Check if the user record already exists
    const userRecord = await prismadb.userSubscription.findUnique({
      where: { userId: userId },
    });

    if (userRecord) {
      // Update the existing user record with the new state and fileID
      await prismadb.userSubscription.update({
        where: { userId: userId },
        data: { UserName: userName, fileID: fileID },
      });
    } else {
      // Create a new user record with the state and fileID
      await prismadb.user.create({
        data: { userId: userId, six_hour_course: six_hour_course, three_hour_course: three_hour_course },
      });
    }
  } catch (error) {
    console.error("Error updating user info:", error);
    throw new Error("Error updating user info");
  }
};

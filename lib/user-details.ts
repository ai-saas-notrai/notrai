import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export const updateUser = async (state: string, fileID: string) => {
  const { userId } = auth();

  if (!userId) {
    console.error("No user ID found");
    throw new Error("Authentication failed: No user ID");
  }

  try {
    const userRecord = await prismadb.user.findUnique({
      where: { userId: userId },
    });

    if (userRecord) {
      await prismadb.user.update({
        where: { userId: userId },
        data: { 
          state: state, 
          fileID: fileID 
        },
      });
    } else {
      await prismadb.user.create({
        data: { 
          userId: userId, 
          state: state, 
          fileID: fileID 
        },
      });
    }
    return { success: true, message: "User updated successfully" };
  } catch (error) {
    console.error("Error updating user:", error);
    throw error; // Propagate the error to be caught in handleSubmit
  }
};

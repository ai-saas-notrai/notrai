import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export const fetchUserState = async () => {
    const { userId } = auth();
  
    if (!userId) {
      throw new Error("Authentication failed: No user ID");
    }
  
    try {
      const userRecord = await prismadb.user.findUnique({
        where: { userId: userId },
        select: { state: true }  // Select only the 'state' field
      });
  
      if (userRecord) {
        return userRecord.state;
      } else {
        // Handle the case where the user does not exist
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error fetching user state:", error);
      throw new Error("Error fetching user state");
    }
  };
  
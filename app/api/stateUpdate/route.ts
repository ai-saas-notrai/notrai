import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export const updateUserSubscription = async (state: string, fileID: string) => {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  await prismadb.userSubscription.update({
    where: { userId: userId },
    data: { 
      state: state, 
      fileID: fileID 
    },
  });
};

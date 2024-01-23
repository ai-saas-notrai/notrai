import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export const updateUserSubscription = async (state:string, fileID:string) => {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  const userSubscription = await prismadb.userSubscription.findUnique({
    where: { userId: userId },
  });

  if (userSubscription) {
    await prismadb.userSubscription.update({
      where: { userId: userId },
      data: { 
        state: state, 
        fileID: fileID 
      },
    });
  } else {
    await prismadb.userSubscription.create({
      data: { 
        userId: userId, 
        state: state, 
        fileID: fileID 
      },
    });
  }
};

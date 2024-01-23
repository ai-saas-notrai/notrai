import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export const updateUser = async (state:string, fileID:string) => {
  const { userId } = auth();

  if (!userId) {
    return;
  }

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
};

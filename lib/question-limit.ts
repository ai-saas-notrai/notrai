import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { MAX_FREE_QUESTIONS } from "@/constants";

export const incrementQuestionLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  const userQuestionLimit = await prismadb.userQuestionLimit.findUnique({
    where: { userId: userId },
  });

  if (userQuestionLimit) {
    await prismadb.userQuestionLimit.update({
      where: { userId: userId },
      data: { count: userQuestionLimit.count + 1 },
    });
  } else {
    await prismadb.userQuestionLimit.create({
      data: { userId: userId, count: 1 },
    });
  }
};

export const checkQuestionLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const userQuestionLimit = await prismadb.userQuestionLimit.findUnique({
    where: { userId: userId },
  });

  if (!userQuestionLimit || userQuestionLimit.count < MAX_FREE_QUESTIONS) {
    return true;
  } else {
    return false;
  }
};

export const getQuestionLimitCount = async () => {
  const { userId } = auth();

  if (!userId) {
    return 0;
  }

  const userQuestionLimit = await prismadb.userQuestionLimit.findUnique({
    where: {
      userId
    }
  });

  if (!userQuestionLimit) {
    return 0;
  }

  return userQuestionLimit.count;
};

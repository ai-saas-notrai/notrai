import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UserSettingsData {
  userInfo?: { /* structure of user info updates */ };
  userSubscription?: { /* structure of subscription updates */ };
  userApiLimit?: { /* structure of API limit updates */ };
  userQuestionLimit?: { /* structure of question limit updates */ };
}

export async function userSettings(action: string, userId: string, data: UserSettingsData = {}) {
  try {
    switch (action) {
      case 'fetch':
        // Fetch user details from multiple models
        const userInfo = await prisma.user.findUnique({ where: { userId } });
        const userSubscription = await prisma.userSubscription.findUnique({ where: { userId } });
        const userApiLimit = await prisma.userApiLimit.findUnique({ where: { userId } });
        const userQuestionLimit = await prisma.userQuestionLimit.findUnique({ where: { userId } });

        return {
          userInfo,
          userSubscription,
          userApiLimit,
          userQuestionLimit,
        };

      case 'update':
        // Perform update operations based on the provided data
        if (data.userInfo) {
          await prisma.user.update({ where: { userId }, data: data.userInfo });
        }
        if (data.userSubscription) {
          await prisma.userSubscription.update({ where: { userId }, data: data.userSubscription });
        }
        if (data.userApiLimit) {
          await prisma.userApiLimit.update({ where: { userId }, data: data.userApiLimit });
        }
        if (data.userQuestionLimit) {
          await prisma.userQuestionLimit.update({ where: { userId }, data: data.userQuestionLimit });
        }

        return { message: 'User settings updated successfully' };

      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    // Log the error and rethrow it or handle it as needed
    console.error('Error in userSettings function:', error);
    throw error; // Rethrowing the error to be handled by the caller
  }
}

import prismadb from "@/lib/prismadb";

async function getThread(userId: string) {
    let thread = await prismadb.thread.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });

    if (!thread) {
        thread = await prismadb.thread.create({
            data: { userId, updatedAt: new Date() },
        });
    }

    return thread.id;
}

async function saveThread(threadId: string, messages: any[]) {
    const messageData = messages.map(message => ({
        content: message.content,
        userRole: message.role,
    }));

    await prismadb.thread.update({
        where: { id: threadId },
        data: {
            updatedAt: new Date(),
            
        },
    });
}

export { getThread, saveThread };

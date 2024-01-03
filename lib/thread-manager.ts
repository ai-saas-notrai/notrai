import prismadb from "@/lib/prismadb";

async function getThread(userId: string) {
    let thread = await prismadb.thread.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });

    if (!thread) {
        thread = await prismadb.thread.create({
            data: { userId, createdAt: new Date() },
        });
    }

    return thread.id;
}

async function saveThread(threadId: string, messages: any[]) {
    await prismadb.thread.update({
        where: { id: threadId },
        data: {
            lastUpdated: new Date(),
            messages: {
                createMany: {
                    data: messages.map(message => ({
                        content: message.content,
                        userRole: message.role,
                    })),
                },
            },
        },
    });
}

export { getThread, saveThread };

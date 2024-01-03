import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import { getThread, saveThread } from "@/lib/thread-manager"; // Assuming these are your thread management utilities

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    // Retrieve the current thread or create a new one
    const threadId = await getThread(userId);


    // Trigger assistant and retrieve messages
    const run = await openai.beta.threads.runs.create({
      thread_id: threadId,
      assistant_id: "asst_VrmA6nyg3uzqLjetDBYr7kF1", // Replace with your assistant ID
    });

    const responseMessages = await openai.beta.threads.messages.list({
      thread_id: threadId
    });

    const response = responseMessages.data[0].content[0].text.value;

    // Save the updated thread
    await saveThread(userId, threadId, [...messages, { role: 'assistant', content: response }]);

    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

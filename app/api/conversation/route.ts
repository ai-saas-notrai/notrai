import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import { getThread, saveThread } from "@/lib/thread-manager";

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

    const threadId = await getThread(userId);

    // Replace with your assistant's ID
    const ASSISTANT_ID = "asst_VrmA6nyg3uzqLjetDBYr7kF1"; 

    // Create a run on the thread using the assistant
    const run = await openai.beta.threads.runs.create({
      thread_id: threadId,
      assistant_id: ASSISTANT_ID,
    });

    // Assuming you need to retrieve messages after creating a run
    const responseMessages = await openai.beta.threads.messages.list({
      thread_id: threadId
    });

    if (!isPro) {
      await incrementApiLimit();
    }

    await saveThread(userId, threadId, messages.concat(responseMessages.data[0].content[0].text.value));

    return NextResponse.json(responseMessages.data[0].content[0].text.value);
  } catch (error) {
    console.error('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

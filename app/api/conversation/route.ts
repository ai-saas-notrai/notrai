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

    // Create a thread
    const response = await openai.createChatCompletion({
      model: "gpt-4-1106-preview", // Replace with the model you're using
      messages: messages,
      assistant_id: ASSISTANT_ID,
    });


 
    if (!isPro) {
      await incrementApiLimit();
    }

    await saveThread(userId, threadId, messages.concat(response.data.choices[0].message));


    return NextResponse.json(response.data.choices[0].message);
  } catch (error) {
    console.error('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

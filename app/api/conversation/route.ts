import { auth } from "@clerk/nextjs";
import { NextResponse, NextRequest } from "next/server";
import OpenAI from "openai";
import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is configured correctly
});
const ASSISTANT_ID = "asst_VrmA6nyg3uzqLjetDBYr7kF1"; // Existing Assistant ID

// Function to add a message to a thread and run the assistant
async function handleMessage(threadId: string, content: string) {
  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: content,
  });

  return await openai.beta.threads.runs.create(threadId, {
    assistant_id: ASSISTANT_ID
  });
}

// Function to wait for the run to complete
async function waitForRunCompletion(threadId: string, runId: string): Promise<string> {
  let runStatus;
  do {
    await new Promise(resolve => setTimeout(resolve, 2000));
    runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
  } while (runStatus.status !== "completed");

  const messagesResponse = await openai.beta.threads.messages.list(threadId);
  // Assuming you are interested in the first message's text content
  const firstMessage = messagesResponse.data[0];
  if (firstMessage && firstMessage.content && firstMessage.content.length > 0) {
    const firstContent = firstMessage.content[0];
    if (firstContent.type === 'text') {
      return firstContent.text.value;
    }
  }
  return "Unsupported message format"; // Fallback for unsupported formats or empty messages
}
// API Route Handler
export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    if (!messages || typeof messages !== 'string') {
      return new NextResponse("Message content must be a string");
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    const threadId = await openai.beta.threads.create();
    const run = await handleMessage(threadId.id, messages);

    if (!isPro) {
      await incrementApiLimit();
    }

    const response = await waitForRunCompletion(threadId.id, run.id);
    return NextResponse.json(response);

  } catch (error) {
    console.error('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

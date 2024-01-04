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
async function handleMessage(threadId : string, content : string) {
  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: content,
  });

  return await openai.beta.threads.runs.create(threadId, {
    assistant_id: ASSISTANT_ID
  });
}

// API Route Handler
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { content } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!content) {
      return new NextResponse("Message is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    const threadId = await openai.beta.threads.create();
    const run = await handleMessage(threadId.id, content);

    if (!isPro) {
      await incrementApiLimit();
    }

    // Wait for the run to complete and retrieve messages
    setTimeout(async () => {
      const messages = await openai.beta.threads.messages.list(threadId.id);
      return NextResponse.json(messages);
    }, 10000); // Adjust the timeout as needed

  } catch (error) {
    console.error('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

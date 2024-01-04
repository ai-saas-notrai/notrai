import { auth } from "@clerk/nextjs";

import { NextResponse,NextRequest } from "next/server";
import OpenAI from "openai";

import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is configured correctly
});
const ASSISTANT_ID = "asst_VrmA6nyg3uzqLjetDBYr7kF1"; // Use your existing Assistant ID

// Function to create a new thread and return its ID
async function createNewThread() {
  try {
    const threadResponse = await openai.beta.threads.create();
    return threadResponse.id; // Extract the thread ID from the response
  } catch (error) {
    console.error('Error creating new thread:', error);
    throw new Error('Failed to create a new thread');
  }
}

// Function to add a message to a thread
async function addMessageToThread(threadId:string, content:string) {
  const message = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: content,
  });
  return message;
}

// Function to run the assistant on the thread
async function runAssistantOnThread(threadId:string) {
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: ASSISTANT_ID,
  });
  return run;
}

// Function to retrieve messages from a thread
async function getThreadMessages(threadId: string) {
  const messages = await openai.beta.threads.messages.list(threadId);
  return messages;
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

    // Create a new thread
    const threadId = await createNewThread();

    // Add user's message to the thread
    await addMessageToThread(threadId, content);

    // Run the assistant on the thread
    const runResponse = await runAssistantOnThread(threadId);

    const messagesResponse = await getThreadMessages(threadId);

    if (!isPro) {
      await incrementApiLimit();
    }

    // Return a response using res
    return NextResponse.json(messagesResponse); // Adjust according to your needs
  } catch (error) {
    console.error('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

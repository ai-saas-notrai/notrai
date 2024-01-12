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
async function sendMessageToThread(threadId: string, content: string) {
  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: content,
  });
}

async function createRunWithAssistant(threadId: string) {
  return await openai.beta.threads.runs.create(threadId, {
    assistant_id: ASSISTANT_ID,
  });
}


// Function to wait for the run to complete
async function waitForRunCompletion(threadId: string, runId: string) {
  while (true) {
    const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

    if (runStatus.status === "completed" || runStatus.status === "failed") {
      break;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function getLastAssistantMessage(threadId: string) {
  const response = await openai.beta.threads.messages.list(threadId);

  // Find the last message from the assistant
  const lastAssistantMessage = response.data.reverse().find((message) => message.role === 'assistant');

  // Check if a message was found and extract the text
  if (lastAssistantMessage && lastAssistantMessage.content.length > 0 && lastAssistantMessage.content[0].type === 'text') {
    return lastAssistantMessage.content[0].text.value; // Assuming the first content item is the relevant text
  }

  return null; // No assistant message found or the format is unexpected
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

    if (!messages || typeof messages !== "string") {
      return new NextResponse("Message content must be a string");
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse(
        "Free trial has expired. Please upgrade to pro.",
        { status: 403 }
      );
    }

    
    const threadResponse = await openai.beta.threads.create();
    const threadId = threadResponse.id;

    // Send message and create run
    await sendMessageToThread(threadId, messages);
    const run = await createRunWithAssistant(threadId);

    // Wait for the run to complete
    await waitForRunCompletion(threadId, run.id);

    if (!isPro) {
      await incrementApiLimit();
    }
    
    // Retrieve the messages
    const lastAssistantMessage = await getLastAssistantMessage(threadId);

    // Check if a message was retrieved and respond accordingly
    if (lastAssistantMessage) {
      return NextResponse.json({ ok: true, message: lastAssistantMessage });
    } else {
      return NextResponse.json({ ok: false, error: "No assistant message found" });
    }

  } catch (error) {
    console.error("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

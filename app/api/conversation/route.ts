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
    assistant_id: ASSISTANT_ID,
  });
}

// Function to wait for the run to complete
async function waitForRunCompletion(threadId: string, runId: string) {
  let isRunCompleted = false;

  // Function to periodically check run status
  async function checkRunStatus() {
    const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
    if (runStatus.status === "completed") {
      isRunCompleted = true;
    } else if (runStatus.status === "failed") {
      throw new Error("Run failed"); // Handle this error as needed
    }
  }

  // Wait for run to complete or fail
  while (!isRunCompleted) {
    await checkRunStatus();
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds before checking again
  }

  // Retrieve the assistant's response
  const response = await openai.beta.threads.messages.list(threadId);
  return response;
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

    const threadId = await openai.beta.threads.create();
    const run = await handleMessage(threadId.id, messages);

    if (!isPro) {
      await incrementApiLimit();
    }

    const response = await waitForRunCompletion(threadId.id, run.id);

    console.log("Assistant Response:", response);

    // Convert the response object to a JSON string
    const responseString = JSON.stringify( response.data
      .filter((message: any) => message.run_id === run.id && message.role === "assistant")
      .pop());

    // Return a NextResponse with the JSON string
    return new NextResponse(responseString, { status: 200 });
  } catch (error) {
    console.error("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

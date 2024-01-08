import { auth } from "@clerk/nextjs";
import { NextResponse, NextRequest } from "next/server";
import OpenAI from "openai";
import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const ASSISTANT_ID = "asst_VrmA6nyg3uzqLjetDBYr7kF1";

let globalThreadId: string | null = null; // Persistent thread ID

async function getOrCreateThreadId(): Promise<string> {
  if (!globalThreadId) {
    const thread = await openai.beta.threads.create();
    globalThreadId = thread.id;
  }

  if (globalThreadId === null) {
    throw new Error("Failed to create or retrieve a valid thread ID.");
  }

  return globalThreadId;
}

async function handleMessage(threadId: string, content: string) {
  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: content,
  });

  return await openai.beta.threads.runs.create(threadId, {
    assistant_id: ASSISTANT_ID,
  });
}

async function waitForRunCompletion(threadId: string, runId: string) {
  while (true) {
    const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
    if (runStatus.status === "completed") {
      break;
    } else if (runStatus.status === "failed") {
      throw new Error("Run failed");
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  const response = await openai.beta.threads.messages.list(threadId);
  return response;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!messages || typeof messages !== "string") return new NextResponse("Invalid message format");

    const isPro = await checkSubscription();
    const freeTrial = !isPro && await checkApiLimit();
    if (!freeTrial && !isPro) return new NextResponse("API limit reached or subscription required", { status: 403 });

    const threadId = await getOrCreateThreadId();
    const run = await handleMessage(threadId, messages);

    if (!isPro) await incrementApiLimit();

    const response = await waitForRunCompletion(threadId, run.id);

    // A bunch of boring safety checks
    const lastMessage = response.data.at(0);
    if (lastMessage?.role !== "assistant") {
      return new Response("Last message not from the assistant", {
        headers: { "Content-Type": "text/plain" },
      });
    }

    const assistantMessageContent = lastMessage.content.at(0);
    if (!assistantMessageContent) {
      return new Response("No assistant message found", {
        headers: { "Content-Type": "text/plain" },
      });
    }

    if (assistantMessageContent.type !== "text") {
      return new Response(
        "Assistant message is not text, only text supported in this demo",
        {
          headers: { "Content-Type": "text/plain" },
        }
      );
    }

    // Return the assistant's response
    return new Response(assistantMessageContent.text.value, {
      headers: { "Content-Type": "text/plain" },
    });



  } catch (error) {
    console.error("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

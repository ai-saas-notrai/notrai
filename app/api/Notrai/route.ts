import { NextRequest, NextResponse } from 'next/server'
import { queryPineconeVectorStoreAndQueryLLM } from '../../../utils'
import { indexName } from '../../../config'
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is configured correctly
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    const freeTrial = await checkApiLimit();
     const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse(
        "Free trial has expired. Please upgrade to pro.",
        { status: 403 }
      );
    }

    // Call the updated query function with the correct parameters
    const apiKey = process.env.PINECONE_API_KEY || '';
    const message = await queryPineconeVectorStoreAndQueryLLM(apiKey, indexName, body.question);

    const response = await  await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: message
    });

    if (!isPro) {
      await incrementApiLimit();
    }
    if (response) {
      return NextResponse.json({ ok: true, data: response });
    } else {
      return NextResponse.json({ ok: false, error: "No assistant message found" });
    }
  } catch (error) {
    console.error("[NOTRAI_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

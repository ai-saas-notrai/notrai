import { NextRequest, NextResponse } from 'next/server'
import { queryPineconeVectorStoreAndQueryLLM } from '../../../utils'
import { indexName } from '../../../config'
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import {fetchUserState} from "@lib/fetchUserState"

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
    const environment = process.env.PINECONE_ENVIRONMENT || '';
    const text = await queryPineconeVectorStoreAndQueryLLM(apiKey, environment, indexName, body.question);

    if (!isPro) {
      await incrementApiLimit();
    }
    if (text) {
      return NextResponse.json({ ok: true, data: text });
    } else {
      return NextResponse.json({ ok: false, error: "No assistant message found" });
    }
  } catch (error) {
    console.error("[NOTRAI_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

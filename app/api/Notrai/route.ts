import { NextRequest, NextResponse } from 'next/server'
import { queryPineconeVectorStoreAndQueryLLM } from '../../../utils'
import { indexName } from '../../../config'
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { promises as fs } from 'fs';
import path from 'path'

async function searchLocalMarkdownFiles(query:string, directory:string) {
  // This function reads Markdown files, processes them, and returns relevant results.
  // For simplicity, this is a placeholder. Implement according to your needs.
  const files = await fs.readdir(directory);
  const markdownFiles = files.filter(file => file.endsWith('.md'));
  let results = [];

  for (let file of markdownFiles) {
    const content = await fs.readFile(path.join(directory, file), 'utf8');
    // Simple example: check if file content contains the query
    if (content.toLowerCase().includes(query.toLowerCase())) {
      results.push({ file, snippet: content.substring(0, 100) }); // Example result structure
    }
  }
  return results;
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    // Search local Markdown files
    const lessonDirectory = path.join(process.cwd(), 'public', 'lessons');
    const localResults = await searchLocalMarkdownFiles(body.question, lessonDirectory);

    // Enhance Pinecone query with local results or perform query as is
    const apiKey = process.env.PINECONE_API_KEY || '';
    const pineconeResults = await queryPineconeVectorStoreAndQueryLLM(apiKey, indexName, body.question);
    
    if (!isPro) {
      await incrementApiLimit();
    }

    // Combine results from Pinecone and local search
    const combinedResults = {
      local: localResults,
      pinecone: pineconeResults
    };

    return NextResponse.json({ ok: true, data: combinedResults });

  } catch (error) {
    console.error("[NOTRAI_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

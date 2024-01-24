import { NextRequest, NextResponse } from 'next/server'
import { Pinecone } from '@pinecone-database/pinecone'
import { queryPineconeVectorStoreAndQueryLLM } from '../../../utils'
import { indexName } from '../../../config'

export async function POST(req: NextRequest) {
  const body = await req.json()
  
  // Initialize Pinecone
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || '',
    environment: process.env.PINECONE_ENVIRONMENT || ''
  });

  // Call the updated query function with the correct parameters
  const apiKey = process.env.PINECONE_API_KEY || '';
  const environment = process.env.PINECONE_ENVIRONMENT || '';
  const text = await queryPineconeVectorStoreAndQueryLLM(apiKey, environment, indexName, body.question);

  return NextResponse.json({
    data: text
  })
}

import { OpenAIEmbeddings } from '@langchain/openai'
import { OpenAI } from '@langchain/openai'
import { loadQAStuffChain } from 'langchain/chains'
import { Document } from '@langchain/core/documents'
import { Pinecone } from '@pinecone-database/pinecone'

export const queryPineconeVectorStoreAndQueryLLM = async (
  apiKey: string,
  environment: string,
  indexName: string,
  question: string
) => {
  // 1. Initialize Pinecone client
  const pinecone = new Pinecone({ apiKey, environment });

  // 2. Access the Pinecone index
  const index = pinecone.index(indexName);

  // 3. Create query embedding
  const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);

  // 4. Query Pinecone index and return top 10 matches
  const queryResponse = await index.query({
    topK: 10,
    vector: queryEmbedding,
    includeMetadata: true,
    includeValues: true,
  });

  // 5. Log the number of matches
  console.log(`Found ${queryResponse.matches.length} matches...`);

  // 6. Log the question being asked
  console.log(`Asking question: ${question}...`);

  if (queryResponse.matches.length) {
    // 7. Create an OpenAI instance and load the QAStuffChain
    const llm = new OpenAI({});
    const chain = loadQAStuffChain(llm);

    // 8. Extract and concatenate page content from matched documents
    const concatenatedPageContent = queryResponse.matches
      .map((match) => match.metadata?.pageContent ?? "")
      .join(" ");

      console.log({chain});

    // 9. Execute the chain with input documents and question
    const result = await chain.invoke({
      input_documents: [new Document({ pageContent: concatenatedPageContent })],
      question: question,
    });

    // 10. Log the answer
    
    console.log(`Answer: ${result.text}`);
    return result.text;
  } else {
    // 11. Log that there are no matches, so GPT-3 will not be queried
    console.log('Since there are no matches, GPT-3 will not be queried.');
  }
};

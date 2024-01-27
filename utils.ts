import { OpenAIEmbeddings } from '@langchain/openai';
import { loadQAStuffChain } from 'langchain/chains';
import { Document } from '@langchain/core/documents';
import { Pinecone } from '@pinecone-database/pinecone';
import { PromptTemplate } from '@langchain/core/prompts';
import { fetchUserState } from '@/lib/fetchUserState';
import { notaryPrompt } from './lib/prompts';
import OpenAI from 'openai';

export const queryPineconeVectorStoreAndQueryLLM = async (
  apiKey: string,
  indexName: string,
  question: string
) => {
  
  // Initialize Pinecone client
  const pinecone = new Pinecone({ apiKey });

  // Access the Pinecone index
  const index = pinecone.index(indexName);

  // Create query embedding
  const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);

  // Query Pinecone index and return top 10 matches
  const queryResponse = await index.query({
    topK: 25,
    vector: queryEmbedding,
    includeMetadata: true,
    includeValues: true,
  });

  // Log the number of matches
  console.log(`Found ${queryResponse.matches.length} matches...`);

  // Log the question being asked
  console.log(`Asking question: ${question}...`);

  if (queryResponse.matches.length) {
    // Custom prompt template
    const userState = await fetchUserState();
    const promptTemplate = new PromptTemplate({
      template: notaryPrompt ,
      inputVariables: ['context', 'userState']
    });

    // Create an OpenAI instance and load the QAStuffChain
    //const llm = new OpenAI({ temperature: 0.3});
    
    //const chain = loadQAStuffChain(llm);
    
    // Extract and concatenate page content from matched documents
    const concatenatedPageContent = queryResponse.matches
      .map((match) => match.metadata?.pageContent ?? "")
      .join(" ");

    // Format the query using the custom prompt template
    const formattedQuestion = await promptTemplate.format({ context: concatenatedPageContent, userState:userState });

    // Execute the chain with input documents and question
    //const result = await chain.invoke({
     // input_documents: [new Document({ pageContent: formattedQuestion })],
    //  question: question,
   // });

   
    // Log the answer
    console.log(`Answer: ${formattedQuestion}`);
    return formattedQuestion;
  } else {
    // Log that there are no matches, so GPT-3 will not be queried
    console.log('Since there are no matches, GPT-3 will not be queried.');
  }
};

import { OpenAIEmbeddings, OpenAI } from '@langchain/openai';
import { loadQAStuffChain } from 'langchain/chains';
import { Document } from '@langchain/core/documents';
import { Pinecone } from '@pinecone-database/pinecone';
import { PromptTemplate } from '@langchain/core/prompts';
import { fetchUserState } from '@/lib/fetchUserState';
import { notaryPrompt } from './lib/prompts';
import { BufferMemory } from "langchain/memory";
import { auth } from "@clerk/nextjs";

export const queryPineconeVectorStoreAndQueryLLM = async (
  apiKey: string,
  indexName: string,
  question: string,
) => {
  // Initialize Pinecone client
  const pinecone = new Pinecone({ apiKey });
  const { userId } = auth();
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

  console.log(`Found ${queryResponse.matches.length} matches...`);
  console.log(`Asking question: ${question}...`);

  // Initialize BufferMemory with unique identifier (e.g., userId)
  const memory = new BufferMemory({
    memoryKey: `memory-${userId}`, // Ensure unique memory per user
  });

  // Load previous memory content for the user
  
  const memoryContent = await memory.loadMemoryVariables({});
  console.log('Loaded memory content:', memoryContent);

  if (queryResponse.matches.length) {
    // Custom prompt template
    const userState = await fetchUserState();
    const promptTemplate = new PromptTemplate({
      template: notaryPrompt,
      inputVariables: ['context', 'userState', 'memory']
    });

    console.log(JSON.stringify(queryResponse.matches, null, 2));


    const llm = new OpenAI({ temperature: 0.2 });
    const chain = loadQAStuffChain(llm);

    // Extract and concatenate page content from matched documents
    const concatenatedPageContent = queryResponse.matches
      .map((match) => match.metadata?.pageContent ?? "")
      .join(" ");
    
    console.log(`Concated Results: ${concatenatedPageContent}...`);

    // Format the query using the custom prompt template, including memory content
    const formattedQuestion = await promptTemplate.format({
      context: concatenatedPageContent,
      userState: userState,
      memory: memoryContent || 'none', // Use 'none' or an appropriate default if no memory
    });
    console.log(`Memory: ${JSON.stringify(memoryContent, null, 2)}...`);

    // Execute the chain with input documents and question
    const result = await chain.invoke({
      input_documents: [new Document({ pageContent: formattedQuestion })],
      question: question,
    });

    // Update memory with the current interaction
    // Update memory with the current interaction
    console.log('Saving to memory:', { human: question, assistant: result.text });
    await memory.saveContext(
      { human: question },
      { assistant: result.text }
    );


    console.log(`Answer: ${result.text}`);
    return result.text;
  } else {
    console.log('Since there are no matches, GPT-3 will not be queried.');
  }
};

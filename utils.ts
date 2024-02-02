import { OpenAIEmbeddings, OpenAI } from '@langchain/openai';
import { loadQAStuffChain } from 'langchain/chains';
import { Document } from '@langchain/core/documents';
import { Pinecone } from '@pinecone-database/pinecone';
import { PromptTemplate } from '@langchain/core/prompts';
import { fetchUserState } from '@/lib/fetchUserState';
import { notaryPrompt } from './lib/prompts';
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { auth } from "@clerk/nextjs";
import { HumanMessage, AIMessage } from "langchain/schema";

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

  // Query Pinecone index and return top matches
  const queryResponse = await index.query({
    topK: 25,
    vector: queryEmbedding,
    includeMetadata: true,
    includeValues: true,
  });

  console.log(`Found ${queryResponse.matches.length} matches...`);
  console.log(`Asking question: ${question}...`);

  const userState = await fetchUserState();
  const promptTemplate = new PromptTemplate({
    template: notaryPrompt,
    inputVariables: ['context', 'userState', 'memory']
  });

  const llm = new OpenAI({ temperature: 0.2 });

  // Initialize or load existing chat history
  let memory = new BufferMemory({
    chatHistory: new ChatMessageHistory([]),
  });

  // Retrieve and log existing messages
  let pastMessages = await memory.chatHistory.getMessages();
  console.log('Initial chat history:', pastMessages);

  pastMessages.push(new HumanMessage(question));

  // Update and log memory with the new question
  memory.chatHistory.addMessage(new HumanMessage(question));
  console.log('Updated chat history with question:', await memory.chatHistory.getMessages());

  const chain = loadQAStuffChain(llm);

  // Extract and concatenate page content from matched documents
  const concatenatedPageContent = queryResponse.matches
    .map((match) => match.metadata?.pageContent ?? "")
    .join(" ");
  
  console.log(`Concatenated Results: ${concatenatedPageContent}...`);

  // Format the query using the custom prompt template, including memory content
  const formattedQuestion = await promptTemplate.format({
    context: concatenatedPageContent,
    userState: userState,
    memory: pastMessages,
  });

  // Execute the chain with input documents and question
  const result = await chain.invoke({
    input_documents: [new Document({ pageContent: formattedQuestion })],
    question: question,
  });

  // Update and log chat history with the assistant's response
  memory.chatHistory.addMessage(new AIMessage(result.text));
  console.log('Final chat history:', await memory.chatHistory.getMessages());

  console.log(`Answer: ${result.text}`);
  return result.text;
};

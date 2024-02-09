import { OpenAIEmbeddings, OpenAI } from '@langchain/openai';
import { loadQAStuffChain } from 'langchain/chains';
import { Document } from '@langchain/core/documents';
import { Pinecone } from '@pinecone-database/pinecone';
import { PromptTemplate } from '@langchain/core/prompts';
import { fetchUserState } from '@/lib/fetchUserState';
import { notaryPrompt } from './lib/prompts';
import { BufferMemory, ChatMessageHistory, BufferWindowMemory } from "langchain/memory";
import { auth } from "@clerk/nextjs";
import { HumanMessage, AIMessage } from "langchain/schema";
import { promises as fs } from 'fs';
import path from 'path'

// Initialize or load existing chat history
let memory = new BufferWindowMemory({
  chatHistory: new ChatMessageHistory([]),
  memoryKey: 'chat_history',
  returnMessages:true,
  k:5
});

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
    inputVariables: ['context', 'userState', 'chat_history', 'knowledge']
  });

  const llm = new OpenAI({ temperature: 0.5 });

  

  // Retrieve existing messages
  let pastMessages = await memory.chatHistory.getMessages();
  console.log('Initial chat history:', pastMessages);

  // Check if the last message is different from the current question to prevent duplicates
  if (!(pastMessages.length && pastMessages[pastMessages.length - 1].content === question)) {
    memory.chatHistory.addUserMessage(question);
    console.log('Question added to chat history:', question);
  } else {
    console.log('Question is a duplicate and was not added:', question);
  }

  // Create the chain
  const chain =  loadQAStuffChain(llm);

  // Extract and concatenate page content from matched documents
  const concatenatedPageContent = queryResponse.matches
    .map((match) => match.metadata?.pageContent ?? "")
    .join(" ");
  
  console.log(`Concatenated Results: ${concatenatedPageContent}...`);

  // Search local Markdown files
  const lessonDirectory = path.join(process.cwd(), 'public', 'lessons');
  const knowledge = await searchLocalMarkdownFiles(question, lessonDirectory);

  if (knowledge.length > 0) {
    console.log("Search results found:");
    knowledge.forEach(knowledge => {
      console.log(`File: ${knowledge.file}, Snippet: ${knowledge.snippet}`);
    });
  } else {
    console.log("No matches found.");
  } // This closing brace ends the else block

  // Format the query using the custom prompt template, including memory content
  const formattedQuestion = await promptTemplate.format({
    context: concatenatedPageContent,
    knowledge: knowledge,
    userState: userState,
    chat_history: pastMessages,
  });
  console.log(`Model Formatted Question: ${formattedQuestion}...`);
  // Execute the chain with input documents and question
  const result = await chain.invoke({
    input_documents: [new Document({ pageContent: formattedQuestion })],
    question: question,
  });

  // Retrieve the current chat history to check for duplicates
  let currentMessages = await memory.chatHistory.getMessages();

  // Check if the last message is an AI message with the same content to prevent duplicates
  if (!(currentMessages.length && currentMessages[currentMessages.length - 1].content === result.text && currentMessages[currentMessages.length - 1] instanceof AIMessage)) {
      memory.chatHistory.addAIChatMessage(result.text);
      console.log('AI response added to chat history.');
  } else {
      console.log('Duplicate AI response detected and not added.');
  }

  console.log('Final chat history:', await memory.chatHistory.getMessages());

  console.log(`Answer: ${result.text}`);
  return result.text;
};


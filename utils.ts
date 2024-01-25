import { OpenAIEmbeddings, OpenAI } from '@langchain/openai';
import { loadQAStuffChain } from 'langchain/chains';
import { Document } from '@langchain/core/documents';
import { Pinecone } from '@pinecone-database/pinecone';
import { PromptTemplate } from 'langchain/prompts';

export const queryPineconeVectorStoreAndQueryLLM = async (
  apiKey: string,
  environment: string,
  indexName: string,
  question: string
) => {
  // Initialize Pinecone client
  const pinecone = new Pinecone({ apiKey, environment });

  // Access the Pinecone index
  const index = pinecone.index(indexName);

  // Create query embedding
  const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);

  // Query Pinecone index and return top 10 matches
  const queryResponse = await index.query({
    topK: 10,
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
    const promptTemplate = new PromptTemplate({
      template: "You are a helpful Notary expert AI assistant. Use the following pieces of context to answer the question at the end. If you don't know the answer, just say you don't know. DO NOT try to make up an answer. If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.\n\n{context}",
      inputVariables: ['context']
    });

    // Create an OpenAI instance and load the QAStuffChain
    const llm = new OpenAI({});
    const chain = loadQAStuffChain(llm);

    // Extract and concatenate page content from matched documents
    const concatenatedPageContent = queryResponse.matches
      .map((match) => match.metadata?.pageContent ?? "")
      .join(" ");

    // Format the query using the custom prompt template
    const formattedQuestion = await promptTemplate.format({ context: concatenatedPageContent });

    // Execute the chain with input documents and question
    const result = await chain.invoke({
      input_documents: [new Document({ pageContent: formattedQuestion })],
      question: question,
    });

    // Log the answer
    console.log(`Answer: ${result.text}`);
    return result.text;
  } else {
    // Log that there are no matches, so GPT-3 will not be queried
    console.log('Since there are no matches, GPT-3 will not be queried.');
  }
};

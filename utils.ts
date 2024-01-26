import { OpenAIEmbeddings, OpenAI } from '@langchain/openai';
import { loadQAStuffChain } from 'langchain/chains';
import { Document } from '@langchain/core/documents';
import { Pinecone } from '@pinecone-database/pinecone';
import { PromptTemplate } from '@langchain/core/prompts';
import { fetchUserState } from '@/lib/fetchUserState';

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
      template: "You are an AI assistant specialized in Notary practices. Use the detailed context provided in {context} to give comprehensive, informative responses. When addressing questions, include 'In the state of {userState}' at the beginning of your response if state-specific details are crucial. If the state context is irrelevant to the answer, focus on providing a rich, well-explained response without it. Should you encounter a query outside your expertise, respond with 'I don't have information on that topic, as my expertise is limited to notarial matters.' In cases where questions deviate from the provided context or notarial topics, gently remind the user that your responses are tailored to notarial inquiries based on the specific context given. Aim to deliver responses that are not only correct but also enriched with relevant explanations, examples, and insights to thoroughly address the user's inquiries.",
      inputVariables: ['context', 'userState']
    });

    // Create an OpenAI instance and load the QAStuffChain
    const llm = new OpenAI({ temperature: 0.3});
    const chain = loadQAStuffChain(llm);

    // Extract and concatenate page content from matched documents
    const concatenatedPageContent = queryResponse.matches
      .map((match) => match.metadata?.pageContent ?? "")
      .join(" ");

    // Format the query using the custom prompt template
    const formattedQuestion = await promptTemplate.format({ context: concatenatedPageContent, userState:userState });

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

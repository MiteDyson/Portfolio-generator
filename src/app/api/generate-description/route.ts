import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google AI client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  const { repoName, repoDescription, repoLanguage } = await request.json();

  if (!repoName) {
    return NextResponse.json({ error: 'Repository info is required' }, { status: 400 });
  }

  try {
    // Select the Gemini model. 'gemini-1.5-flash' is fast and efficient for this task.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Craft the prompt for Gemini
    const prompt = `You are an expert copywriter for developer portfolios. Your task is to rewrite a GitHub repository description to be more engaging and professional. Focus on the project's purpose and technology. Keep it concise (2-3 sentences).

    Project Name: "${repoName}"
    Main Language: ${repoLanguage}
    Current Description: "${repoDescription || 'No description provided.'}"
    
    New Description:`;

    // Generate the content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const newDescription = response.text();

    return NextResponse.json({ description: newDescription });

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json({ error: 'Failed to generate description from AI.' }, { status: 500 });
  }
}
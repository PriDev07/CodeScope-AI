import { NextResponse } from 'next/server';
import groq, { getPromptTemplate } from '@/lib/groq';

export async function POST(request: Request) {
  try {
    const { title, body, fileTree } = await request.json();

    if (!title || !fileTree) {
      return NextResponse.json({ error: 'Missing title or fileTree' }, { status: 400 });
    }
    
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ API key is not configured on the server.' }, { status: 500 });
    }

    const truncatedTree = fileTree.slice(0, 300).join('\n');
    const prompt = getPromptTemplate(title, body || 'No description provided.', truncatedTree);

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
    });

    const resultStr = completion.choices[0]?.message?.content;
    
    if (!resultStr) {
      throw new Error('No response from AI');
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(resultStr);
    } catch (e) {
      return NextResponse.json({ 
        error: 'AI response was not valid JSON',
        rawResponse: resultStr
      }, { status: 500 });
    }

    return NextResponse.json(parsedResult);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error executing AI analysis' }, { status: 500 });
  }
}

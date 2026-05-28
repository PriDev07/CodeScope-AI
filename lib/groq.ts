import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const getPromptTemplate = (title: string, body: string, fileTree: string) => {
  return `You are an expert software engineer helping a contributor navigate an open source codebase.

ISSUE TITLE: ${title}

ISSUE DESCRIPTION:
${body}

REPOSITORY FILE STRUCTURE:
${fileTree}

Your task:
1. Analyze the issue and understand what part of the system it affects
2. From the file structure alone (no code content), identify the most relevant files
3. Return a JSON object with this exact shape:
{
  "startingFile": "path/to/most/important/file",
  "startingReason": "one sentence why this is the best entry point",
  "relevantFiles": [
    { "path": "file/path", "reason": "why this file matters for this issue" }
  ],
  "investigationSteps": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ..."
  ],
  "summary": "2-3 sentence plain English explanation of where the bug/feature likely lives"
}

Return only valid JSON. No markdown, no explanation outside the JSON.`;
};

export default groq;

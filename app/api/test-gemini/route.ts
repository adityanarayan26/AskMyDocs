import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

export const runtime = "nodejs";

export async function GET() {
  const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY!,
    model: "models/gemini-pro",
    apiVersion: "v1",
  });

  const res = await model.invoke([
    new HumanMessage("Say hi"),
  ]);

  return NextResponse.json({ reply: res.text });
}
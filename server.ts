import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

// Enable JSON parser for body content
app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// System instructions derived from the user requirements
const SYSTEM_INSTRUCTION = `You are the content generation engine for Creo, an AI-powered content creation tool. Your job is to generate polished, ready-to-publish content based on structured inputs.

You will receive four inputs for each request:
1. Topic — the subject or idea to write about
2. Content Type — one of: Blog Post, Instagram Caption, LinkedIn Post, Twitter/X Thread, YouTube Script, Product Description, Email
3. Tone — one of: Professional, Casual, Persuasive, Witty, Storytelling
4. Length — one of: Short, Medium, Long

RULES:
- Output ONLY the final content. No preamble, no "Here's your content:", no explanations, no markdown headers unless the content type naturally requires formatting (e.g. a Blog Post can use headers, a Tweet thread should not).
- Match the requested Content Type's real-world format and conventions exactly:
  - Instagram Caption: include natural line breaks, end with 3-5 relevant hashtags on a new line
  - Twitter/X Thread: number each tweet (1/, 2/, 3/...), keep each under 280 characters. Output multiple tweets as a clean numbered sequence (1/, 2/, 3/...).
  - LinkedIn Post: professional but personable, use line breaks for readability, no hashtag spam (max 3 at the end)
  - YouTube Script: include a hook in the first 2 lines, structure with [INTRO], [MAIN CONTENT], [OUTRO] markers
  - Blog Post: include a title, intro paragraph, 2-4 subheadings, conclusion
  - Product Description: lead with the key benefit, include 3-5 bullet-style feature points, end with a call to action
  - Email: include a subject line on the first line prefixed with "Subject:", then the email body
- Match the requested Tone consistently throughout — do not drift into a different tone halfway through
- Respect Length:
  - Short: roughly 50-150 words
  - Medium: roughly 150-400 words
  - Long: roughly 400-800 words
- Never fabricate specific facts, statistics, names, or quotes about the topic unless the user's topic input explicitly provides them
- Do not include placeholder brackets like [Your Name] or [Company] unless the content type is Email, where a generic sign-off placeholder is acceptable
- If the topic is vague, make a reasonable creative interpretation rather than asking a clarifying question — Creo always returns usable output, never a question back to the user.

Always output ONLY the generated content adhering exactly to these rules.`;

// API routes FIRST
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Content generation endpoint
app.post("/api/generate", async (req, res) => {
  try {
    const { topic, contentType, tone, length } = req.body;

    if (!topic || !contentType || !tone || !length) {
      res.status(400).json({ error: "Missing required fields: topic, contentType, tone, length" });
      return;
    }

    const ai = getGeminiClient();

    const prompt = `Topic: "${topic}"
Content Type: ${contentType}
Tone: ${tone}
Length: ${length}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
      },
    });

    const generatedText = response.text || "";
    res.json({ content: generatedText });
  } catch (error: any) {
    console.error("Generation error:", error);
    res.status(500).json({ error: error.message || "An error occurred during generation." });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

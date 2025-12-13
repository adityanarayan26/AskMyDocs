# AskMyDocs

AskMyDocs is a simple Retrieval-Augmented Generation (RAG) application built with Next.js. It allows users to upload documents and ask questions in natural language, with answers generated using relevant content from the uploaded files.

---

## Features

- Upload PDF and DOCX files (one at a time)
- Automatic text parsing and chunking
- Vector embeddings using Gemini (`text-embedding-004`)
- Semantic search with Pinecone vector database
- Intelligent chatbot using Groq (Llama 3.1)
- Supports normal chat and document-based Q&A
- Answers include document name references
- Full observability and tracing with Langfuse

---

## Tech Stack

- **Frontend / Backend:** Next.js (App Router, API Routes), TypeScript
- **Vector Database:** Pinecone
- **Embeddings:** Google Gemini
- **LLM (Chat):** Groq (Llama 3.1)
- **Database:** Supabase (document metadata)
- **Observability:** Langfuse

---

## How It Works

1. User uploads a document
2. Text is extracted, chunked, and embedded
3. Embeddings are stored in Pinecone with metadata
4. User asks a question in chat
5. The system decides between:
   - Normal conversational response
   - Retrieval from Pinecone for document-based answers
6. The LLM generates an answer with source references
7. Each step is traced and logged in Langfuse

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables

Create a `.env.local` file and add:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Pinecone
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX_NAME=your_index_name

# Gemini (Embeddings)
GEMINI_API_KEY=your_gemini_key

# Groq (Chat)
GROQ_API_KEY=your_groq_key

# Langfuse
LANGFUSE_PUBLIC_KEY=your_langfuse_public_key
LANGFUSE_SECRET_KEY=your_langfuse_secret_key
LANGFUSE_HOST=https://cloud.langfuse.com
```

### 3. Run the app
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Observability with Langfuse

Each chat request is traced in Langfuse, including:
- User input
- Document retrieval from Pinecone
- LLM generation
- Final response output

This helps with debugging, monitoring, and prompt iteration.

---

## Notes

- Gemini free tier has strict rate limits; retry and backoff logic is implemented.
- The system uses deterministic routing instead of native LLM tool calling for stability.
- Designed to be simple, extensible, and production-oriented.

---

## Demo

A Loom video demonstrating document upload, chat interaction, and Langfuse tracing is included as part of the submission.

---

## License

This project is for educational and assignment purposes.

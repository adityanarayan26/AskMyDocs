# AskMyDocs

**AskMyDocs** is an intelligent Retrieval-Augmented Generation (RAG) application that allows users to upload documents (PDF, Docx, TXT) and chat with them using AI. It simplifies complex information by organizing your documents and providing instant, accurate answers to your questions.

## Features

-   **📄 Document Upload**: Support for PDF, Word documents (.docx), and text files.
-   **🔍 AI-Powered Analysis**: Uses Pinecone for vector storage and embedding search to find relevant context.
-   **💬 Interactive Chat**: Chat with your documents using a modern, responsive interface.
-   **🤖 Intelligent Responses**: Powered by LangChain and Google Generative AI (Gemini).
-   **🔐 Secure Authentication**: Integrated with Supabase Auth for secure user management.
-   **🎨 Premium UI**: Features a sleek, monochrome aesthetics design with glassmorphism effects and smooth animations using Framer Motion.
-   **📱 Fully Responsive**: Optimized for both desktop and mobile devices.
-   **🗑️ Document Management**: Easily upload and delete documents from your library.

## Tech Stack

This project is built with a modern web development stack:

-   **Framework**: [Next.js 15+](https://nextjs.org/) (App Directory)
-   **Language**: TypeScript
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **Backend/Database**: [Supabase](https://supabase.com/) (PostgreSQL & Auth)
-   **Vector Database**: [Pinecone](https://www.pinecone.io/)
-   **AI Orchestration**: [LangChain](https://js.langchain.com/)
-   **LLM Provider**: Google Generative AI (Gemini)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Pinecone
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_index_name

# Google Generative AI
GOOGLE_API_KEY=your_google_api_key
```

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/askmydocs.git
    cd askmydocs
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Setup (Supabase)

1.  Create a new Supabase project.
2.  Run the following SQL to create the `documents` table:

    ```sql
    create table documents (
      id uuid primary key,
      user_id uuid references auth.users not null,
      file_name text not null,
      file_type text,
      chunk_count integer,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null
    );

    -- Enable RLS
    alter table documents enable row level security;

    -- Create Policy: Users can see their own documents
    create policy "Users can see own documents"
      on documents for select
      using ( auth.uid() = user_id );

    -- Create Policy: Users can insert their own documents
    create policy "Users can insert own documents"
      on documents for insert
      with check ( auth.uid() = user_id );

    -- Create Policy: Users can delete their own documents
    create policy "Users can delete own documents"
      on documents for delete
      using ( auth.uid() = user_id );
    ```

## License

MIT

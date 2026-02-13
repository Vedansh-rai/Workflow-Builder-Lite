# Workflow Builder Lite

A single-page web application for defining and executing text processing workflows using LLMs.

## Features

- **Workflow Creation**: Define multi-step workflows (2-4 steps) with custom instructions.
- **Step Types**: 
    - **Clean Text**: Normalize and format text.
    - **Summarize**: Create concise summaries.
    - **Translate**: Translate text to a target language.
    - **Simplify Language**: Rewrite text for better accessibility (5th-grade level).
- **Execution**: Run workflows on input text and view intermediate and final results.
- **Live Preview**: Test workflows in real-time before saving.
- **History**: View the last 5 workflow executions.
- **Status Dashboard**: Monitor backend, database, and LLM API connectivity.

## Prerequisites

- Node.js (v18 or higher)
- API Key (One of the following):
    - Groq (Recommended for speed)
    - OpenAI
    - Google Gemini
    - Anthropic Claude

## Installation

1.  **Clone the repository**
2.  **Backend Setup**:
    ```bash
    cd workflow-builder/backend
    npm install
    ```
    Create a `.env` file in `workflow-builder/backend` with your API key:
    ```env
    PORT=3001
    # Add one of the following:
    GROQ_API_KEY=gsk_...
    OPENAI_API_KEY=sk-...
    GEMINI_API_KEY=...
    ANTHROPIC_API_KEY=sk-ant-...
    ```

3.  **Frontend Setup**:
    ```bash
    cd workflow-builder/frontend
    npm install
    ```

## How to Run

You need to run both the backend and frontend servers in separate terminals.

1.  **Start Backend**:
    ```bash
    cd workflow-builder/backend
    node server.js
    ```
    Server runs on `http://localhost:3001`.

2.  **Start Frontend**:
    ```bash
    cd workflow-builder/frontend
    npm run dev
    ```
    Frontend runs on `http://localhost:5173`.

## Implementation Status

- [x] Backend API (Express, SQLite)
- [x] Frontend UI (React, Tailwind)
- [x] Workflow CRUD
- [x] Workflow Execution with Multiple Providers
- [x] Run History
- [x] Status Page
- [x] Custom Steps (Translate, Simplify Language)

## Future Enhancements

- Export/Import workflows
- User authentication
- Drag-and-drop step reordering
- Real-time streaming responses

## Deployment

### Render (Recommended)
This repository is configured for effortless deployment on [Render](https://workflow-builder-lite-qaz1.onrender.com/).

1.  Sign up for Render.
2.  Click **New +** -> **Web Service**.
3.  Connect this repository.
4.  Render will auto-detect the `render.yaml` and configure the build/start commands.
5.  **Critical**: Add your environment variables (e.g., `GROQ_API_KEY`) in the Render dashboard.

**Note**: On Render's free tier, the SQLite database (`workflow-builder.db`) is ephemeral. It will reset whenever the server restarts or deploys. For persistent data, use a managed database like PostgreSQL.

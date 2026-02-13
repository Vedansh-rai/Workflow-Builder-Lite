# AI Notes

## AI Usage vs Manual Implementation

### AI-Generated Components
- **Scaffolding**: Project structure, initial file creation, and boilerplate code for Express and React.
- **UI Components**: Tailwind CSS styling and layout for `Sidebar`, `Navbar`, and `WorkflowBuilder`.
- **Database**: SQLite schema and initialization logic.
- **LLM Integration**: Base logic for connecting to different LLM providers (Groq, OpenAI, etc.).
- **Resume Parsing**: Used `pdftotext` to extract content from `AI.pdf`.

### Manual Verification & Refinement
- **Workflow Logic**: Manually adjusted the step execution logic in `llmService.js` to support new step types ("Translate", "Simplify Language").
- **API Configuration**: Verified port settings (Backend: 3001, Frontend: 5173) and CORS configuration.
- **Feature Updates**: Manually replaced "Extract Key Points" and "Tag Category" with "Translate" and "Simplify Language" in the frontend state management.
- **Testing**: Performed automated browser testing to verify the "Live Preview" and specific workflow steps.

## LLM Provider Details

**Primary Provider Used**: Groq
**Model**: `llama-3.3-70b-versatile`

**Reasoning**:
- **Speed**: Groq provides near-instant inference, which is critical for the "Live Preview" feature to feel responsive.
- **Capability**: Llama 3.3 70B offers performance comparable to GPT-4 class models, sufficient for text processing tasks like translation and simplification.
- **Cost**: Efficient inference for high-volume text processing.

**Alternative Providers**:
- The application is designed to be provider-agnostic and also supports OpenAI (`gpt-4o`), Google Gemini (`gemini-1.5-flash`), and Anthropic Claude (`claude-3-5-sonnet`).

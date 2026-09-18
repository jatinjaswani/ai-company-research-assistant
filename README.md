# 🔍 AI Company Research Assistant

An advanced AI-powered application that enables users to research any company by providing either the company name or its website URL. The application automatically gathers information from the company's website and publicly available sources, analyzes it using AI, identifies competitors, and generates a professional downloadable PDF report.

## ✨ Features

### Core Features
- **🏢 Company Research**: Research any company by name or website URL
- **🌐 Website Crawling**: Intelligently crawl important pages (About, Products, Services, Contact, etc.)
- **🤖 AI-Powered Analysis**: Generate comprehensive company summaries and insights using OpenRouter
- **🔍 Competitor Identification**: Automatically identify 3-5 main competitors in the same industry
- **📊 AI-Generated Insights**: Identify pain points, opportunities, and business model analysis
- **📥 PDF Generation**: Professional downloadable reports with all company and competitor data
- **💬 Discord Integration** (Bonus): Auto-send reports to Discord with applicant details
- **🎯 Model Selection**: Choose from multiple AI models (Claude, GPT-4o, Gemini, Llama, etc.)

### User Experience
- ChatGPT-style interface with real-time chat
- Responsive design (Desktop & Mobile)
- Dark theme with professional styling
- Settings panel for API configuration
- Loading indicators and error handling

## 🛠️ Tech Stack

### Backend
- **Next.js** - Full-stack React framework
- **Node.js** - Runtime environment
- **Axios** - HTTP client
- **Cheerio** - HTML parsing for web crawling
- **jsPDF + html2canvas** - PDF generation
- **discord.js** - Discord bot integration

### Frontend
- **React** - UI framework
- **CSS Modules** - Styling
- **Axios** - API communication

### External APIs
- **OpenRouter** - AI model provider (Claude, GPT-4o, Gemini, Llama, etc.)
- **Serper.dev** - Search and information gathering
- **Discord API** - Discord integration (Bonus)

## 📋 Prerequisites

Before you begin, ensure you have the following:

1. **Node.js** (v16 or higher)
2. **npm** or **yarn** package manager
3. **OpenRouter API Key** - [Get it here](https://openrouter.ai)
4. **Serper.dev API Key** - [Get it here](https://serper.dev)
5. **Discord Bot Token** (Optional, for bonus feature) - [Create bot here](https://discord.com/developers/applications)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-company-research-assistant
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# OpenRouter API
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Serper.dev API
SERPER_API_KEY=your_serper_api_key_here

# Discord (Optional - for bonus feature)
DISCORD_BOT_TOKEN=your_discord_bot_token_here
```

**Note**: API keys are configured through the UI settings panel, not required in environment variables.

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## 📖 How to Use

### Basic Research Flow

1. **Configure API Keys**:
   - Click the settings button in the sidebar
   - Enter your OpenRouter API Key
   - Enter your Serper.dev API Key
   - Click "Save Configuration"

2. **Select AI Model**:
   - Choose from available models:
     - Claude Sonnet 4.5
     - Claude Haiku 4.5
     - GPT-4o
     - Gemini 1.5 Pro
     - Llama 3.1 70B

3. **Research a Company**:
   - Enter a company name (e.g., "Apple") or website URL (e.g., "apple.com")
   - Press Enter or click "Research"
   - Wait for the AI analysis to complete

4. **Download Report**:
   - Click "Download PDF" to get a professional report
   - Report includes company info, analysis, and competitors

5. **Send to Discord** (Bonus):
   - Configure Discord Bot Token and Channel ID in settings
   - Enter your applicant name and email
   - Click "Send to Discord" to share the report

## 🔧 API Endpoints

### `/api/research` (POST)
Researches a company and generates analysis.

**Request:**
```json
{
  "company": "Apple",
  "model": "claude-sonnet-4-20250514",
  "serperKey": "your_serper_key",
  "openrouterKey": "your_openrouter_key"
}
```

**Response:**
```json
{
  "company": "Apple",
  "website": "https://www.apple.com",
  "analysis": {
    "overview": "...",
    "products": "...",
    "targetMarket": "...",
    "businessModel": "...",
    "painPoints": "...",
    "industry": "...",
    "differentiators": "..."
  },
  "competitors": [
    {
      "name": "Microsoft",
      "website": "https://www.microsoft.com",
      "description": "..."
    }
  ],
  "generatedAt": "2024-01-01T12:00:00.000Z"
}
```

### `/api/generate-pdf` (POST)
Generates a professional PDF report.

**Request:**
```json
{
  "report": { /* report object from /api/research */ }
}
```

**Response**: PDF file (binary)

### `/api/send-to-discord` (POST)
Sends report to Discord channel.

**Request:**
```json
{
  "botToken": "your_discord_bot_token",
  "channelId": "your_channel_id",
  "applicantName": "John Doe",
  "applicantEmail": "john@example.com",
  "company": "Apple",
  "website": "https://www.apple.com",
  "pdfData": "base64_encoded_pdf"
}
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

2. **Connect to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables (if needed)
   - Click "Deploy"

3. **Your URL**: The deployment will provide a public URL like `https://your-app.vercel.app`

### Alternative Deployment Options

#### Netlify
```bash
npm run build
# Deploy the .next folder
```

#### Docker
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | OpenRouter API key for AI models | No* |
| `SERPER_API_KEY` | Serper.dev API key for search | No* |
| `DISCORD_BOT_TOKEN` | Discord bot token for integration | No (bonus) |

*Can be configured through UI settings panel

## 🎯 Scoring Breakdown

- **Company Research (15 points)**: Support company name/URL, identify official website, retrieve company info
- **Website Crawling & Data Extraction (15 points)**: Intelligent page discovery, duplicate detection, content extraction
- **OpenRouter AI Integration (15 points)**: Model selection, high-quality insights, pain point generation
- **Serper.dev Integration (10 points)**: Effective search for company info and competitors
- **Competitor Analysis (10 points)**: Identify 3-5 competitors, display name and website
- **PDF Report Generation (10 points)**: Professional PDF with all required information
- **Deployment & Documentation (5 points)**: Public URL, README, setup instructions
- **Discord Integration (Bonus 10 points)**: Bot integration, auto-sending reports, file uploads
- **Additional Enhancements (Bonus 10 points)**: Outstanding UI, animations, optimizations

## 🐛 Troubleshooting

### "API Key Invalid" Error
- Verify your API keys are correct
- Check API key format and expiration
- Ensure keys have proper permissions

### "Failed to Crawl Website" Error
- Website may block automated crawling
- Try with a different company URL
- Check internet connection

### "Discord Send Failed" Error
- Verify bot has permission to send messages
- Check channel ID is correct
- Ensure bot token is valid

### Slow Response Time
- Websites with large content take longer to crawl
- AI model selection affects speed (Haiku is faster than Sonnet)
- Consider network connectivity

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Serper.dev Documentation](https://serper.dev/docs)
- [Discord.js Guide](https://discordjs.guide/)
- [jsPDF Documentation](http://html2pdf.cluster.ws/l?l=en)

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and enhancement requests.

## 📄 License

This project is open source and available under the MIT License.

## 🎓 Created for

AI Development Hiring Challenge - Relu Consultancy

---

**Built with ❤️ using Next.js, OpenRouter, and Serper.dev**

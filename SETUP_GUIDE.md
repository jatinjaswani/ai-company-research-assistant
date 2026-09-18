# 📁 Project Structure & Setup Guide

## Project Directory Structure

```
ai-company-research-assistant/
├── pages/
│   ├── api/
│   │   ├── research.js           # Main research endpoint
│   │   ├── generate-pdf.js       # PDF generation endpoint
│   │   └── send-to-discord.js    # Discord integration endpoint
│   ├── _app.jsx                  # Next.js app wrapper
│   ├── _document.jsx             # Custom document
│   └── index.jsx                 # Main UI page
├── public/
│   ├── favicon.ico
│   └── (static assets)
├── styles/
│   ├── globals.css               # Global styles
│   └── Home.module.css           # Page-specific styles
├── utils/
│   ├── serper.js                 # Serper.dev utilities
│   ├── openrouter.js             # OpenRouter utilities
│   └── pdf-generator.js          # PDF generation helpers
├── .env.local                    # Environment variables (local)
├── .env.production               # Production env variables
├── .gitignore                    # Git ignore rules
├── next.config.js                # Next.js configuration
├── package.json                  # Project dependencies
├── package-lock.json             # Dependency lock file
└── README.md                     # Documentation
```

## 🚀 Quick Start Guide

### Step 1: Create Next.js Project
```bash
npx create-next-app@latest ai-company-research-assistant --typescript=false --tailwind=false
cd ai-company-research-assistant
```

### Step 2: Install Dependencies
```bash
npm install axios cheerio jspdf html2canvas discord.js form-data
```

### Step 3: File Setup

#### Create directory structure:
```bash
mkdir -p pages/api
mkdir -p styles
mkdir -p utils
```

#### Copy files:
1. Copy `pages-api-research-updated.js` → `pages/api/research.js`
2. Copy `pages-api-pdf.js` → `pages/api/generate-pdf.js`
3. Copy `pages-api-discord.js` → `pages/api/send-to-discord.js`
4. Copy `pages-index-final.jsx` → `pages/index.js`
5. Copy `styles-globals.css` → `styles/globals.css`
6. Copy `next.config.js` → `next.config.js`

### Step 4: Create .env.local
```bash
cat > .env.local << 'EOF'
# These are configured through the UI, not required here
# But you can pre-fill them if needed
OPENROUTER_API_KEY=
SERPER_API_KEY=
DISCORD_BOT_TOKEN=
EOF
```

### Step 5: Update package.json
Ensure your `package.json` includes:

```json
{
  "name": "ai-company-research-assistant",
  "version": "1.0.0",
  "description": "AI-powered company research assistant",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "cheerio": "^1.0.0-rc.12",
    "discord.js": "^14.14.0",
    "form-data": "^4.0.0",
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1",
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "eslint": "^8.50.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

### Step 6: Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 🔑 Getting API Keys

### OpenRouter
1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up for an account
3. Navigate to "API Keys"
4. Create a new API key
5. Copy the key into the application settings

### Serper.dev
1. Go to [serper.dev](https://serper.dev)
2. Sign up for a free account (50 free searches/month)
3. Go to "API Keys"
4. Copy your API key
5. Add to application settings

### Discord Bot (Optional)
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Go to "Bot" section
4. Click "Add Bot"
5. Copy the bot token
6. Go to "OAuth2" → "URL Generator"
7. Select scopes: `bot`
8. Select permissions: `Send Messages`, `Attach Files`, `Read Message History`
9. Use the generated URL to invite bot to your server
10. Get your Channel ID (right-click channel → Copy ID)
11. Add both to application settings

## 🛠️ Build & Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel login
vercel
```

### Deploy to Netlify
```bash
npm run build
netlify deploy --prod --dir=.next
```

### Deploy with Docker
```bash
# Build image
docker build -t ai-research-assistant .

# Run container
docker run -p 3000:3000 \
  -e OPENROUTER_API_KEY=your_key \
  -e SERPER_API_KEY=your_key \
  ai-research-assistant
```

## 🧪 Testing the Application

### Manual Testing Checklist
- [ ] Start dev server without errors
- [ ] UI loads properly
- [ ] Settings panel opens/closes
- [ ] API keys can be saved
- [ ] Model selection works
- [ ] Research button works with valid API keys
- [ ] Company information is retrieved
- [ ] Competitors are identified
- [ ] PDF can be downloaded
- [ ] Discord integration works (if configured)
- [ ] Mobile responsive design works
- [ ] Chat scrolls properly
- [ ] Error handling displays correctly

## 🔒 Security Considerations

1. **API Keys**: Never commit `.env.local` to git
2. **CORS**: API endpoints are CORS-enabled for the frontend
3. **Timeouts**: All external API calls have timeouts
4. **Error Handling**: Sensitive error details are logged, user-friendly errors shown
5. **Input Validation**: Company names are validated before processing
6. **Rate Limiting**: Consider implementing rate limiting for production

## 📊 Performance Tips

1. **Model Selection**: 
   - Use Haiku or GPT-3.5 for faster responses
   - Use Sonnet or GPT-4o for better quality

2. **Caching**: 
   - Consider caching search results
   - Cache website crawl data for frequently researched companies

3. **Parallel Processing**:
   - Run search and crawl in parallel
   - Process competitors while AI analysis is running

4. **Lazy Loading**:
   - Load CSS modules only when needed
   - Lazy load heavy dependencies

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module cheerio"
**Solution**: 
```bash
npm install cheerio
```

### Issue: API timeouts
**Solution**: Increase timeout in axios calls or use faster AI models

### Issue: CORS errors
**Solution**: Check next.config.js CORS headers are enabled

### Issue: PDF generation memory issues
**Solution**: Reduce content size or use streaming for large PDFs

## 📈 Scaling Considerations

1. **Database**: Add MongoDB/PostgreSQL for storing past reports
2. **Caching**: Implement Redis for caching search results
3. **Queue System**: Use Bull/RabbitMQ for handling multiple concurrent requests
4. **Load Balancing**: Deploy multiple instances behind a load balancer
5. **CDN**: Serve static assets through CDN
6. **Microservices**: Split crawling, AI analysis, and PDF generation into separate services

## 🎯 Next Steps

1. Deploy to Vercel/Netlify
2. Share the public URL
3. Configure Discord integration (optional)
4. Monitor API usage and costs
5. Gather user feedback
6. Implement additional features

---

**Happy Building! 🚀**

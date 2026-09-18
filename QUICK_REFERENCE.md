# 🔍 Quick Reference Guide

## File-by-File Breakdown

### Frontend Files

#### `pages/index.jsx` ⭐
**What it does**: Main React component with chat UI, sidebar settings, and form handling

**Key functions**:
- `handleSearch()` - Calls research API
- `handleDownloadPDF()` - Triggers PDF download
- `handleSendToDiscord()` - Sends report to Discord
- `saveApiConfig()` - Saves API keys to localStorage
- `formatReport()` - Formats report data for display

**Key states**:
- `messages` - Chat messages array
- `currentReport` - Latest research report
- `apiConfig` - OpenRouter & Serper keys
- `discordConfig` - Discord settings

**Customization tips**:
- Change `AVAILABLE_MODELS` array to add/remove AI models
- Modify `styles.sidebar` class to change sidebar width
- Update header text in JSX to rebrand

#### `styles/globals.css`
**What it does**: All styling for the application

**Key sections**:
- `.sidebar` - Left sidebar styles
- `.mainContent` - Right chat area
- `.message` - Chat message styling
- `.header` - Top header bar

**Customization tips**:
- Change `:root` CSS variables for colors
- Modify breakpoints in `@media` queries for responsive design
- Adjust `.message` spacing for different chat appearance

### Backend API Files

#### `pages/api/research.js` 🧠
**What it does**: Core business logic for company research

**Key functions**:
1. `searchWithSerper()` - Searches company info
   - Input: company query, API key
   - Output: search results JSON

2. `extractWebsiteUrl()` - Finds official website
   - Input: company name, search results
   - Output: website URL string

3. `crawlWebsite()` - Scrapes company website
   - Input: website URL
   - Output: extracted content object

4. `analyzeWithAI()` - AI analysis with OpenRouter
   - Input: company data, AI model, API key
   - Output: structured analysis JSON

5. `findCompetitors()` - Identifies competitors
   - Input: company name, industry, AI model, API keys
   - Output: competitors array

**Modification examples**:

*Add a new page to crawl*:
```javascript
const importantPages = [
  '/',
  '/about',
  '/products',
  '/services',
  '/solutions',
  '/contact',
  '/pricing',
  '/blog'  // NEW
];
```

*Change AI model parameters*:
```javascript
model: model,
messages: [...],
max_tokens: 2000,  // Change this
temperature: 0.7   // Add this for more creative
```

*Add a new search parameter*:
```javascript
const response = await axios.post(
  'https://google.serper.dev/search',
  {
    q: query,
    num: 10,
    type: 'news'  // NEW - search news results
  },
  ...
);
```

#### `pages/api/generate-pdf.js`
**What it does**: Generates professional PDF reports

**Key sections**:
- HTML template with inline CSS
- Layout and formatting
- Company info section
- Analysis sections
- Competitor section

**Customization tips**:
- Modify HTML template to change PDF layout
- Change colors in `<style>` section
- Add new sections by duplicating existing section template
- Adjust margins with `style={{ marginBottom: '15px' }}`

**Example: Add company size section**:
```javascript
${report.analysis?.companySize ? `
  <div class="section">
    <h2>Company Size</h2>
    <p>${report.analysis.companySize}</p>
  </div>
` : ''}
```

#### `pages/api/send-to-discord.js`
**What it does**: Discord bot integration for sending reports

**Key sections**:
- Message formatting
- Discord API call
- PDF attachment handling
- Error handling

**Customization tips**:
- Modify message format in string template
- Add more details to Discord message
- Change file name format
- Add embed formatting (optional)

**Example: Add more Discord details**:
```javascript
const message = `
📊 **New Company Research Report**
👤 **Applicant Details:**
• Name: ${applicantName || 'N/A'}
• Email: ${applicantEmail || 'N/A'}
🏢 **Research Details:**
• Company: ${company}
• Website: ${website}
💼 **Additional Info:**  // NEW
• Timestamp: ${new Date().toLocaleString()}
• Status: ✅ Complete
`;
```

### Configuration Files

#### `next.config.js`
**Purpose**: Next.js configuration and optimizations

**Key sections**:
- `reactStrictMode` - Error catching in development
- `compress` - Enable gzip compression
- `api.responseLimit` - Max response size (50MB)
- `headers()` - CORS headers for API
- `webpack` - Bundle optimization

**When to modify**:
- Add custom webpack rules
- Change API response limits
- Modify CORS settings
- Add environment variables

#### `package.json`
**Purpose**: Project dependencies and scripts

**Key scripts**:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

**Dependencies to understand**:
- `axios` - HTTP requests
- `cheerio` - HTML parsing (for crawling)
- `jspdf` - PDF generation
- `discord.js` - Discord integration

## Common Modifications

### 1. Add a New AI Model
**File**: `pages/index.jsx`

```javascript
const AVAILABLE_MODELS = [
  'Claude Sonnet 4.5',
  'Your New Model'  // ADD THIS
];

const MODEL_MAPPING = {
  'Claude Sonnet 4.5': 'claude-sonnet-4-20250514',
  'Your New Model': 'model-name-here'  // ADD THIS
};
```

### 2. Change Sidebar Width
**File**: `styles/globals.css`

```css
.sidebar {
  width: 320px;  /* Change this value */
}
```

### 3. Add API Key Validation
**File**: `pages/api/research.js`

```javascript
if (!serperKey || !serperKey.startsWith('64')) {
  return res.status(400).json({ error: 'Invalid Serper key format' });
}
```

### 4. Add Request Logging
**File**: `pages/api/research.js`

```javascript
console.log(`[${new Date().toISOString()}] Research request:`, {
  company,
  model,
  timestamp: new Date()
});
```

### 5. Change PDF Styling
**File**: `pages/api/generate-pdf.js`

```javascript
// In HTML template style section
.header {
  background: #1e40af;  /* Change color */
  color: white;
  padding: 40px;  /* Change padding */
}
```

## Debugging Tips

### Enable Debug Logging
**In API files**:
```javascript
console.log('Step 1: Searching...', { query, timestamp: new Date() });
console.log('Step 2: Found results:', searchResults.length);
```

### Check API Keys
```javascript
// Verify key format
console.log('Key present:', !!apiKey);
console.log('Key starts with:', apiKey?.substring(0, 10));
```

### Test API Endpoints
```bash
# Test research endpoint
curl -X POST http://localhost:3000/api/research \
  -H "Content-Type: application/json" \
  -d '{
    "company": "apple",
    "model": "gpt-3.5-turbo",
    "serperKey": "YOUR_KEY",
    "openrouterKey": "YOUR_KEY"
  }'
```

### Check Network Requests
1. Open browser DevTools (F12)
2. Go to Network tab
3. Perform a research
4. Click on `/api/research` request
5. View request/response in "Response" tab

## Performance Tips

### 1. Reduce PDF Size
**File**: `pages/api/generate-pdf.js`

```javascript
// Limit content length
content.substring(0, 1000)  // Reduce from 2000
```

### 2. Faster Crawling
**File**: `pages/api/research.js`

```javascript
// Reduce pages crawled
const importantPages = ['/', '/about', '/products'];
// Or increase timeout
timeout: 5000  // Faster timeout
```

### 3. Faster AI Response
**File**: `pages/api/research.js`

```javascript
max_tokens: 1000,  // Reduce from 1500
temperature: 0.5   // Lower = faster, more focused
```

### 4. Cache Results
**Addition to API**:
```javascript
// Simple cache in memory
const cache = {};

// Check cache first
if (cache[company]) {
  return res.json(cache[company]);
}

// Save to cache
cache[company] = report;
```

## Error Handling Patterns

### Pattern 1: Graceful Degradation
```javascript
try {
  const data = await crawlWebsite(url);
} catch (error) {
  console.error('Crawl failed:', error);
  // Continue with empty data instead of failing
  return { homepage: '', pages: {} };
}
```

### Pattern 2: User-Friendly Errors
```javascript
try {
  // API call
} catch (error) {
  return res.status(500).json({
    error: 'Failed to analyze company data'  // User-friendly
    // error: error.stack  // Never expose this
  });
}
```

### Pattern 3: Fallback Values
```javascript
const industry = analysis.industry || 'technology';  // Fallback
const competitors = competitors || [];  // Empty array fallback
```

## Testing Checklist

- [ ] Research with company name
- [ ] Research with website URL
- [ ] Download PDF after research
- [ ] Test error handling (invalid input)
- [ ] Test API key validation
- [ ] Test Discord integration (if configured)
- [ ] Test on mobile device
- [ ] Test chat input with Enter/Shift+Enter
- [ ] Test sidebar settings save
- [ ] Test new research button

## Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [OpenRouter Docs](https://openrouter.ai/docs)
- [Serper.dev Docs](https://serper.dev/docs)
- [Cheerio Docs](https://cheerio.js.org/)
- [jsPDF Docs](http://html2pdf.cluster.ws/)
- [Discord.js Docs](https://discord.js.org/#/docs)

## Code Style Guidelines

```javascript
// Good variable names
const companyWebsite = extractWebsiteUrl(...);  // Clear
const url = ...  // Too vague

// Good error messages
return res.status(400).json({ 
  error: 'Serper API key is required in request body' 
});

// Good comments
// Search for company using Serper API
const results = await searchWithSerper(...);

// Good function organization
// 1. Input validation
// 2. Main logic
// 3. Error handling
// 4. Response return
```

## Troubleshooting Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Run `npm install package-name` |
| API returns 401 | Check API keys are valid and not expired |
| Slow responses | Use faster AI model (Haiku, GPT-3.5) |
| PDF download fails | Check report has all required fields |
| Discord not sending | Verify bot has send_messages permission |
| Mobile UI broken | Check responsive breakpoints in CSS |

---

**Tip**: Always test changes locally with `npm run dev` before deploying!

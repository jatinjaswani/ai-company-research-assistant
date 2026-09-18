# 🔐 Environment Variables Documentation

## Overview

The AI Company Research Assistant uses environment variables to configure external API integrations. You can set these in two ways:

1. **Environment Variables** (for deployment)
2. **UI Settings Panel** (at runtime)

## Environment Variables

### `.env.local` (Development)

Create a `.env.local` file in the root directory:

```env
# Optional: Pre-fill these in environment
# Can also be configured through UI settings
OPENROUTER_API_KEY=sk-or-v1-...
SERPER_API_KEY=64f1c...
DISCORD_BOT_TOKEN=MzAxODU0MjA5...
```

### `.env.production` (Production)

For production deployments (Vercel, Netlify, etc.):

```env
OPENROUTER_API_KEY=sk-or-v1-...
SERPER_API_KEY=64f1c...
DISCORD_BOT_TOKEN=MzAxODU0MjA5...
```

## Variables Reference

### 1. OPENROUTER_API_KEY
**Type**: String  
**Required**: No (can be set in UI)  
**Description**: API key for OpenRouter AI services  
**Format**: `sk-or-v1-...`  

**How to get**:
1. Visit [openrouter.ai](https://openrouter.ai)
2. Sign up or login
3. Navigate to Settings → API Keys
4. Create a new key or copy existing key
5. Add to environment or UI settings

**Usage**:
- Used to access Claude, GPT-4o, Gemini, Llama, and other AI models
- Required for AI analysis and competitor identification
- Each API call costs credits based on model and tokens used

**Cost Estimation**:
- Claude Sonnet: ~$0.003 per request
- GPT-4o: ~$0.015 per request
- Claude Haiku: ~$0.0001 per request

### 2. SERPER_API_KEY
**Type**: String  
**Required**: No (can be set in UI)  
**Description**: API key for Serper.dev search service  
**Format**: Alphanumeric string  

**How to get**:
1. Visit [serper.dev](https://serper.dev)
2. Sign up for free account
3. Go to API section
4. Copy your API key
5. Add to environment or UI settings

**Usage**:
- Searches for company information
- Finds official company websites
- Identifies competitors
- Gathers public information for analysis

**Limits**:
- Free tier: 50 searches/month
- Paid tier: Unlimited searches
- Each company research typically uses 2-3 searches

### 3. DISCORD_BOT_TOKEN (Optional - Bonus Feature)
**Type**: String  
**Required**: No (only for Discord integration)  
**Description**: Discord bot token for sending reports to Discord  
**Format**: `MzAxODU0MjA5...` (long alphanumeric string)  

**How to get**:
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give it a name (e.g., "Company Research Bot")
4. Go to "Bot" tab on the left
5. Click "Add Bot"
6. Under "TOKEN", click "Copy"
7. Add to environment or UI settings

**Setup**:
1. In Developer Portal, go to OAuth2 → URL Generator
2. Select scopes: `bot`
3. Select permissions:
   - Send Messages
   - Attach Files
   - Read Message History
   - Embed Links
4. Copy generated URL
5. Paste in browser to invite bot to your server
6. Get your Channel ID:
   - In Discord, enable Developer Mode (Settings → Advanced → Developer Mode)
   - Right-click desired channel
   - Click "Copy Channel ID"
7. Add Channel ID to application settings

**Usage**:
- Sends company research reports to Discord
- Includes PDF attachment
- Sends applicant details
- Requires bot token + channel ID both configured

**Permissions Needed**:
- `SEND_MESSAGES` - Send messages
- `ATTACH_FILES` - Upload files (PDF)
- `EMBED_LINKS` - Send formatted messages
- `READ_MESSAGE_HISTORY` - Read channel messages

## Setting Variables

### Option 1: Environment File (Development)

Create `.env.local`:
```bash
# In terminal
echo 'OPENROUTER_API_KEY=your_key_here' > .env.local
echo 'SERPER_API_KEY=your_key_here' >> .env.local
echo 'DISCORD_BOT_TOKEN=your_token_here' >> .env.local
```

### Option 2: Vercel Deployment

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Go to Settings → Environment Variables
4. Add variables:
   - Key: `OPENROUTER_API_KEY`, Value: `your_key`
   - Key: `SERPER_API_KEY`, Value: `your_key`
   - Key: `DISCORD_BOT_TOKEN`, Value: `your_token`
5. Select environments (Development, Preview, Production)
6. Click "Save"
7. Redeploy project

### Option 3: UI Settings Panel

1. Open application in browser
2. Click ⚙️ (Settings) in sidebar
3. Enter API keys in the settings form
4. Click "Save Configuration"
5. Settings saved to browser localStorage

**Note**: UI-configured keys only persist in that browser. For persistent keys, use environment variables.

### Option 4: Netlify Deployment

1. Go to Netlify Dashboard
2. Select your site
3. Go to Site Settings → Build & Deploy → Environment
4. Add new variables:
   - Key: `OPENROUTER_API_KEY`
   - Value: `your_key`
5. Repeat for other variables
6. Trigger new deployment

## Security Best Practices

### ✅ DO:
- ✓ Store API keys in environment variables
- ✓ Use `.env.local` for development (not committed to git)
- ✓ Rotate keys periodically
- ✓ Use separate keys for development/production
- ✓ Monitor API usage and costs
- ✓ Limit API key permissions

### ❌ DON'T:
- ✗ Commit `.env.local` to git
- ✗ Share API keys publicly
- ✗ Use same key for multiple environments
- ✗ Expose keys in client-side code
- ✗ Log API keys in error messages
- ✗ Use test keys in production

### .gitignore
Ensure `.env.local` is in `.gitignore`:

```
# In .gitignore
.env.local
.env.*.local
.env
node_modules/
.next/
build/
dist/
```

## Testing Configuration

### 1. Test OpenRouter Connection
```bash
curl -X POST "https://openrouter.ai/api/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_OPENROUTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 2. Test Serper Connection
```bash
curl -X POST "https://google.serper.dev/search" \
  -H "X-API-KEY: YOUR_SERPER_KEY" \
  -H "Content-Type: application/json" \
  -d '{"q": "apple.com"}'
```

### 3. Test Discord Bot
Send a test message to verify bot can post:
```
/slash_command or @BotName test
```

## Cost Estimation

### Monthly Cost Examples

**Scenario: 100 Company Researches/Month**

With OpenRouter (using auto model selection):
- Average 1500 tokens per research
- ~$0.003 per research (Haiku model)
- **Total**: $0.30/month

With Serper (free tier):
- 50 searches/month included free
- Additional searches: $25/million

**Recommendation**:
- Start with free tiers to test
- Monitor usage
- Upgrade when needed
- Use cheaper models (Haiku) for production

## API Rate Limits

### OpenRouter
- **Rate Limit**: 200 requests/minute (free tier)
- **Tokens/Minute**: Varies by model
- **Best Practice**: Implement backoff on 429 responses

### Serper
- **Free Tier**: 50 searches/month
- **Paid Tier**: No monthly limit
- **Rate Limit**: 100 requests/second

### Discord
- **Message Rate**: 50 requests/second
- **File Upload**: 8MB max per file
- **Best Practice**: Queue messages if sending many at once

## Troubleshooting

### "Invalid API Key" Error
**Solution**:
1. Verify key format is correct
2. Check key hasn't expired
3. Ensure you copied full key
4. Try creating new key
5. Check API usage in provider dashboard

### "Rate Limited" Error
**Solution**:
1. Wait a few minutes
2. Implement exponential backoff
3. Upgrade to paid plan
4. Distribute requests over time

### "Missing Environment Variable" Error
**Solution**:
1. Check `.env.local` file exists
2. Verify variable name is correct
3. Check for typos
4. Restart development server
5. Verify deployment environment variables are set

### "Discord Bot Not Responding"
**Solution**:
1. Verify bot token is valid
2. Check bot is invited to server
3. Verify bot has necessary permissions
4. Check channel ID is correct
5. Verify Discord API is not down

## Next Steps

1. Get API keys from providers
2. Set environment variables
3. Run `npm run dev`
4. Configure API keys in UI settings
5. Test with a company research
6. Monitor API usage
7. Deploy to production

---

**For more help**: Check the main README.md or SETUP_GUIDE.md

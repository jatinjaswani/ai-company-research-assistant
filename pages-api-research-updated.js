// pages/api/research.js
import axios from 'axios';
import { load } from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { company, model, serperKey, openrouterKey } = req.body;

  if (!company || !serperKey || !openrouterKey) {
    return res.status(400).json({ error: 'Company name, Serper key, and OpenRouter key are required' });
  }

  if (!model) {
    return res.status(400).json({ error: 'AI model is required' });
  }

  try {
    // Step 1: Search for company
    console.log('Step 1: Searching for company...');
    const searchResults = await searchWithSerper(company, serperKey);
    
    // Step 2: Extract website URL
    console.log('Step 2: Extracting website URL...');
    const websiteUrl = extractWebsiteUrl(company, searchResults);
    
    // Step 3: Crawl website
    console.log('Step 3: Crawling website...');
    let crawledData = { homepage: '', pages: {} };
    if (websiteUrl) {
      crawledData = await crawlWebsite(websiteUrl);
    }

    // Step 4: Analyze with AI
    console.log('Step 4: Analyzing with AI...');
    const analysis = await analyzeWithAI(
      { searchResults, crawledData },
      model,
      openrouterKey
    );

    // Step 5: Find competitors
    console.log('Step 5: Finding competitors...');
    const industry = typeof analysis === 'object' && analysis.industry ? analysis.industry : 'technology';
    const competitors = await findCompetitors(company, industry, model, serperKey, openrouterKey);

    // Step 6: Return complete report
    const report = {
      company: company,
      website: websiteUrl || 'Not found',
      analysis,
      competitors: Array.isArray(competitors) ? competitors : [],
      generatedAt: new Date().toISOString()
    };

    return res.status(200).json(report);

  } catch (error) {
    console.error('Research error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to complete research'
    });
  }
}

async function searchWithSerper(query, apiKey) {
  try {
    const response = await axios.post('https://google.serper.dev/search', {
      q: query,
      num: 10
    }, {
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    return response.data;
  } catch (error) {
    console.error('Serper search error:', error.message);
    throw new Error('Failed to search company information with Serper');
  }
}

function extractWebsiteUrl(query, searchResults) {
  const officialSites = searchResults.organic || [];
  
  if (query.includes('http')) {
    return query;
  }

  const queryWords = query.split(' ')[0].toLowerCase();
  const officialResult = officialSites.find(result => {
    try {
      const url = new URL(result.link);
      return url.hostname.includes(queryWords);
    } catch {
      return false;
    }
  });

  return officialResult?.link || officialSites[0]?.link || null;
}

async function crawlWebsite(url) {
  const importantPages = ['/', '/about', '/products', '/services', '/solutions', '/contact', '/pricing'];
  const crawledData = {
    homepage: '',
    pages: {}
  };

  try {
    // Crawl homepage
    const homepageResponse = await axios.get(url, { 
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = load(homepageResponse.data);
    const title = $('title').text() || $('h1').first().text();
    const description = $('meta[name="description"]').attr('content') || '';
    const content = $('body').text().substring(0, 2000);

    crawledData.homepage = {
      title,
      description,
      content: content.trim()
    };

    // Crawl important pages
    for (const page of importantPages) {
      try {
        const pageUrl = new URL(page, url).toString();
        const pageResponse = await axios.get(pageUrl, { 
          timeout: 8000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        const pageHtml = load(pageResponse.data);
        const pageContent = pageHtml('body').text().substring(0, 1500);
        
        if (pageContent.trim().length > 100) {
          crawledData.pages[page] = pageContent.trim();
        }
      } catch (error) {
        // Skip pages that don't exist
      }
    }

    return crawledData;
  } catch (error) {
    console.error('Website crawling error:', error.message);
    return crawledData;
  }
}

async function analyzeWithAI(companyData, model, apiKey) {
  try {
    const prompt = `You are an expert business analyst. Analyze the following company information and provide structured insights.

Company Search Results (top results):
${JSON.stringify(companyData.searchResults?.organic?.slice(0, 3), null, 2)}

Website Information:
Title: ${companyData.crawledData.homepage.title || 'N/A'}
Description: ${companyData.crawledData.homepage.description || 'N/A'}
Content Preview: ${companyData.crawledData.homepage.content?.substring(0, 500) || 'N/A'}

Please provide a JSON response with these exact keys (all as strings):
{
  "overview": "2-3 sentences about the company, what they do, industry",
  "products": "List of main products and services",
  "targetMarket": "Who are their customers and target audience",
  "businessModel": "How they generate revenue",
  "painPoints": "AI-identified pain points their customers might have and opportunities for improvement",
  "industry": "The industry they operate in",
  "differentiators": "What makes them unique compared to competitors"
}

Respond ONLY with valid JSON, no other text.`;

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
        'X-Title': 'Company Research Assistant',
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    const content = response.data.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch {
      // If JSON parsing fails, return as structured text
      return {
        overview: content,
        products: 'See overview',
        targetMarket: 'See overview',
        businessModel: 'See overview',
        painPoints: 'See overview',
        industry: 'unknown',
        differentiators: 'See overview'
      };
    }
  } catch (error) {
    console.error('OpenRouter AI error:', error.message);
    throw new Error('Failed to analyze company data with AI: ' + error.message);
  }
}

async function findCompetitors(companyName, industry, model, serperKey, apiKey) {
  try {
    // Search for competitors using Serper
    const competitorSearch = await searchWithSerper(
      `competitors to ${companyName} ${industry}`,
      serperKey
    );
    
    const prompt = `Given these search results about competitors to "${companyName}":

${JSON.stringify(competitorSearch.organic?.slice(0, 5), null, 2)}

Identify the top 3-5 direct competitors. For each competitor, provide:
- name: Company name
- website: Website URL (if found, otherwise empty string)
- description: Brief description of how they compete

Respond ONLY with a JSON array, no other text. Example format:
[
  {"name": "Company A", "website": "www.companya.com", "description": "Direct competitor in the same market"},
  {"name": "Company B", "website": "www.companyb.com", "description": "Similar product offering"}
]`;

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
        'X-Title': 'Company Research Assistant',
        'Content-Type': 'application/json'
      },
      timeout: 20000
    });

    const content = response.data.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch {
      return [];
    }
  } catch (error) {
    console.error('Competitor search error:', error.message);
    return [];
  }
}

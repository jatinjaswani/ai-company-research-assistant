// pages/index.js
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/globals.css'

const AVAILABLE_MODELS = [
  'Claude Sonnet 4.5',
  'Claude Haiku 4.5',
  'GPT-4o',
  'Gemini 1.5 Pro',
  'Llama 3.1 70B'
];

const MODEL_MAPPING = {
  'Claude Sonnet 4.5': 'claude-sonnet-4-20250514',
  'Claude Haiku 4.5': 'claude-3-5-haiku-20241022',
  'GPT-4o': 'openai/gpt-4o',
  'Gemini 1.5 Pro': 'google/gemini-2.0-pro-exp-02-05',
  'Llama 3.1 70B': 'meta-llama/llama-3.1-70b-instruct'
};

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Claude Sonnet 4.5');
  const [currentReport, setCurrentReport] = useState(null);
  const [apiConfig, setApiConfig] = useState({
    openrouterKey: '',
    serperKey: ''
  });
  const [discordConfig, setDiscordConfig] = useState({
    botToken: '',
    channelId: '',
    applicantName: '',
    applicantEmail: ''
  });
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    // Load configs from localStorage
    const savedApiConfig = localStorage.getItem('apiConfig');
    const savedDiscordConfig = localStorage.getItem('discordConfig');
    if (savedApiConfig) setApiConfig(JSON.parse(savedApiConfig));
    if (savedDiscordConfig) setDiscordConfig(JSON.parse(savedDiscordConfig));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 100) + 'px';
    }
  }, [input]);

  const handleSearch = async () => {
    if (!input.trim()) return;
    if (!apiConfig.serperKey || !apiConfig.openrouterKey) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'error',
        content: '❌ Please configure your API keys (Serper.dev & OpenRouter) in the sidebar settings first.'
      }]);
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/research', {
        company: input,
        model: MODEL_MAPPING[selectedModel],
        serperKey: apiConfig.serperKey,
        openrouterKey: apiConfig.openrouterKey
      }, {
        timeout: 30000
      });

      const report = response.data;
      setCurrentReport(report);

      const analysisMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: formatReport(report)
      };

      setMessages(prev => [...prev, analysisMessage]);

      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        type: 'system',
        content: '✅ Report generated successfully! You can now download the PDF or send it to Discord.'
      }]);

    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: `❌ Error: ${error.response?.data?.error || error.message || 'Failed to complete research'}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const formatReport = (report) => {
    let content = `📊 **${report.company}**\n\n`;

    if (report.analysis?.overview) {
      content += `**Company Overview:**\n${report.analysis.overview}\n\n`;
    }

    if (report.analysis?.products) {
      content += `**Products & Services:**\n${report.analysis.products}\n\n`;
    }

    if (report.analysis?.targetMarket) {
      content += `**Target Market:**\n${report.analysis.targetMarket}\n\n`;
    }

    if (report.analysis?.businessModel) {
      content += `**Business Model:**\n${report.analysis.businessModel}\n\n`;
    }

    if (report.analysis?.painPoints) {
      content += `**🎯 AI-Generated Pain Points & Opportunities:**\n${report.analysis.painPoints}\n\n`;
    }

    if (report.competitors && report.competitors.length > 0) {
      content += `**Competitors:**\n`;
      report.competitors.forEach((comp, idx) => {
        content += `${idx + 1}. **${comp.name}** ${comp.website ? `- ${comp.website}` : ''}\n`;
      });
    }

    return content;
  };

  const handleDownloadPDF = async () => {
    if (!currentReport) return;

    try {
      const response = await axios.post('/api/generate-pdf', {
        report: currentReport
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${currentReport.company.replace(/\s+/g, '_')}_research_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      alert('Failed to download PDF: ' + error.message);
    }
  };

  const handleSendToDiscord = async () => {
    if (!currentReport || !discordConfig.botToken || !discordConfig.channelId) {
      alert('Please configure Discord settings in the sidebar first');
      return;
    }

    try {
      const pdfResponse = await axios.post('/api/generate-pdf', {
        report: currentReport
      }, {
        responseType: 'blob'
      });

      const reader = new FileReader();
      reader.readAsDataURL(pdfResponse.data);
      reader.onload = async () => {
        const base64PDF = reader.result.split(',')[1];

        await axios.post('/api/send-to-discord', {
          botToken: discordConfig.botToken,
          channelId: discordConfig.channelId,
          applicantName: discordConfig.applicantName,
          applicantEmail: discordConfig.applicantEmail,
          company: currentReport.company,
          website: currentReport.website,
          pdfData: base64PDF
        });

        alert('✅ Report sent to Discord successfully!');
      };
    } catch (error) {
      alert('Failed to send to Discord: ' + error.message);
    }
  };

  const saveApiConfig = () => {
    localStorage.setItem('apiConfig', JSON.stringify(apiConfig));
    alert('✅ API configuration saved!');
  };

  const saveDiscordConfig = () => {
    localStorage.setItem('discordConfig', JSON.stringify(discordConfig));
    alert('✅ Discord configuration saved!');
  };

  const handleNewResearch = () => {
    setMessages([]);
    setInput('');
    setCurrentReport(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={styles.container}>
      {/* SIDEBAR */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>🔍 AI Research</h2>
        </div>

        <button 
          className={styles.newResearchBtn}
          onClick={handleNewResearch}
        >
          + New Research
        </button>

        {/* API CONFIGURATION */}
        <div className={styles.settingSection}>
          <div className={styles.settingSectionTitle}>⚙️ API Configuration</div>
          
          <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>OpenRouter API Key</label>
            <input
              type="password"
              value={apiConfig.openrouterKey}
              onChange={(e) => setApiConfig({...apiConfig, openrouterKey: e.target.value})}
              className={styles.settingInput}
              placeholder="sk-or-..."
            />
          </div>

          <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>Serper.dev API Key</label>
            <input
              type="password"
              value={apiConfig.serperKey}
              onChange={(e) => setApiConfig({...apiConfig, serperKey: e.target.value})}
              className={styles.settingInput}
              placeholder="Your Serper key..."
            />
          </div>

          <button 
            className={styles.settingButton}
            onClick={saveApiConfig}
          >
            Save Configuration
          </button>
        </div>

        <div className={styles.divider}></div>

        {/* AI MODEL SELECTION */}
        <div className={styles.settingSection}>
          <div className={styles.settingSectionTitle}>🤖 AI Model</div>
          
          <div className={styles.settingGroup}>
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className={styles.settingSelect}
            >
              {AVAILABLE_MODELS.map(model => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.divider}></div>

        {/* DISCORD INTEGRATION */}
        <div className={styles.settingSection}>
          <div className={styles.settingSectionTitle}>💬 Discord Integration</div>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>
            Auto-send reports to your configured channel
          </p>

          <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>Bot Token</label>
            <input
              type="password"
              value={discordConfig.botToken}
              onChange={(e) => setDiscordConfig({...discordConfig, botToken: e.target.value})}
              className={styles.settingInput}
              placeholder="Your Discord bot token..."
            />
          </div>

          <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>Channel ID</label>
            <input
              type="text"
              value={discordConfig.channelId}
              onChange={(e) => setDiscordConfig({...discordConfig, channelId: e.target.value})}
              className={styles.settingInput}
              placeholder="Your Discord channel ID..."
            />
          </div>

          <div className={styles.divider}></div>

          <div className={styles.settingSectionTitle}>👤 Applicant Details</div>

          <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>Full Name</label>
            <input
              type="text"
              value={discordConfig.applicantName}
              onChange={(e) => setDiscordConfig({...discordConfig, applicantName: e.target.value})}
              className={styles.settingInput}
              placeholder="Your name..."
            />
          </div>

          <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>Email Address</label>
            <input
              type="email"
              value={discordConfig.applicantEmail}
              onChange={(e) => setDiscordConfig({...discordConfig, applicantEmail: e.target.value})}
              className={styles.settingInput}
              placeholder="your.email@example.com"
            />
          </div>

          <button 
            className={styles.settingButton}
            onClick={saveDiscordConfig}
          >
            Save Discord Config
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className={styles.mainContent}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerTitle}>
              <h1>Company Research</h1>
              <span className={styles.liveBadge}>LIVE</span>
            </div>
          </div>

          <div className={styles.headerSubtitle}>
            <h2>🤖 AI-Powered Intelligence</h2>
          </div>

          {messages.length === 0 && (
            <>
              <p className={styles.headerDesc}>
                Know any company in minutes. Enter a company name or website URL to get AI-powered insights, competitor analysis, pain points, and a professional PDF report.
              </p>
              <p className={styles.hint}>
                💡 Configure API keys in the sidebar to get started
              </p>
            </>
          )}
        </div>

        {/* CHAT */}
        <div className={styles.chatContainer}>
          {messages.map((message) => (
            <div key={message.id} className={`${styles.message} ${styles[message.type]}`}>
              <div className={styles.messageContent}>
                {message.content.split('\n').map((line, idx) => (
                  <div key={idx} style={{ marginBottom: '4px' }}>
                    {line.split('**').map((part, i) => 
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {loading && (
            <div className={`${styles.message} ${styles.system}`}>
              <div className={styles.messageContent}>
                <span className={styles.spinner}></span> Researching company...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className={styles.inputArea}>
          <div className={styles.inputWrapper}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a company name or website URL (e.g., 'Apple' or 'apple.com')"
              className={styles.input}
              disabled={loading}
              rows={1}
              style={{ minHeight: '44px', maxHeight: '100px', resize: 'none' }}
            />
            <button
              className={styles.primaryBtn}
              onClick={handleSearch}
              disabled={loading || !input.trim()}
            >
              {loading ? '🔄' : '🚀'} Research
            </button>
          </div>

          {currentReport && (
            <div className={styles.actionButtons}>
              <button
                className={styles.secondaryBtn}
                onClick={handleDownloadPDF}
              >
                📥 Download PDF
              </button>
              <button
                className={styles.discordBtn}
                onClick={handleSendToDiscord}
              >
                💬 Send to Discord
              </button>
            </div>
          )}

          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '12px', textAlign: 'center' }}>
            ENTER TO RESEARCH · SHIFT+ENTER FOR NEW LINE
          </p>
        </div>
      </div>
    </div>
  );
}

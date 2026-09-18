// pages/api/send-to-discord.js
import axios from 'axios';
import { FormData } from 'form-data';
import fs from 'fs';
import path from 'path';

const DISCORD_API_BASE = 'https://discord.com/api/v10';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    botToken,
    channelId,
    applicantName,
    applicantEmail,
    company,
    website,
    pdfData // Base64 encoded PDF
  } = req.body;

  if (!botToken || !channelId) {
    return res.status(400).json({ error: 'Bot token and channel ID are required' });
  }

  try {
    // Create message content
    const message = `
📊 **New Company Research Report**

👤 **Applicant Details:**
• Name: ${applicantName || 'N/A'}
• Email: ${applicantEmail || 'N/A'}

🏢 **Research Details:**
• Company: ${company}
• Website: ${website}

📅 Timestamp: ${new Date().toLocaleString()}
    `.trim();

    // Send message to Discord channel
    const discordMessageResponse = await axios.post(
      `${DISCORD_API_BASE}/channels/${channelId}/messages`,
      {
        content: message
      },
      {
        headers: {
          'Authorization': `Bot ${botToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Send PDF as attachment if available
    if (pdfData) {
      try {
        // Convert base64 to buffer
        const pdfBuffer = Buffer.from(pdfData, 'base64');
        const fileName = `${company.replace(/\s+/g, '_')}_research_report.pdf`;

        // Send file
        const formData = new FormData();
        formData.append('file', pdfBuffer, fileName);
        formData.append('content', '📎 Research Report PDF attached');

        await axios.post(
          `${DISCORD_API_BASE}/channels/${channelId}/messages`,
          formData,
          {
            headers: {
              'Authorization': `Bot ${botToken}`,
              ...formData.getHeaders()
            }
          }
        );
      } catch (fileError) {
        console.error('Error sending PDF to Discord:', fileError);
        // Continue even if PDF fails
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Report sent to Discord successfully'
    });

  } catch (error) {
    console.error('Discord integration error:', error);
    return res.status(500).json({
      error: error.response?.data?.message || error.message || 'Failed to send to Discord'
    });
  }
}

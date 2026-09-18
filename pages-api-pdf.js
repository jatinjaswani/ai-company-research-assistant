// pages/api/generate-pdf.js
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { report } = req.body;

  if (!report) {
    return res.status(400).json({ error: 'Report data is required' });
  }

  try {
    // Create PDF content as HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2563eb;
            margin: 0;
            font-size: 32px;
          }
          .header p {
            color: #666;
            margin: 5px 0;
          }
          .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          .section h2 {
            color: #2563eb;
            border-left: 4px solid #2563eb;
            padding-left: 15px;
            margin-top: 0;
            font-size: 20px;
          }
          .section h3 {
            color: #1e40af;
            margin-top: 15px;
            margin-bottom: 10px;
            font-size: 16px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 15px 0;
          }
          .info-item {
            background: #f9fafb;
            padding: 12px;
            border-radius: 8px;
            border-left: 3px solid #10b981;
          }
          .info-item label {
            font-weight: bold;
            color: #1e40af;
            display: block;
            margin-bottom: 5px;
          }
          .competitor {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 12px;
            border-left: 3px solid #f59e0b;
          }
          .competitor h4 {
            margin: 0 0 8px 0;
            color: #1e40af;
          }
          .competitor-url {
            color: #2563eb;
            text-decoration: none;
            word-break: break-all;
          }
          .pain-points {
            background: #fef3c7;
            padding: 15px;
            border-radius: 8px;
            border-left: 3px solid #f59e0b;
          }
          .pain-points ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          .pain-points li {
            margin-bottom: 8px;
          }
          .footer {
            border-top: 2px solid #e5e7eb;
            padding-top: 15px;
            margin-top: 30px;
            text-align: center;
            color: #999;
            font-size: 12px;
          }
          ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          li {
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${escapeHtml(report.company)}</h1>
          <p>AI-Powered Company Research Report</p>
          <p>Generated on ${new Date(report.generatedAt).toLocaleDateString()}</p>
        </div>

        <div class="section">
          <h2>Company Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Company Name</label>
              <span>${escapeHtml(report.company)}</span>
            </div>
            <div class="info-item">
              <label>Website</label>
              <span>${escapeHtml(report.website)}</span>
            </div>
          </div>
        </div>

        ${report.analysis?.overview ? `
          <div class="section">
            <h2>Company Overview</h2>
            <p>${report.analysis.overview}</p>
          </div>
        ` : ''}

        ${report.analysis?.products ? `
          <div class="section">
            <h2>Products & Services</h2>
            <p>${report.analysis.products}</p>
          </div>
        ` : ''}

        ${report.analysis?.targetMarket ? `
          <div class="section">
            <h2>Target Market</h2>
            <p>${report.analysis.targetMarket}</p>
          </div>
        ` : ''}

        ${report.analysis?.businessModel ? `
          <div class="section">
            <h2>Business Model</h2>
            <p>${report.analysis.businessModel}</p>
          </div>
        ` : ''}

        ${report.analysis?.painPoints ? `
          <div class="pain-points">
            <h2>AI-Generated Pain Points & Opportunities</h2>
            <p>${report.analysis.painPoints}</p>
          </div>
        ` : ''}

        ${report.analysis?.differentiators ? `
          <div class="section">
            <h2>Key Differentiators</h2>
            <p>${report.analysis.differentiators}</p>
          </div>
        ` : ''}

        ${report.competitors && report.competitors.length > 0 ? `
          <div class="section">
            <h2>Competitors Analysis</h2>
            ${report.competitors.map(competitor => `
              <div class="competitor">
                <h4>${escapeHtml(competitor.name || 'Competitor')}</h4>
                ${competitor.website ? `<p><strong>Website:</strong> <a href="${competitor.website}" class="competitor-url">${escapeHtml(competitor.website)}</a></p>` : ''}
                ${competitor.description ? `<p><strong>Description:</strong> ${competitor.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="footer">
          <p>This report was generated using AI-powered research tools.</p>
          <p>Information is based on publicly available sources and web content as of ${new Date().toLocaleDateString()}.</p>
        </div>
      </body>
      </html>
    `;

    // Create PDF
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 10;

    // Add title
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235);
    doc.text(report.company, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text('AI-Powered Company Research Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    doc.setFontSize(9);
    doc.text(`Generated on ${new Date(report.generatedAt).toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Add separator line
    doc.setDrawColor(37, 99, 235);
    doc.line(10, yPosition, pageWidth - 10, yPosition);
    yPosition += 10;

    // Add company information section
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235);
    doc.text('Company Information', 10, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(51, 51, 51);
    doc.text(`Company Name: ${report.company}`, 10, yPosition);
    yPosition += 7;
    doc.text(`Website: ${report.website}`, 10, yPosition);
    yPosition += 15;

    // Add analysis sections
    const addSection = (title, content) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 10;
      }

      doc.setFontSize(14);
      doc.setTextColor(37, 99, 235);
      doc.text(title, 10, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setTextColor(51, 51, 51);

      const lines = doc.splitTextToSize(content, pageWidth - 20);
      const lineHeight = 5;

      for (const line of lines) {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 10;
        }
        doc.text(line, 10, yPosition);
        yPosition += lineHeight;
      }

      yPosition += 5;
    };

    if (report.analysis?.overview) {
      addSection('Company Overview', String(report.analysis.overview));
    }

    if (report.analysis?.products) {
      addSection('Products & Services', String(report.analysis.products));
    }

    if (report.analysis?.targetMarket) {
      addSection('Target Market', String(report.analysis.targetMarket));
    }

    if (report.analysis?.businessModel) {
      addSection('Business Model', String(report.analysis.businessModel));
    }

    if (report.analysis?.painPoints) {
      addSection('AI-Generated Pain Points & Opportunities', String(report.analysis.painPoints));
    }

    if (report.analysis?.differentiators) {
      addSection('Key Differentiators', String(report.analysis.differentiators));
    }

    // Add competitors section
    if (report.competitors && report.competitors.length > 0) {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 10;
      }

      doc.setFontSize(14);
      doc.setTextColor(37, 99, 235);
      doc.text('Competitor Analysis', 10, yPosition);
      yPosition += 10;

      for (const competitor of report.competitors) {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 10;
        }

        doc.setFontSize(11);
        doc.setTextColor(30, 64, 175);
        doc.text(`• ${competitor.name}`, 10, yPosition);
        yPosition += 6;

        if (competitor.website) {
          doc.setFontSize(9);
          doc.setTextColor(100);
          doc.text(`Website: ${competitor.website}`, 15, yPosition);
          yPosition += 5;
        }

        yPosition += 3;
      }
    }

    // Send as response
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${report.company.replace(/\s+/g, '_')}_research_report.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    return res.status(500).json({
      error: 'Failed to generate PDF'
    });
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

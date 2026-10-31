import fs from 'fs';
import path from 'path';

const pdfPath = path.resolve('public/The_Crystal_Village_Presentation.pdf');
const pdfBuffer = fs.readFileSync(pdfPath);
const base64Pdf = pdfBuffer.toString('base64');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Download Presentation PDF - The Crystal Village</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <style>
    body {
      background: #090d16;
      color: #f8fafc;
      font-family: 'Outfit', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      text-align: center;
    }
    .card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 20px;
      padding: 48px 40px;
      max-width: 580px;
      width: 100%;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
      position: relative;
      overflow: hidden;
    }
    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #06b6d4, #a855f7);
    }
    .icon {
      font-size: 54px;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 26px;
      font-weight: 800;
      margin-bottom: 10px;
      color: #ffffff;
    }
    p {
      color: #94a3b8;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 28px;
    }
    .btn-download {
      display: inline-block;
      width: 100%;
      background: linear-gradient(135deg, #06b6d4, #3b82f6);
      color: #ffffff;
      text-decoration: none;
      font-weight: 700;
      font-size: 16px;
      padding: 16px 28px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(6, 182, 212, 0.35);
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-download:hover {
      box-shadow: 0 12px 28px rgba(6, 182, 212, 0.5);
      transform: translateY(-2px);
    }
    .btn-secondary {
      display: inline-block;
      margin-top: 14px;
      color: #38bdf8;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
    }
    .btn-secondary:hover {
      text-decoration: underline;
    }
    .badge {
      display: inline-block;
      background: rgba(6, 182, 212, 0.15);
      color: #06b6d4;
      border: 1px solid rgba(6, 182, 212, 0.3);
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 16px;
      letter-spacing: 0.5px;
    }
    .status {
      margin-top: 20px;
      font-size: 13px;
      color: #10b981;
      font-family: 'JetBrains Mono', monospace;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">12-Slide Masterclass Deck (16:9 Landscape)</div>
    <div class="icon">📑</div>
    <h1>The Crystal Village: Git & GitHub</h1>
    <p>Your complete educational presentation deck with visual diagrams, chapter breakdowns, and presenter notes is ready.</p>
    
    <button onclick="triggerDownload()" class="btn-download">
      ⬇️ Download PDF Now
    </button>

    <div>
      <a href="/presentation.html" class="btn-secondary">
        🖥️ Or View Interactive Slides in Browser &rarr;
      </a>
    </div>

    <div id="status-msg" class="status">Click button above to download</div>
  </div>

  <script>
    const base64Data = "${base64Pdf}";

    function triggerDownload() {
      try {
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'The_Crystal_Village_Git_Presentation.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);

        document.getElementById('status-msg').textContent = '✅ Download started!';
      } catch (e) {
        window.location.href = '/The_Crystal_Village_Presentation.pdf';
      }
    }

    // Auto-trigger download on page load
    window.addEventListener('load', () => {
      setTimeout(triggerDownload, 400);
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(path.resolve('public/download.html'), htmlContent);
console.log('Created /public/download.html successfully');

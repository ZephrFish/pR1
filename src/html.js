export function getEditPage(editToken) {
  return `<!DOCTYPE html>
<html lang="en" data-theme="solarized-dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
  <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
  <title>Edit URL - pR1</title>
  <style>
    :root[data-theme="solarized-dark"] {
      --bg-color: #002b36;
      --card-bg: #073642;
      --text-primary: #93a1a1;
      --text-secondary: #839496;
      --border-color: #268bd2;
      --input-bg: #002b36;
      --input-border: #268bd2;
      --accent: #268bd2;
      --accent-hover: #2aa198;
      --accent-text: #fdf6e3;
      --danger: #dc322f;
      --danger-hover: #cb4b16;
    }

    :root[data-theme="solarized-light"] {
      --bg-color: #fdf6e3;
      --card-bg: #fdf6e3;
      --text-primary: #073642;
      --text-secondary: #586e75;
      --border-color: #268bd2;
      --input-bg: #fdf6e3;
      --input-border: #268bd2;
      --accent: #268bd2;
      --accent-hover: #2aa198;
      --accent-text: #fdf6e3;
      --danger: #dc322f;
      --danger-hover: #cb4b16;
    }

    :root[data-theme="rgb-dark"] {
      --bg-color: #0a0a0a;
      --card-bg: #1a1a1a;
      --text-primary: #aaddbb;
      --text-secondary: #99cc99;
      --border-color: #7799dd;
      --input-bg: #0a0a0a;
      --input-border: #5588cc;
      --accent: #7799dd;
      --accent-hover: #5588cc;
      --accent-text: #000000;
      --danger: #ff4444;
      --danger-hover: #dd2222;
    }

    :root[data-theme="rgb-light"] {
      --bg-color: #f5f5f5;
      --card-bg: #ffffff;
      --text-primary: #1a1a1a;
      --text-secondary: #445544;
      --border-color: #5566aa;
      --input-bg: #f5f5f5;
      --input-border: #5566aa;
      --accent: #5566aa;
      --accent-hover: #445599;
      --accent-text: #ffffff;
      --danger: #ff4444;
      --danger-hover: #dd2222;
    }

    :root[data-theme="pink-dark"] {
      --bg-color: #1a0a1a;
      --card-bg: #2a1a2a;
      --text-primary: #ddbbcc;
      --text-secondary: #cc99bb;
      --border-color: #9999dd;
      --input-bg: #1a0a1a;
      --input-border: #bb6699;
      --accent: #cc88bb;
      --accent-hover: #bb6699;
      --accent-text: #1a0a1a;
      --danger: #ff4444;
      --danger-hover: #dd2222;
    }

    :root[data-theme="pink-light"] {
      --bg-color: #f5f0f5;
      --card-bg: #ffffff;
      --text-primary: #1a1a1a;
      --text-secondary: #664466;
      --border-color: #7766bb;
      --input-bg: #f5f0f5;
      --input-border: #7766bb;
      --accent: #996699;
      --accent-hover: #885588;
      --accent-text: #ffffff;
      --danger: #ff4444;
      --danger-hover: #dd2222;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Courier New', monospace;
      background: var(--bg-color);
      color: var(--text-primary);
      padding: 20px;
      transition: background 0.3s ease, color 0.3s ease;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .header h1 {
      color: var(--text-primary);
      margin-bottom: 15px;
    }

    .theme-selector {
      display: inline-block;
      margin: 10px 0;
    }

    .theme-selector select {
      padding: 8px 12px;
      background: var(--input-bg);
      border: 2px solid var(--border-color);
      color: var(--text-primary);
      font-family: inherit;
      border-radius: 4px;
      cursor: pointer;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 30px;
      border: 2px solid var(--border-color);
      background: var(--card-bg);
      border-radius: 8px;
    }

    h1 {
      margin-bottom: 20px;
      color: var(--text-primary);
    }

    .form-group { margin-bottom: 20px; }

    label {
      display: block;
      margin-bottom: 5px;
      color: var(--text-secondary);
      font-weight: 600;
    }

    input, select {
      width: 100%;
      padding: 10px;
      background: var(--input-bg);
      border: 1px solid var(--input-border);
      color: var(--text-primary);
      font-family: inherit;
      border-radius: 4px;
      transition: border-color 0.3s ease;
    }

    input:focus, select:focus {
      outline: none;
      border-color: var(--accent);
    }

    .btn {
      padding: 12px 24px;
      background: var(--accent);
      color: var(--accent-text);
      border: none;
      cursor: pointer;
      font-family: inherit;
      font-weight: bold;
      margin-right: 10px;
      margin-bottom: 10px;
      border-radius: 6px;
      transition: background 0.3s ease;
    }

    .btn:hover {
      background: var(--accent-hover);
    }

    .btn-danger {
      background: var(--danger);
      color: #fff;
    }

    .btn-danger:hover {
      background: var(--danger-hover);
    }

    .alert {
      padding: 15px;
      margin-bottom: 20px;
      border: 1px solid;
      border-radius: 6px;
    }

    .alert-success {
      border-color: var(--accent);
      background: var(--input-bg);
      color: var(--accent);
    }

    .alert-error {
      border-color: var(--danger);
      background: var(--input-bg);
      color: var(--danger);
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: var(--text-secondary);
    }

    @media (max-width: 600px) {
      body { padding: 10px; }
      .container { padding: 20px; }
      .btn { margin-right: 5px; margin-bottom: 10px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1># Edit URL</h1>
    <div style="display: flex; gap: 10px; align-items: center;">
      <a href="/" class="btn" style="text-decoration: none; display: inline-block;">← Back to Home</a>
      <div class="theme-selector">
        <select id="themeSelect" onchange="setTheme(this.value)">
          <option value="solarized-dark">Solarized Dark</option>
          <option value="solarized-light">Solarized Light</option>
          <option value="rgb-dark">RGB Dark</option>
          <option value="rgb-light">RGB Light</option>
          <option value="pink-dark">Pink Dark</option>
          <option value="pink-light">Pink Light</option>
        </select>
      </div>
    </div>
  </div>
  <div class="container">
    <div id="alert"></div>
    <div id="loadingDiv" class="loading">Loading...</div>
    <div id="editForm" style="display:none;">
      <div class="form-group">
        <label>Short Code:</label>
        <input type="text" id="shortCode" readonly style="opacity: 0.6;">
      </div>
      <div class="form-group">
        <label>Destination URL:</label>
        <input type="url" id="longUrl" required>
      </div>
      <div class="form-group">
        <label>Expiration:</label>
        <select id="expiresIn">
          <option value="">Keep current / Never</option>
          <option value="3600">1 hour</option>
          <option value="86400">1 day</option>
          <option value="604800">1 week</option>
          <option value="2592000">30 days</option>
          <option value="remove">Remove expiration</option>
        </select>
      </div>
      <div class="form-group">
        <label>Current expiration: <span id="currentExpiry">None</span></label>
      </div>
      <button class="btn" onclick="updateUrl()">Update URL</button>
      <button class="btn btn-danger" onclick="deleteUrl()">Delete URL</button>
      <button class="btn" onclick="showQRCode()">Show QR Code</button>
    </div>
    <div id="qrModal" style="display:none; margin-top: 30px; padding: 20px; border: 1px solid #00ff41;">
      <h2 style="color: #00ff41; margin-bottom: 15px;">QR Code</h2>
      <div id="qrContainer" style="text-align: center; margin: 20px 0;"></div>
      <div style="text-align: center; margin-bottom: 15px;">
        <span id="qrUrl" style="color: #00aaff; word-break: break-all;"></span>
      </div>
      <button class="btn" onclick="downloadQR()">Download QR Code</button>
      <button class="btn" onclick="closeQR()" style="background: #666;">Close</button>
    </div>
  </div>
  <script>
    // Register Service Worker for offline support
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('[SW] Service Worker registered:', registration.scope);
          })
          .catch(error => {
            console.log('[SW] Service Worker registration failed:', error);
          });
      });
    }

    const editToken = '${editToken}';
    let urlData = null;

    async function loadUrl() {
      try {
        const response = await fetch(\`/api/url/\${editToken}\`);
        const data = await response.json();
        if (response.ok) {
          urlData = data;
          document.getElementById('shortCode').value = data.shortCode;
          document.getElementById('longUrl').value = data.longUrl;
          if (data.expiresAt) {
            document.getElementById('currentExpiry').textContent = new Date(data.expiresAt).toLocaleString();
          }
          document.getElementById('loadingDiv').style.display = 'none';
          document.getElementById('editForm').style.display = 'block';
        } else {
          showAlert(data.error || 'Failed to load URL', 'error');
          document.getElementById('loadingDiv').style.display = 'none';
        }
      } catch (error) {
        showAlert('Error: ' + error.message, 'error');
        document.getElementById('loadingDiv').style.display = 'none';
      }
    }

    async function updateUrl() {
      const longUrl = document.getElementById('longUrl').value;
      const expiresIn = document.getElementById('expiresIn').value;

      try {
        const payload = { url: longUrl };
        if (expiresIn === 'remove') {
          payload.removeExpiration = true;
        } else if (expiresIn) {
          payload.expiresIn = expiresIn;
        }

        const response = await fetch(\`/api/url/\${editToken}\`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (response.ok) {
          showAlert('URL updated successfully!', 'success');
          setTimeout(() => loadUrl(), 1000);
        } else {
          showAlert(data.error || 'Failed to update URL', 'error');
        }
      } catch (error) {
        showAlert('Error: ' + error.message, 'error');
      }
    }

    async function deleteUrl() {
      if (!confirm('Are you sure you want to delete this URL? This cannot be undone.')) {
        return;
      }

      try {
        const response = await fetch(\`/api/url/\${editToken}\`, {
          method: 'DELETE'
        });

        const data = await response.json();
        if (response.ok) {
          showAlert('URL deleted successfully!', 'success');
          setTimeout(() => {
            document.getElementById('editForm').style.display = 'none';
          }, 2000);
        } else {
          showAlert(data.error || 'Failed to delete URL', 'error');
        }
      } catch (error) {
        showAlert('Error: ' + error.message, 'error');
      }
    }

    function showAlert(message, type) {
      const alert = document.getElementById('alert');
      alert.textContent = message;
      alert.className = 'alert alert-' + type;
      alert.style.display = 'block';
      setTimeout(() => alert.style.display = 'none', 5000);
    }

    function showQRCode() {
      if (!urlData || !urlData.shortCode) return;

      const shortUrl = \`https://\${window.location.host}/\${urlData.shortCode}\`;
      const container = document.getElementById('qrContainer');

      // Set URL text first
      document.getElementById('qrUrl').textContent = shortUrl;

      // Lazy load QR code library on first use
      if (!window.QRCode) {
        // Show modal immediately with loading message
        container.textContent = 'Loading QR Code...';
        container.style.cssText = 'text-align: center; color: var(--text-secondary); padding: 20px;';
        document.getElementById('qrModal').style.display = 'block';

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
        script.crossOrigin = 'anonymous';
        script.referrerPolicy = 'no-referrer';
        script.onload = () => generateQR(shortUrl, container);
        script.onerror = () => {
          container.textContent = 'Failed to load QR code library';
          container.style.cssText = 'color: var(--danger); padding: 20px;';
        };
        document.head.appendChild(script);
      } else {
        // Library already loaded, generate QR code
        generateQR(shortUrl, container);
        document.getElementById('qrModal').style.display = 'block';
      }
    }

    function generateQR(shortUrl, container) {
      // Clear any existing QR code instance and container
      if (qrCodeInstance) {
        qrCodeInstance.clear();
        qrCodeInstance = null;
      }
      container.textContent = ''; // Safe clearing

      try {
        // Create QR code via JS library
        qrCodeInstance = new QRCode(container, {
          text: shortUrl,
          width: 300,
          height: 300,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      } catch (error) {
        console.error('QR Code generation error:', error);
        container.textContent = 'Error generating QR code';
        container.style.cssText = 'color: var(--danger); padding: 20px;';
      }
    }

    function closeQR() {
      document.getElementById('qrModal').style.display = 'none';
    }

    let qrCodeInstance = null;

    function downloadQR() {
      const container = document.getElementById('qrContainer');
      const canvas = container.querySelector('canvas');
      const img = container.querySelector('img');

      if (!urlData || !urlData.shortCode) {
        showAlert('QR Code not loaded', 'error');
        return;
      }

      // Prefer canvas if it exists
      if (canvas) {
        canvas.toBlob(function(blob) {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = \`qrcode-\${urlData.shortCode}.png\`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
          showAlert('QR Code downloaded', 'success');
        });
        return;
      }

      // Fallback: if library rendered an <img>, draw it to canvas then save
      if (img) {
        const tmpCanvas = document.createElement('canvas');
        const size = 300;
        tmpCanvas.width = size;
        tmpCanvas.height = size;
        const ctx = tmpCanvas.getContext('2d');

        const tmpImg = new Image();
        tmpImg.crossOrigin = 'anonymous';
        tmpImg.onload = function() {
          ctx.drawImage(tmpImg, 0, 0, size, size);
          tmpCanvas.toBlob(function(blob) {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`qrcode-\${urlData.shortCode}.png\`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            showAlert('QR Code downloaded', 'success');
          });
        };
        tmpImg.src = img.src;
      }
    }

    // Theme management
    function initTheme() {
      const savedTheme = localStorage.getItem('theme') || 'solarized-dark';
      document.documentElement.setAttribute('data-theme', savedTheme);
      document.getElementById('themeSelect').value = savedTheme;
    }

    function setTheme(themeName) {
      document.documentElement.setAttribute('data-theme', themeName);
      localStorage.setItem('theme', themeName);
    }

    // Initialize
    initTheme();
    loadUrl();
  </script>
</body>
</html>`;
}

export function getHomePage() {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
  <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
  <title>pR1 - URL Shortener</title>
  <!-- Version: 3.0-multi-theme -->
  <style>
    :root[data-theme="solarized-dark"] {
      --bg-gradient-start: #002b36;
      --bg-gradient-end: #073642;
      --card-bg: #073642;
      --text-primary: #93a1a1;
      --text-secondary: #839496;
      --text-meta: #657b83;
      --text-header: #eee8d5;
      --border-color: #268bd2;
      --input-bg: #002b36;
      --input-border: #268bd2;
      --url-item-bg: #073642;
      --result-box-bg: #073642;
      --shadow: rgba(38, 139, 210, 0.2);
      --accent: #268bd2;
      --accent-hover: #2aa198;
      --accent-text: #fdf6e3;
    }

    :root[data-theme="solarized-light"] {
      --bg-gradient-start: #fdf6e3;
      --bg-gradient-end: #eee8d5;
      --card-bg: #fdf6e3;
      --text-primary: #073642;
      --text-secondary: #586e75;
      --text-meta: #657b83;
      --text-header: #002b36;
      --border-color: #268bd2;
      --input-bg: #fdf6e3;
      --input-border: #268bd2;
      --url-item-bg: #eee8d5;
      --result-box-bg: #eee8d5;
      --shadow: rgba(0, 43, 54, 0.1);
      --accent: #268bd2;
      --accent-hover: #2aa198;
      --accent-text: #fdf6e3;
    }

    :root[data-theme="rgb-dark"] {
      --bg-gradient-start: #0a0a0a;
      --bg-gradient-end: #1a1a1a;
      --card-bg: #1a1a1a;
      --text-primary: #aaddbb;
      --text-secondary: #99cc99;
      --text-meta: #88bb88;
      --text-header: #ccffdd;
      --border-color: #7799dd;
      --input-bg: #0a0a0a;
      --input-border: #5588cc;
      --url-item-bg: #1a1a1a;
      --result-box-bg: #1a1a1a;
      --shadow: rgba(119, 153, 221, 0.2);
      --accent: #7799dd;
      --accent-hover: #5588cc;
      --accent-text: #000000;
    }

    :root[data-theme="rgb-light"] {
      --bg-gradient-start: #f5f5f5;
      --bg-gradient-end: #e8e8e8;
      --card-bg: #ffffff;
      --text-primary: #1a1a1a;
      --text-secondary: #445544;
      --text-meta: #557755;
      --text-header: #0a0a0a;
      --border-color: #5566aa;
      --input-bg: #f5f5f5;
      --input-border: #5566aa;
      --url-item-bg: #fafafa;
      --result-box-bg: #fafafa;
      --shadow: rgba(68, 85, 153, 0.15);
      --accent: #5566aa;
      --accent-hover: #445599;
      --accent-text: #ffffff;
    }

    :root[data-theme="pink-dark"] {
      --bg-gradient-start: #1a0a1a;
      --bg-gradient-end: #2a1a2a;
      --card-bg: #2a1a2a;
      --text-primary: #ddbbcc;
      --text-secondary: #cc99bb;
      --text-meta: #bb88aa;
      --text-header: #ffddee;
      --border-color: #9999dd;
      --input-bg: #1a0a1a;
      --input-border: #bb6699;
      --url-item-bg: #2a1a2a;
      --result-box-bg: #2a1a2a;
      --shadow: rgba(187, 102, 153, 0.2);
      --accent: #cc88bb;
      --accent-hover: #bb6699;
      --accent-text: #1a0a1a;
    }

    :root[data-theme="pink-light"] {
      --bg-gradient-start: #f5f0f5;
      --bg-gradient-end: #ebe5eb;
      --card-bg: #ffffff;
      --text-primary: #1a1a1a;
      --text-secondary: #664466;
      --text-meta: #775577;
      --text-header: #0a0a0a;
      --border-color: #7766bb;
      --input-bg: #f5f0f5;
      --input-border: #7766bb;
      --url-item-bg: #faf5fa;
      --result-box-bg: #faf5fa;
      --shadow: rgba(119, 102, 187, 0.15);
      --accent: #996699;
      --accent-hover: #885588;
      --accent-text: #ffffff;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Courier New', 'Consolas', 'Monaco', monospace;
      background: var(--bg-gradient-start);
      min-height: 100vh;
      padding: 20px;
      transition: background 0.3s ease;
      position: relative;
      overflow-x: hidden;
    }

    /* Scanline effect */
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background:
        repeating-linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.15) 0px,
          rgba(0, 0, 0, 0.15) 1px,
          transparent 1px,
          transparent 2px
        );
      pointer-events: none;
      z-index: 9999;
      animation: scanline 8s linear infinite;
    }

    /* CRT flicker */
    body::after {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 255, 65, 0.02);
      pointer-events: none;
      z-index: 9998;
      animation: flicker 0.15s infinite;
    }

    @keyframes scanline {
      0% { transform: translateY(0); }
      100% { transform: translateY(10px); }
    }

    @keyframes flicker {
      0% { opacity: 0.98; }
      50% { opacity: 1; }
      100% { opacity: 0.98; }
    }

    @keyframes glow {
      0%, 100% { text-shadow: 0 0 10px var(--accent), 0 0 20px var(--accent), 0 0 30px var(--accent); }
      50% { text-shadow: 0 0 20px var(--accent), 0 0 30px var(--accent), 0 0 40px var(--accent); }
    }

    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 5px var(--accent), 0 0 10px var(--accent); }
      50% { box-shadow: 0 0 10px var(--accent), 0 0 20px var(--accent), 0 0 30px var(--accent); }
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      color: var(--text-header);
      margin-bottom: 40px;
      position: relative;
    }

    .header h1 {
      font-size: 3.5em;
      margin-bottom: 10px;
      font-weight: 900;
      letter-spacing: 4px;
      animation: glow 2s ease-in-out infinite;
    }

    .header p {
      font-size: 1.2em;
      opacity: 0.9;
    }

    .header-controls {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .header-theme-selector {
      display: inline-block;
    }

    .header-theme-selector select {
      background: var(--input-bg);
      color: var(--text-primary);
      border: 2px solid var(--border-color);
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-family: 'Courier New', monospace;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .header-theme-selector select:hover {
      border-color: var(--accent);
    }

    .header-theme-selector select:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 8px var(--shadow);
    }

    .stats-banner {
      text-align: center;
      margin-top: 15px;
      padding: 15px;
      background: var(--url-item-bg);
      border-radius: 6px;
      border: 1px solid var(--border-color);
      font-size: 14px;
      color: var(--text-secondary);
    }

    .theme-toggle, .auth-btn {
      background: var(--card-bg);
      border: 2px solid var(--border-color);
      color: var(--text-primary);
      padding: 10px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s;
      backdrop-filter: blur(10px);
      font-family: 'Courier New', monospace;
    }

    .theme-toggle:hover, .auth-btn:hover {
      background: var(--accent);
      color: var(--bg-gradient-start);
      border-color: var(--accent);
      transform: translateY(-2px);
    }

    .theme-toggle option {
      background: var(--card-bg);
      color: var(--text-primary);
    }


    .card {
      background: var(--card-bg);
      border-radius: 8px;
      padding: 30px;
      margin-bottom: 20px;
      transition: all 0.3s ease;
      position: relative;
    }

    .card::before {
      content: '>';
      position: absolute;
      top: 15px;
      left: 15px;
      color: var(--accent);
      font-size: 20px;
      font-weight: bold;
      animation: blink 1s infinite;
    }

    @keyframes blink {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
.form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: var(--text-primary);
    }

    input[type="text"],
    input[type="password"],
    input[type="url"],
    select {
      width: 100%;
      padding: 12px 12px 12px 20px;
      border: 2px solid var(--input-border);
      border-radius: 6px;
      font-size: 16px;
      font-family: 'Courier New', monospace;
      transition: all 0.3s;
      background: var(--input-bg);
      color: var(--text-primary);
    }
input:focus,
    select:focus {
      outline: none;
      border-color: var(--accent);
      animation: pulse 2s infinite;
    }

    .input-hint {
      font-size: 13px;
      color: var(--text-secondary);
      margin-top: 5px;
    }

    .input-error {
      font-size: 13px;
      color: #ff0000;
      margin-top: 5px;
      display: none;
    }

    .input-error.visible {
      display: block;
    }

    input.invalid, select.invalid {
      border-color: #ff0000;
    }

    input.valid {
      border-color: #00ff41;
    }

    .btn {
      background: var(--accent);
      color: #000000;
      border: 2px solid var(--accent);
      padding: 14px 28px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      width: 100%;
      transition: all 0.2s;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 255, 65, 0.4);
      background: var(--accent-hover);
    }

    .btn:active {
      transform: translateY(0);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn.loading {
      position: relative;
      color: transparent;
    }

    .btn.loading::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin-left: -8px;
      margin-top: -8px;
      border: 2px solid transparent;
      border-top-color: var(--accent-text);
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .btn-small {
      padding: 8px 16px;
      width: auto;
      font-size: 14px;
    }

    .btn-danger {
      background: #ff0000;
      border-color: #ff0000;
      color: #000000;
    }

    .btn-danger:hover {
      background: #cc0000;
      border-color: #cc0000;
      box-shadow: 0 6px 20px rgba(255, 0, 0, 0.4);
    }

    .alert {
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 20px;
      display: none;
    }

    .alert-success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .alert-error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .result-box {
      background: var(--result-box-bg);
      border: 2px solid var(--accent);
      border-radius: 6px;
      padding: 20px;
      margin-top: 20px;
      display: none;
      position: relative;
      animation: slideIn 0.3s ease;
    }
@keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .short-url {
      font-size: 20px;
      font-weight: 700;
      color: var(--accent);
      word-break: break-all;
      margin-bottom: 10px;
      font-family: 'Courier New', monospace;
    }

    .copy-btn {
      background: var(--accent);
      color: #000000;
      border: 2px solid var(--accent);
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .copy-btn:hover {
      background: var(--accent-hover);
      box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
    }

    .url-list {
      margin-top: 20px;
    }

    .url-item {
      background: var(--url-item-bg);
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s;
      border: 1px solid transparent;
    }
.url-item:hover {
      transform: translateX(5px);
    }
.url-info {
      flex: 1;
    }

    .url-short {
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 4px;
      font-family: 'Courier New', monospace;
    }

    .url-long {
      font-size: 14px;
      color: var(--text-secondary);
      word-break: break-all;
    }

    .url-meta {
      font-size: 12px;
      color: var(--text-meta);
      margin-top: 4px;
    }

    .url-actions {
      display: flex;
      gap: 8px;
      margin-left: 16px;
    }

    .loading {
      text-align: center;
      padding: 20px;
      color: var(--text-secondary);
    }

    .toggle-section {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid var(--border-color);
    }

    .toggle-btn {
      background: transparent;
      color: var(--accent);
      border: 2px solid var(--accent);
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 700;
      width: 100%;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .toggle-btn:hover {
      background: var(--accent);
      color: #000000;
      box-shadow: 0 0 15px rgba(0, 255, 65, 0.4);
    }

    /* Login Modal */
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(5px);
      z-index: 1000;
      justify-content: center;
      align-items: center;
    }

    .modal.active {
      display: flex;
    }

    .modal-content {
      background: var(--card-bg);
      padding: 40px;
      border-radius: 8px;
      max-width: 400px;
      width: 90%;
      animation: modalSlideIn 0.3s ease;
      position: relative;
    }

@keyframes modalSlideIn {
      from {
        transform: translateY(-50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal h2 {
      color: var(--text-primary);
      margin-bottom: 20px;
      text-align: center;
    }

    .analytics-content {
      max-height: 600px;
      overflow-y: auto;
    }

    .analytics-section {
      margin-bottom: 30px;
      padding: 20px;
      background: var(--url-item-bg);
      border-radius: 6px;
      border: 1px solid var(--border-color);
    }

    .analytics-section h3 {
      margin-top: 0;
      margin-bottom: 15px;
      color: var(--text-header);
      font-size: 18px;
    }

    .analytics-stat {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid var(--border-color);
    }

    .analytics-stat:last-child {
      border-bottom: none;
    }

    .analytics-stat-label {
      color: var(--text-secondary);
      word-break: break-all;
    }

    .analytics-stat-value {
      color: var(--text-primary);
      font-weight: bold;
      margin-left: 10px;
      flex-shrink: 0;
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }

    .analytics-card {
      padding: 15px;
      background: var(--url-item-bg);
      border-radius: 6px;
      border: 1px solid var(--border-color);
      text-align: center;
    }

    .analytics-card-value {
      font-size: 32px;
      font-weight: bold;
      color: var(--accent);
      margin-bottom: 5px;
    }

    .analytics-card-label {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .analytics-bar {
      width: 100%;
      height: 24px;
      background: var(--input-bg);
      border-radius: 4px;
      overflow: hidden;
      margin-top: 4px;
      position: relative;
    }

    .analytics-bar-fill {
      height: 100%;
      background: var(--accent);
      transition: width 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 8px;
      color: var(--accent-text);
      font-weight: bold;
      font-size: 12px;
    }

    .analytics-tab {
      padding: 10px 20px;
      background: transparent;
      border: none;
      border-bottom: 3px solid transparent;
      color: var(--text-secondary);
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .analytics-tab:hover {
      color: var(--accent);
      background: var(--url-item-bg);
    }

    .analytics-tab.active {
      color: var(--accent);
      border-bottom-color: var(--accent);
    }

    .analytics-tab-content {
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .analytics-stat-with-bar {
      margin-bottom: 12px;
    }

    /* Loading States */
    .loading {
      text-align: center;
      padding: 30px;
      color: var(--text-secondary);
      font-size: 16px;
    }

    .spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 3px solid var(--border-color);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-right: 10px;
      vertical-align: middle;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Button Loading State */
    .btn.loading {
      position: relative;
      color: transparent;
      pointer-events: none;
    }

    .btn.loading::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin-left: -8px;
      margin-top: -8px;
      border: 2px solid transparent;
      border-top-color: var(--accent-text);
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    /* Error Messages */
    .error-message {
      background: rgba(255, 68, 68, 0.1);
      border: 2px solid #ff4444;
      border-radius: 6px;
      padding: 15px;
      margin: 15px 0;
      color: #ff4444;
      font-weight: 500;
    }

    .success-message {
      background: rgba(0, 255, 65, 0.1);
      border: 2px solid var(--accent);
      border-radius: 6px;
      padding: 15px;
      margin: 15px 0;
      color: var(--accent);
      font-weight: 500;
    }

    .info-message {
      background: rgba(119, 153, 221, 0.1);
      border: 2px solid #7799dd;
      border-radius: 6px;
      padding: 15px;
      margin: 15px 0;
      color: #7799dd;
      font-weight: 500;
    }

    /* Navigation */
    .nav-btn {
      padding: 10px 24px;
      background: transparent;
      border: 2px solid var(--border-color);
      border-radius: 6px;
      color: var(--text-secondary);
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .nav-btn:hover {
      background: var(--url-item-bg);
      color: var(--accent);
      border-color: var(--accent);
    }

    .nav-btn.active {
      background: var(--accent);
      color: var(--accent-text);
      border-color: var(--accent);
    }

    .page-view {
      animation: fadeIn 0.3s ease;
    }

    /* URL Preview */
    .url-preview {
      background: var(--url-item-bg);
      border: 2px solid var(--accent);
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
        max-height: 0;
      }
      to {
        opacity: 1;
        transform: translateY(0);
        max-height: 300px;
      }
    }

    .preview-header {
      font-size: 14px;
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .preview-item {
      margin-bottom: 12px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .preview-item:last-child {
      margin-bottom: 0;
    }

    .preview-label {
      font-size: 12px;
      color: var(--text-secondary);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .preview-value {
      font-size: 14px;
      color: var(--text-primary);
      word-break: break-all;
      font-family: 'Courier New', monospace;
    }

    .preview-highlight {
      color: var(--accent);
      font-weight: 700;
      font-size: 16px;
    }

    .analytics-stat-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      font-size: 14px;
      color: var(--text-primary);
    }

    .analytics-stat-header span:first-child {
      color: var(--text-secondary);
    }

    .analytics-stat-header span:last-child {
      color: var(--accent);
      font-weight: bold;
    }

    .analytics-tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      border-bottom: 2px solid var(--border-color);
    }

    .analytics-tab {
      padding: 10px 20px;
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      border-bottom: 3px solid transparent;
      transition: all 0.2s;
    }

    .analytics-tab.active {
      color: var(--accent);
      border-bottom-color: var(--accent);
    }

    .analytics-tab:hover {
      color: var(--text-primary);
    }

    .analytics-panel {
      display: none;
    }

    .analytics-panel.active {
      display: block;
    }

    .qr-modal-content {
      text-align: center;
      padding: 30px;
      max-width: 500px !important;
    }

    .qr-code-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px auto;
      min-height: 300px;
    }

    .qr-code-container svg,
    .qr-code-container canvas,
    .qr-code-container img {
      display: block;
      max-width: 100%;
      height: auto;
    }

    .qr-url {
      margin-top: 15px;
      padding: 10px;
      background: var(--input-bg);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      color: var(--text-primary);
      word-break: break-all;
      font-size: 14px;
    }

    .qr-actions {
      margin-top: 20px;
      display: flex;
      gap: 10px;
      justify-content: center;
    }

    .toast {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: var(--accent);
      color: var(--accent-text);
      padding: 16px 24px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      animation: slideInUp 0.3s ease, slideOutDown 0.3s ease 2.7s;
      pointer-events: none;
    }

    @keyframes slideInUp {
      from {
        transform: translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes slideOutDown {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(100px);
        opacity: 0;
      }
    }

    .hidden {
      display: none !important;
    }

    h2, h3 {
      color: var(--text-primary);
      font-weight: 700;
      letter-spacing: 2px;
    }

    h2::before,
    h3::before {
      content: '# ';
      color: var(--accent);
      margin-right: 8px;
    }

    /* Tablet Responsiveness */
    @media (max-width: 768px) {
      .analytics-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 12px;
      }

      .nav-btn {
        padding: 8px 16px;
        font-size: 13px;
      }

      .analytics-tab {
        padding: 8px 16px;
        font-size: 13px;
      }

      .card {
        padding: 20px;
      }

      .url-preview {
        padding: 15px;
      }

      .preview-value {
        font-size: 13px;
      }

      .preview-highlight {
        font-size: 14px;
      }
    }

    /* Mobile Responsiveness */
    @media (max-width: 600px) {
      body {
        padding: 10px;
      }

      .container {
        max-width: 100%;
      }

      .header h1 {
        font-size: 2em;
        letter-spacing: 2px;
      }

      .header-controls {
        position: static;
        justify-content: center;
        margin-top: 20px;
        flex-wrap: wrap;
      }

      .header-theme-selector {
        order: 2;
        width: 100%;
        margin-top: 10px;
      }

      .header-theme-selector select {
        width: 100%;
      }

      .stats-banner {
        margin-top: 20px;
        padding: 12px;
        font-size: 13px;
        flex-direction: column;
        gap: 8px;
        text-align: center;
      }

      .stats-banner .stat-item {
        flex-direction: column;
        gap: 4px;
      }

      /* Navigation */
      .nav-btn {
        padding: 8px 12px;
        font-size: 12px;
        flex: 1;
      }

      .btn-small {
        padding: 6px 10px;
        font-size: 12px;
      }

      /* Cards */
      .card {
        padding: 15px;
        margin-bottom: 15px;
      }

      /* Forms */
      .form-group {
        margin-bottom: 18px;
      }

      input, select, textarea {
        font-size: 16px; /* Prevent zoom on iOS */
      }

      /* URL Preview */
      .url-preview {
        padding: 12px;
        margin: 15px 0;
      }

      .preview-header {
        font-size: 12px;
        margin-bottom: 10px;
      }

      .preview-item {
        margin-bottom: 10px;
      }

      .preview-label {
        font-size: 11px;
      }

      .preview-value {
        font-size: 12px;
      }

      .preview-highlight {
        font-size: 13px;
      }

      /* Analytics */
      .analytics-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }

      .analytics-card {
        padding: 12px;
      }

      .analytics-card-value {
        font-size: 24px;
      }

      .analytics-card-label {
        font-size: 12px;
      }

      .analytics-tab {
        padding: 8px 12px;
        font-size: 12px;
      }

      /* URL List */
      .url-item {
        flex-direction: column;
        align-items: flex-start;
        padding: 12px;
      }

      .url-info {
        margin-bottom: 10px;
      }

      .url-long {
        font-size: 12px;
        max-width: 100%;
      }

      .url-meta {
        font-size: 11px;
        flex-direction: column;
        gap: 4px;
        align-items: flex-start;
      }

      .url-actions {
        margin-left: 0;
        margin-top: 10px;
        width: 100%;
        flex-wrap: wrap;
        gap: 8px;
      }

      .url-actions .btn-small {
        flex: 1;
        min-width: calc(50% - 4px);
      }

      /* Result Box */
      .result-box {
        padding: 15px;
      }

      /* Modals */
      .modal-content {
        margin: 10px;
        padding: 20px;
        max-width: calc(100% - 20px);
      }

      /* Hide unnecessary elements on mobile */
      h2::before,
      h3::before {
        margin-right: 4px;
      }
    }

    /* Extra Small Mobile */
    @media (max-width: 400px) {
      .header h1 {
        font-size: 1.5em;
      }

      .analytics-grid {
        grid-template-columns: 1fr;
      }

      .nav-btn {
        font-size: 11px;
        padding: 6px 10px;
      }

      .card {
        padding: 12px;
      }

      .btn {
        padding: 10px 16px;
        font-size: 14px;
      }
    }
  </style>
</head>
<body>
  <!-- Login Modal -->
  <div id="loginModal" class="modal" role="dialog" aria-labelledby="loginModalTitle" aria-modal="true">
    <div class="modal-content">
      <h2 id="loginModalTitle">Admin Login</h2>
      <div id="loginAlert" class="alert" role="alert" aria-live="polite"></div>
      <form id="loginForm">
        <div class="form-group">
          <label for="loginPassword">Admin Password</label>
          <input type="password" id="loginPassword" placeholder="Enter admin password" required autofocus aria-required="true">
        </div>
        <button type="submit" class="btn" aria-label="Submit login">Login</button>
      </form>
    </div>
  </div>

  <!-- Edit URL Modal -->
  <div id="editModal" class="modal" role="dialog" aria-labelledby="editModalTitle" aria-modal="true">
    <div class="modal-content">
      <h2 id="editModalTitle">Edit URL</h2>
      <div id="editAlert" class="alert" role="alert" aria-live="polite"></div>
      <form id="editForm">
        <div class="form-group">
          <label for="editShortCode">Short Code</label>
          <input type="text" id="editShortCode" readonly style="opacity: 0.6;" aria-readonly="true">
        </div>
        <div class="form-group">
          <label for="editLongUrl">Long URL</label>
          <input type="url" id="editLongUrl" placeholder="https://example.com/new/url" required aria-required="true">
        </div>
        <div class="form-group">
          <label for="editExpiresIn">Update Expiration</label>
          <select id="editExpiresIn" aria-label="Update expiration time">
            <option value="">Keep current / Never expires</option>
            <option value="3600">Expire in 1 hour</option>
            <option value="86400">Expire in 1 day</option>
            <option value="604800">Expire in 1 week</option>
            <option value="2592000">Expire in 30 days</option>
            <option value="7776000">Expire in 90 days</option>
            <option value="31536000">Expire in 1 year</option>
            <option value="remove">Remove expiration</option>
          </select>
          <div class="input-hint" id="currentExpirationHint"></div>
        </div>
        <div style="display: flex; gap: 10px;">
          <button type="submit" class="btn" style="flex: 1;">Update</button>
          <button type="button" class="btn btn-danger" style="flex: 1;" onclick="closeEditModal()">Cancel</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Analytics Modal -->
  <div id="analyticsModal" class="modal" role="dialog" aria-labelledby="analyticsModalTitle" aria-modal="true">
    <div class="modal-content" style="max-width: 900px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 id="analyticsModalTitle">Analytics Dashboard</h2>
        <button class="btn btn-small btn-danger" onclick="closeAnalyticsModal()" aria-label="Close analytics dashboard">Close</button>
      </div>
      <div id="analyticsContent" class="analytics-content" role="region" aria-live="polite">
        <div class="loading">Loading analytics...</div>
      </div>
    </div>
  </div>

  <!-- QR Code Modal -->
  <div id="qrModal" class="modal" role="dialog" aria-labelledby="qrModalTitle" aria-modal="true">
    <div class="modal-content qr-modal-content">
      <h2 id="qrModalTitle">QR Code</h2>
      <div class="qr-code-container" id="qrCodeContainer" role="img" aria-label="QR code for shortened URL"></div>
      <div class="qr-url" id="qrUrl"></div>
      <div class="qr-actions">
        <button class="btn" onclick="downloadQR()" aria-label="Download QR code as PNG">Download PNG</button>
        <button class="btn btn-danger" onclick="closeQRModal()" aria-label="Close QR code modal">Close</button>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="header">
      <div class="header-controls">
        <div class="header-theme-selector">
          <select id="themeSelector" onchange="setTheme(this.value)" aria-label="Select color theme">
            <option value="solarized-dark">Solarized Dark</option>
            <option value="solarized-light">Solarized Light</option>
            <option value="rgb-dark">RGB Dark</option>
            <option value="rgb-light">RGB Light</option>
            <option value="pink-dark">Pink Dark</option>
            <option value="pink-light">Pink Light</option>
          </select>
        </div>
        <button class="auth-btn" id="authBtn" onclick="handleAuth()" aria-label="Login or logout">Login</button>
      </div>
      <h1>pR1</h1>
      <p style="letter-spacing: 2px;">[ Lightning-Fast URL Shortener ]</p>
      <div class="stats-banner" id="globalStats">
        <span id="visitorCount">Loading stats...</span>
      </div>
    </div>

    <div class="card">
      <h2 style="margin-bottom: 20px;">Create Short URL</h2>

      <div id="alert" class="alert" role="alert" aria-live="polite"></div>

      <form id="createForm">
        <div class="form-group">
          <label for="longUrl">Long URL *</label>
          <input type="url" id="longUrl" placeholder="https://example.com/very/long/url" required aria-required="true" aria-describedby="longUrlHint">
          <div id="longUrlHint" class="input-hint visually-hidden">Enter the full URL you want to shorten</div>
        </div>

        <div class="form-group">
          <label for="shortCode">Custom Short Code (optional)</label>
          <input type="text" id="shortCode" placeholder="my-link" aria-describedby="shortCodeHint shortCodeError" pattern="[a-zA-Z0-9_\\-]{3,50}">
          <div id="shortCodeHint" class="input-hint">Leave empty to auto-generate. Only letters, numbers, hyphens, and underscores. 3-50 characters.</div>
          <div id="shortCodeError" class="input-error"></div>
        </div>

        <div class="form-group">
          <label for="expiresIn">Expiration (optional)</label>
          <select id="expiresIn" aria-label="Select expiration time">
            <option value="">Never expires</option>
            <option value="3600">1 hour</option>
            <option value="86400">1 day</option>
            <option value="604800">1 week</option>
            <option value="2592000">30 days</option>
            <option value="7776000">90 days</option>
            <option value="31536000">1 year</option>
          </select>
          <div class="input-hint">Choose when this short URL should expire.</div>
        </div>

        <!-- URL Preview -->
        <div id="urlPreview" class="url-preview hidden">
          <div class="preview-header">Preview</div>
          <div class="preview-item">
            <span class="preview-label">Original URL:</span>
            <span id="previewLongUrl" class="preview-value"></span>
          </div>
          <div class="preview-item">
            <span class="preview-label">Short URL:</span>
            <span id="previewShortUrl" class="preview-value preview-highlight"></span>
          </div>
          <div class="preview-item" id="previewExpirationContainer" style="display: none;">
            <span class="preview-label">Expires:</span>
            <span id="previewExpiration" class="preview-value"></span>
          </div>
        </div>

        <button type="submit" class="btn">Create Short URL</button>
      </form>

      <div id="resultBox" class="result-box">
        <div class="short-url" id="shortUrlDisplay"></div>
        <div style="display: flex; gap: 10px; margin-top: 10px;">
          <button class="copy-btn" onclick="copyToClipboard()">Copy to Clipboard</button>
          <button class="btn btn-small" onclick="showCurrentQR()" style="flex: 1;">Show QR Code</button>
        </div>
      </div>
    </div>

    <div id="loginPrompt" class="card">
      <h2 style="margin-bottom: 20px;">Manage URLs</h2>
      <p style="color: var(--text-secondary); margin-bottom: 20px;">
        Login to view, edit, and delete your short URLs.
      </p>
      <button class="btn" onclick="showLogin()">Login to Manage</button>
    </div>

    <div id="appContent" class="hidden">
      <!-- Navigation -->
      <div class="card" style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
          <div style="display: flex; gap: 10px;">
            <button class="nav-btn active" data-page="dashboard" onclick="switchPage('dashboard')">Dashboard</button>
            <button class="nav-btn" data-page="analytics" onclick="switchPage('analytics')">Analytics</button>
          </div>
          <button class="btn btn-small" onclick="logout()" style="background: #ff4444; border-color: #ff4444;">Logout</button>
        </div>
      </div>

      <!-- Dashboard View -->
      <div id="dashboardView" class="page-view">
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2>Manage URLs</h2>
            <div style="display: flex; gap: 10px;">
              <select id="sortBy" class="btn btn-small" style="padding: 8px 12px;" onchange="applyFilters()">
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="visits-desc">Most Visits</option>
                <option value="visits-asc">Least Visits</option>
              </select>
              <button class="btn btn-small" onclick="loadUrls()">Refresh</button>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 20px;">
            <input type="text" id="searchUrls" placeholder="Search URLs..." oninput="applyFilters()" style="margin-bottom: 0;">
          </div>

          <div id="urlList" class="url-list"></div>
        </div>
      </div>

      <!-- Analytics View -->
      <div id="analyticsView" class="page-view hidden">
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2>Analytics Dashboard</h2>
            <button class="btn btn-small" onclick="loadGlobalAnalytics()">Refresh</button>
          </div>
          <div id="globalAnalytics" class="loading"><span class="spinner"></span>Loading analytics...</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    // Register Service Worker for offline support
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('[SW] Service Worker registered:', registration.scope);
          })
          .catch(error => {
            console.log('[SW] Service Worker registration failed:', error);
          });
      });
    }

    // DOM Helper utilities
    const $ = (id) => document.getElementById(id);
    const $$ = (selector) => document.querySelector(selector);

    // Format date as YYYY-MM-DD HH:MM:SS UTC
    function formatUTCDate(dateString) {
      const date = new Date(dateString);
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      const seconds = String(date.getUTCSeconds()).padStart(2, '0');
      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + ' UTC';
    }

    let currentShortUrl = '';
    let currentCreatedShortCode = '';
    const DOMAIN = window.location.host;
    let adminPassword = '';
    let isLoggedIn = false;
    let allUrls = []; // Store all URLs for filtering/sorting

    // Initialize theme
    function initTheme() {
      const savedTheme = localStorage.getItem('theme') || 'solarized-dark';
      document.documentElement.setAttribute('data-theme', savedTheme);
      updateThemeSelector(savedTheme);
    }

    // Set theme
    function setTheme(themeName) {
      document.documentElement.setAttribute('data-theme', themeName);
      localStorage.setItem('theme', themeName);
      updateThemeSelector(themeName);
    }

    // Update theme selector dropdown
    function updateThemeSelector(themeName) {
      const selector = document.getElementById('themeSelector');
      if (selector) {
        selector.value = themeName;
      }
    }

    // Check for saved session
    function checkSession() {
      const savedPassword = sessionStorage.getItem('adminPassword');
      if (savedPassword) {
        adminPassword = savedPassword;
        isLoggedIn = true;
        showApp();
      }
    }

    // Show login modal
    function showLogin() {
      openModal('loginModal');
    }

    // Hide login modal
    function hideLogin() {
      closeModal('loginModal');
    }

    // Handle login
    function setupLoginForm() {
      const loginForm = $('loginForm');
      if (!loginForm) return;

      loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = $('loginPassword').value;

      const submitBtn = e.target.querySelector('button[type="submit"]');
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Verify password by trying to fetch URLs using secure Authorization header
      try {
        const response = await fetch('/api/urls', {
          headers: {
            'Authorization': 'Bearer ' + password
          }
        });

        if (response.ok) {
          adminPassword = password;
          isLoggedIn = true;
          sessionStorage.setItem('adminPassword', password);
          hideLogin();
          showApp();
          showAlert('Login successful!', 'success');
          loadGlobalAnalytics();
          loadUrls();
        } else {
          showLoginAlert('Invalid password', 'error');
        }
      } catch (error) {
        showLoginAlert('Error: ' + error.message, 'error');
      } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
      });
    }

    // Handle auth button
    function handleAuth() {
      if (isLoggedIn) {
        logout();
      } else {
        showLogin();
      }
    }

    // Logout
    function logout() {
      isLoggedIn = false;
      adminPassword = '';
      sessionStorage.removeItem('adminPassword');
      hideApp();
      showAlert('Logged out successfully', 'success');
      document.getElementById('loginPassword').value = '';
    }

    // Show app content
    function showApp() {
      document.getElementById('loginPrompt').classList.add('hidden');
      document.getElementById('appContent').classList.remove('hidden');
      document.getElementById('authBtn').textContent = 'Logout';
    }

    // Hide app content
    function hideApp() {
      document.getElementById('loginPrompt').classList.remove('hidden');
      document.getElementById('appContent').classList.add('hidden');
      document.getElementById('authBtn').textContent = 'Login';
    }

    // Switch between pages
    function switchPage(pageName) {
      // Update nav buttons
      document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.getAttribute('data-page') === pageName) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Show/hide page views
      document.querySelectorAll('.page-view').forEach(view => {
        view.classList.add('hidden');
      });

      const targetView = document.getElementById(pageName + 'View');
      if (targetView) {
        targetView.classList.remove('hidden');
      }

      // Load data if needed
      if (pageName === 'analytics' && isLoggedIn) {
        loadGlobalAnalytics();
      }
    }

    // Real-time URL validation
    function setupUrlValidation() {
      const longUrlInput = $('longUrl');
      if (!longUrlInput) return;

      longUrlInput.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        if (!url) return;

        try {
          const urlObj = new URL(url);
          if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
            showInputError('longUrl', 'URL must start with http:// or https://');
          } else {
            clearInputError('longUrl');
          }
        } catch (err) {
          if (url.length > 10) {
            showInputError('longUrl', 'Invalid URL format');
          }
        }
      });
    }

    // Real-time short code validation
    function setupShortCodeValidation() {
      const shortCodeInput = $('shortCode');
      if (!shortCodeInput) return;

      shortCodeInput.addEventListener('input', (e) => {
        const code = e.target.value;
        const errorEl = $('shortCodeError');

        if (!code) {
          errorEl.textContent = '';
          shortCodeInput.style.borderColor = '';
          return;
        }

        // Check pattern
        if (!/^[a-zA-Z0-9_-]+$/.test(code)) {
          showInputError('shortCode', 'Only letters, numbers, hyphens, and underscores allowed');
        } else if (code.length < 3) {
          showInputError('shortCode', 'Must be at least 3 characters');
        } else if (code.length > 50) {
          showInputError('shortCode', 'Must not exceed 50 characters');
        } else {
          clearInputError('shortCode');
        }
      });
    }

    // Show input error
    function showInputError(inputId, message) {
      const input = $(inputId);
      const errorEl = $(inputId + 'Error') || $(inputId + 'Hint');
      if (input) input.style.borderColor = '#ff4444';
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.color = '#ff4444';
      }
    }

    // Clear input error
    function clearInputError(inputId) {
      const input = $(inputId);
      const errorEl = $(inputId + 'Error') || $(inputId + 'Hint');
      if (input) input.style.borderColor = '';
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.color = '';
      }
    }

    // Generate random short code for preview
    function generateRandomCode() {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }

    // Update URL preview
    function updateUrlPreview() {
      const longUrl = $('longUrl')?.value.trim();
      const shortCode = $('shortCode')?.value.trim();
      const expiresIn = $('expiresIn')?.value;
      const previewBox = $('urlPreview');

      if (!previewBox) return;

      // Show/hide preview based on URL input
      if (!longUrl || longUrl.length < 10) {
        previewBox.classList.add('hidden');
        return;
      }

      // Validate URL
      try {
        new URL(longUrl);
      } catch (err) {
        previewBox.classList.add('hidden');
        return;
      }

      // Show preview
      previewBox.classList.remove('hidden');

      // Update long URL preview (truncate if too long)
      const displayUrl = longUrl.length > 60 ? longUrl.substring(0, 60) + '...' : longUrl;
      $('previewLongUrl').textContent = displayUrl;

      // Update short URL preview
      const code = shortCode || generateRandomCode();
      const shortUrl = \`https://\${DOMAIN}/\${code}\`;
      $('previewShortUrl').textContent = shortUrl;

      // Update expiration preview
      const expirationContainer = $('previewExpirationContainer');
      if (expiresIn) {
        expirationContainer.style.display = 'flex';
        const expirationLabels = {
          '3600': 'in 1 hour',
          '86400': 'in 1 day',
          '604800': 'in 1 week',
          '2592000': 'in 30 days',
          '7776000': 'in 90 days',
          '31536000': 'in 1 year'
        };
        $('previewExpiration').textContent = expirationLabels[expiresIn] || 'Custom';
      } else {
        expirationContainer.style.display = 'none';
      }
    }

    // Setup URL preview listeners
    function setupUrlPreview() {
      const longUrlInput = $('longUrl');
      const shortCodeInput = $('shortCode');
      const expiresInSelect = $('expiresIn');

      if (longUrlInput) {
        longUrlInput.addEventListener('input', updateUrlPreview);
      }
      if (shortCodeInput) {
        shortCodeInput.addEventListener('input', updateUrlPreview);
      }
      if (expiresInSelect) {
        expiresInSelect.addEventListener('change', updateUrlPreview);
      }
    }

    // Handle form submission
    function setupCreateForm() {
      const createForm = $('createForm');
      if (!createForm) return;

      createForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const longUrl = $('longUrl').value.trim();
      const shortCode = $('shortCode').value.trim();
      const expiresIn = $('expiresIn').value;

      // Client-side validation
      if (!longUrl) {
        showAlert('Please enter a URL', 'error');
        return;
      }

      try {
        new URL(longUrl);
      } catch (err) {
        showAlert('Please enter a valid URL', 'error');
        $('longUrl').focus();
        return;
      }

      const submitBtn = e.target.querySelector('button[type="submit"]');
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      showAlert('Creating short URL...', 'success');

      try {
        const payload = { url: longUrl, shortCode };
        if (expiresIn) {
          payload.expiresIn = parseInt(expiresIn);
        }

        const response = await fetch('/api/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          currentShortUrl = data.shortUrl;
          currentCreatedShortCode = data.shortCode;

          // Check if this is a duplicate URL
          const isDuplicate = data.duplicate === true;
          const duplicateWarning = isDuplicate
            ? \`<div style="margin-bottom: 15px; padding: 10px; background: var(--accent); color: var(--accent-text); border-radius: 4px; font-size: 0.9em;">
                 <strong>ℹ️ This URL was already shortened!</strong><br>
                 Showing the existing short link instead of creating a duplicate.
               </div>\`
            : '';

          // Display both short URL and edit URL
          document.getElementById('shortUrlDisplay').innerHTML = \`
            \${duplicateWarning}
            <div style="margin-bottom: 15px;">
              <strong>Short URL:</strong><br>
              <a href="\${escapeHtml(data.shortUrl)}" target="_blank" style="color: var(--accent); word-break: break-all;">\${escapeHtml(data.shortUrl)}</a>
            </div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border-color);">
              <strong>Edit URL (save this to edit/delete later):</strong><br>
              <span style="color: var(--text-meta); font-size: 0.9em;">Anyone with this link can edit or delete this URL</span><br>
              <a href="\${escapeHtml(data.editUrl)}" target="_blank" style="color: var(--accent); word-break: break-all; font-size: 0.95em;">\${escapeHtml(data.editUrl)}</a>
            </div>
            \${isDuplicate ? '<div style="margin-top: 15px; padding: 10px; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 4px; font-size: 0.85em; color: var(--text-secondary);">Want a new short code for the same URL? Enter a custom short code above.</div>' : ''}
          \`;
          document.getElementById('resultBox').style.display = 'block';

          const alertMessage = isDuplicate
            ? 'Found existing short link! No need to create a duplicate.'
            : 'Short URL created successfully! Save the edit link to manage it later.';
          showAlert(alertMessage, 'success');

          // Auto-generate and show QR code
          setTimeout(() => {
            generateQR(currentCreatedShortCode);
          }, 500);

          // Clear form
          document.getElementById('longUrl').value = '';
          document.getElementById('shortCode').value = '';

          // Reload URL list if logged in
          if (isLoggedIn) {
            loadUrls();
          }
        } else {
          showAlert('Error: ' + data.error, 'error');
        }
      } catch (error) {
        showAlert('Error: ' + error.message, 'error');
      } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
      });
    }

    // Load global analytics
    async function loadGlobalAnalytics() {
      if (!isLoggedIn) return;

      try {
        const response = await fetch('/api/analytics/global', {
          headers: { 'Authorization': 'Bearer ' + adminPassword }
        });

        const data = await response.json();
        if (response.ok) {
          // Calculate additional metrics
          const avgVisitsPerUrl = data.totalUrls > 0 ? (data.totalVisits / data.totalUrls).toFixed(1) : 0;
          const trackedVisits = data.recentVisits?.length || 0;

          // Helper function to render analytics bar chart
          const renderBarChart = (items, maxCount) => {
            return items.map(item => {
              const percentage = maxCount > 0 ? (item.count / maxCount * 100).toFixed(1) : 0;
              return \`
                <div class="analytics-stat" style="margin-bottom: 16px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                    <span style="font-weight: 500;">\${escapeHtml(item.name)}</span>
                    <span style="color: var(--accent); font-weight: 600;">\${item.count} (\${percentage}%)</span>
                  </div>
                  <div style="background: var(--border-color); border-radius: 4px; height: 10px; overflow: hidden;">
                    <div style="background: var(--accent); height: 100%; width: \${percentage}%; transition: width 0.3s ease;"></div>
                  </div>
                </div>
              \`;
            }).join('');
          };

          const html = \`
            <!-- Stats Cards -->
            <div class="analytics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-bottom: 20px;">
              <div class="analytics-card">
                <div class="analytics-card-value">\${(data.totalVisits || 0).toLocaleString()}</div>
                <div class="analytics-card-label">Total Visits</div>
              </div>
              <div class="analytics-card">
                <div class="analytics-card-value">\${trackedVisits}</div>
                <div class="analytics-card-label">Tracked Visits</div>
              </div>
              <div class="analytics-card">
                <div class="analytics-card-value">\${(data.totalUrls || 0).toLocaleString()}</div>
                <div class="analytics-card-label">Total URLs</div>
              </div>
              <div class="analytics-card">
                <div class="analytics-card-value">\${avgVisitsPerUrl}</div>
                <div class="analytics-card-label">Avg Visits/URL</div>
              </div>
              <div class="analytics-card">
                <div class="analytics-card-value">\${data.topCountries?.length || 0}</div>
                <div class="analytics-card-label">Countries</div>
              </div>
              <div class="analytics-card">
                <div class="analytics-card-value">\${data.topBrowsers?.length || 0}</div>
                <div class="analytics-card-label">Browsers</div>
              </div>
            </div>

            <!-- Tabs -->
            <div style="margin-bottom: 20px;">
              <div style="display: flex; gap: 10px; border-bottom: 2px solid var(--border-color); margin-bottom: 20px;">
                <button class="analytics-tab active" data-tab="overview">Overview</button>
                <button class="analytics-tab" data-tab="traffic">Traffic Sources</button>
                <button class="analytics-tab" data-tab="technology">Technology</button>
                <button class="analytics-tab" data-tab="recent">Recent Visits</button>
              </div>

              <!-- Overview Tab -->
              <div class="analytics-tab-content" data-tab-content="overview">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                  <div>
                    <h3 style="margin-bottom: 15px;">Top Countries</h3>
                    \${data.topCountries && data.topCountries.length > 0 ?
                      renderBarChart(data.topCountries.slice(0, 5), data.topCountries[0].count) :
                      '<p style="color: var(--text-meta);">No data</p>'}
                  </div>
                  <div>
                    <h3 style="margin-bottom: 15px;">Top Browsers</h3>
                    \${data.topBrowsers && data.topBrowsers.length > 0 ?
                      renderBarChart(data.topBrowsers.slice(0, 5), data.topBrowsers[0].count) :
                      '<p style="color: var(--text-meta);">No data</p>'}
                  </div>
                  <div>
                    <h3 style="margin-bottom: 15px;">Top Devices</h3>
                    \${data.topDevices && data.topDevices.length > 0 ?
                      renderBarChart(data.topDevices, data.topDevices[0].count) :
                      '<p style="color: var(--text-meta);">No data</p>'}
                  </div>
                  <div>
                    <h3 style="margin-bottom: 15px;">Top Operating Systems</h3>
                    \${data.topOS && data.topOS.length > 0 ?
                      renderBarChart(data.topOS.slice(0, 5), data.topOS[0].count) :
                      '<p style="color: var(--text-meta);">No data</p>'}
                  </div>
                </div>
              </div>

              <!-- Traffic Sources Tab -->
              <div class="analytics-tab-content hidden" data-tab-content="traffic">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                  <div>
                    <h3 style="margin-bottom: 15px;">Top Referrers</h3>
                    \${data.topReferers && data.topReferers.length > 0 ?
                      renderBarChart(data.topReferers, data.topReferers[0].count) :
                      '<p style="color: var(--text-meta);">No data</p>'}
                  </div>
                  <div>
                    <h3 style="margin-bottom: 15px;">Top Cities</h3>
                    \${data.topCities && data.topCities.length > 0 ?
                      renderBarChart(data.topCities, data.topCities[0].count) :
                      '<p style="color: var(--text-meta);">No data</p>'}
                  </div>
                </div>
                <div style="margin-top: 20px;">
                  <h3 style="margin-bottom: 15px;">All Countries</h3>
                  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
                    \${(data.topCountries || []).map(item => \`
                      <div class="analytics-stat">
                        <span>\${escapeHtml(item.name)}</span>
                        <span style="color: var(--accent); font-weight: 600;">\${item.count}</span>
                      </div>
                    \`).join('') || '<p style="color: var(--text-meta);">No data</p>'}
                  </div>
                </div>
              </div>

              <!-- Technology Tab -->
              <div class="analytics-tab-content hidden" data-tab-content="technology">
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 30px;">
                  <div>
                    <h3 style="margin-bottom: 15px;">All Browsers</h3>
                    \${(data.topBrowsers || []).map(item => \`
                      <div class="analytics-stat">
                        <span>\${escapeHtml(item.name)}</span>
                        <span style="color: var(--accent); font-weight: 600;">\${item.count}</span>
                      </div>
                    \`).join('') || '<p style="color: var(--text-meta);">No data</p>'}
                  </div>
                  <div>
                    <h3 style="margin-bottom: 15px;">All Operating Systems</h3>
                    \${(data.topOS || []).map(item => \`
                      <div class="analytics-stat">
                        <span>\${escapeHtml(item.name)}</span>
                        <span style="color: var(--accent); font-weight: 600;">\${item.count}</span>
                      </div>
                    \`).join('') || '<p style="color: var(--text-meta);">No data</p>'}
                  </div>
                  <div>
                    <h3 style="margin-bottom: 15px;">All Devices</h3>
                    \${(data.topDevices || []).map(item => \`
                      <div class="analytics-stat">
                        <span>\${escapeHtml(item.name)}</span>
                        <span style="color: var(--accent); font-weight: 600;">\${item.count}</span>
                      </div>
                    \`).join('') || '<p style="color: var(--text-meta);">No data</p>'}
                  </div>
                </div>
              </div>

              <!-- Recent Visits Tab -->
              <div class="analytics-tab-content hidden" data-tab-content="recent">
                <h3 style="margin-bottom: 15px;">Recent Visits (Last 20)</h3>
                \${(data.recentVisits || []).slice(0, 20).map(visit => \`
                  <div class="analytics-stat" style="padding: 12px 0; border-bottom: 1px solid var(--border-color);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <strong style="color: var(--text-primary);">\${formatUTCDate(visit.timestamp)}</strong>
                      <span style="color: var(--accent);">\${escapeHtml(visit.browser || 'Unknown')} on \${escapeHtml(visit.device || 'Unknown')}</span>
                    </div>
                    <div style="font-size: 13px; color: var(--text-meta);">
                      <span>\${escapeHtml(visit.country || 'Unknown')}, \${escapeHtml(visit.city || 'Unknown')}</span> •
                      <span>\${escapeHtml(visit.os || 'Unknown')}</span> •
                      <span>IP: \${escapeHtml(visit.ip || 'unknown')}</span>
                    </div>
                    <div style="font-size: 13px; color: var(--text-meta); margin-top: 4px;">
                      <span>Referer: \${escapeHtml(visit.referer || 'Direct/Unknown')}</span>
                    </div>
                  </div>
                \`).join('') || '<p style="color: var(--text-meta);">No visits yet</p>'}
              </div>
            </div>
          \`;

          document.getElementById('globalAnalytics').innerHTML = html;

          // Setup tab switching
          document.querySelectorAll('.analytics-tab').forEach(tab => {
            tab.addEventListener('click', function() {
              const targetTab = this.getAttribute('data-tab');

              // Update active tab button
              document.querySelectorAll('.analytics-tab').forEach(t => t.classList.remove('active'));
              this.classList.add('active');

              // Show target content, hide others
              document.querySelectorAll('.analytics-tab-content').forEach(content => {
                if (content.getAttribute('data-tab-content') === targetTab) {
                  content.classList.remove('hidden');
                } else {
                  content.classList.add('hidden');
                }
              });
            });
          });
        } else {
          const elem = document.getElementById('globalAnalytics');
          elem.textContent = 'Failed to load analytics';
          elem.className = 'error';
        }
      } catch (error) {
        document.getElementById('globalAnalytics').innerHTML = '<p class="error">Error: ' + escapeHtml(error.message) + '</p>';
      }
    }

    // Load all URLs
    async function loadUrls() {
      if (!isLoggedIn) {
        return;
      }

      const urlList = document.getElementById('urlList');
      urlList.textContent = 'Loading...';
      urlList.className = 'loading';

      try {
        const response = await fetch('/api/urls', {
          headers: {
            'Authorization': 'Bearer ' + adminPassword
          }
        });
        const data = await response.json();

        if (response.ok) {
          if (data.urls.length === 0) {
            urlList.textContent = 'No URLs found';
            urlList.className = 'loading';
            allUrls = [];
            return;
          }

          allUrls = data.urls;
          applyFilters();
        } else {
          if (response.status === 401) {
            logout();
            showAlert('Session expired. Please login again.', 'error');
          } else {
            urlList.textContent = ''; // Safe clearing
            showAlert('Error: ' + data.error, 'error');
          }
        }
      } catch (error) {
        urlList.textContent = ''; // Safe clearing
        showAlert('Error: ' + error.message, 'error');
      }
    }

    // Apply filters and sorting
    function applyFilters() {
      const searchTerm = document.getElementById('searchUrls').value.toLowerCase();
      const sortBy = document.getElementById('sortBy').value;

      let filtered = allUrls.filter(url => {
        return url.longUrl.toLowerCase().includes(searchTerm) ||
               url.shortCode.toLowerCase().includes(searchTerm);
      });

      // Sort
      switch(sortBy) {
        case 'date-asc':
          filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case 'date-desc':
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'visits-asc':
          filtered.sort((a, b) => (a.visits || 0) - (b.visits || 0));
          break;
        case 'visits-desc':
          filtered.sort((a, b) => (b.visits || 0) - (a.visits || 0));
          break;
      }

      renderUrls(filtered);
    }

    // Render URLs
    function renderUrls(urls) {
      const urlList = document.getElementById('urlList');
      if (urls.length === 0) {
        urlList.textContent = 'No URLs match your search';
        urlList.className = 'loading';
        return;
      }

      urlList.innerHTML = urls.map(url => {
        const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date();
        const expirationStatus = url.expiresAt
          ? (isExpired ? \`<span style="color: #ff0000;">EXPIRED</span>\` : \`Expires: \${formatDate(url.expiresAt)}\`)
          : 'Never expires';

        return \`
        <div class="url-item" style="\${isExpired ? 'opacity: 0.6; border-left: 3px solid #ff0000;' : ''}">
          <div class="url-info">
            <div class="url-short">\${escapeHtml(DOMAIN)}/\${escapeHtml(url.shortCode)}</div>
            <div class="url-long">\${escapeHtml(url.longUrl)}</div>
            <div class="url-meta">
              Created: \${formatDate(url.createdAt)} | Visits: \${url.visits || 0} | \${expirationStatus}
              \${url.updatedAt ? \` | Updated: \${formatDate(url.updatedAt)}\` : ''}
            </div>
          </div>
          <div class="url-actions">
            <button class="btn btn-small" onclick="copyUrl('https://\${escapeHtml(DOMAIN)}/\${escapeHtml(url.shortCode)}')">Copy</button>
            <button class="btn btn-small" onclick="generateQR('\${escapeHtml(url.shortCode)}')">QR Code</button>
            <button class="btn btn-small" onclick="showAnalytics('\${escapeHtml(url.shortCode)}')">Analytics</button>
            <button class="btn btn-small" onclick="showEditModal('\${escapeHtml(url.shortCode)}', '\${escapeHtml(url.longUrl)}', '\${escapeHtml(url.expiresAt || '')}')">Edit</button>
            <button class="btn btn-small btn-danger" onclick="deleteUrl('\${escapeHtml(url.shortCode)}')">Delete</button>
          </div>
        </div>
        \`;
      }).join('');
    }

    // Show toast notification
    function showToast(message) {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }

    // Helper: Check if position is in finder pattern or format area
    // QR Code generator - Client-side generation using QRCode.js
    let currentQRUrl = '';
    let qrCodeInstance = null;

    function generateQR(shortCode) {
      const url = \`https://\${DOMAIN}/\${shortCode}\`;
      currentQRUrl = url;

      const container = document.getElementById('qrCodeContainer');

      // Set URL text first
      document.getElementById('qrUrl').textContent = url;

      // Lazy load QR code library on first use
      if (!window.QRCode) {
        // Open modal immediately with loading message
        container.textContent = 'Loading QR Code...';
        container.style.cssText = 'text-align: center; color: var(--text-secondary); padding: 20px;';
        openModal('qrModal');

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
        script.crossOrigin = 'anonymous';
        script.referrerPolicy = 'no-referrer';
        script.onload = () => {
          createQRCode(url, container);
          showToast('QR Code generated');
        };
        script.onerror = () => {
          container.textContent = 'Failed to load QR code library. Please check your internet connection.';
          container.style.cssText = 'color: var(--danger); padding: 20px;';
          showToast('QR Code load failed', 'error');
        };
        document.head.appendChild(script);
      } else {
        // Library already loaded, create QR code and show modal
        createQRCode(url, container);
        openModal('qrModal');
        showToast('QR Code generated');
      }
    }

    function createQRCode(url, container) {
      // Clear any existing QR code
      container.textContent = ''; // Safe clearing

      try {
        // Create QR code via JS library
        qrCodeInstance = new QRCode(container, {
          text: url,
          width: 300,
          height: 300,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      } catch (error) {
        console.error('QR Code generation error:', error);
        container.textContent = 'Error generating QR code';
        container.style.cssText = 'color: var(--danger); padding: 20px;';
        showToast('QR Code generation failed', 'error');
      }
    }

    // Close QR modal
    function closeQRModal() {
      closeModal('qrModal');
    }

    // Download QR code as PNG
    function downloadQR() {
      const container = document.getElementById('qrCodeContainer');
      const canvas = container.querySelector('canvas');
      const img = container.querySelector('img');

      if (!currentQRUrl) {
        showToast('QR Code not loaded', 'error');
        return;
      }

      const shortCode = currentQRUrl.split('/').pop();

      // Prefer canvas if it exists
      if (canvas) {
        canvas.toBlob(function(blob) {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = \`qrcode-\${shortCode}.png\`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
          showToast('QR Code downloaded');
        });
        return;
      }

      // Fallback: if library rendered an <img>, draw it to canvas then save
      if (img) {
        const tmpCanvas = document.createElement('canvas');
        const size = 300;
        tmpCanvas.width = size;
        tmpCanvas.height = size;
        const ctx = tmpCanvas.getContext('2d');

        const tmpImg = new Image();
        tmpImg.crossOrigin = 'anonymous';
        tmpImg.onload = function() {
          ctx.drawImage(tmpImg, 0, 0, size, size);
          tmpCanvas.toBlob(function(blob) {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`qrcode-\${shortCode}.png\`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            showToast('QR Code downloaded');
          });
        };
        tmpImg.src = img.src;
      }
    }

    // Delete URL
    async function deleteUrl(shortCode) {
      if (!confirm('Are you sure you want to delete this URL?')) {
        return;
      }

      try {
        const response = await fetch('/api/delete/' + shortCode, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + adminPassword
          }
        });

        const data = await response.json();

        if (response.ok) {
          showAlert('URL deleted successfully', 'success');
          loadUrls();
        } else {
          if (response.status === 401) {
            logout();
            showAlert('Session expired. Please login again.', 'error');
          } else {
            showAlert('Error: ' + data.error, 'error');
          }
        }
      } catch (error) {
        showAlert('Error: ' + error.message, 'error');
      }
    }

    // Format date to yyyy-mm-dd HH:mm:ss UTC
    /**
     * SECURITY: HTML escaping to prevent XSS attacks
     * Always use this function when inserting user data or dynamic content into HTML
     * @param {string} unsafe - Untrusted string that may contain HTML/JS
     * @returns {string} Escaped string safe for HTML insertion
     */
    function escapeHtml(unsafe) {
      if (!unsafe) return '';
      return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      const seconds = String(date.getUTCSeconds()).padStart(2, '0');
      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + ' UTC';
    }

    // Copy URL to clipboard
    function copyToClipboard() {
      navigator.clipboard.writeText(currentShortUrl).then(() => {
        showToast('Copied to clipboard!');
      });
    }

    // Show QR code for currently created short URL
    function showCurrentQR() {
      if (currentCreatedShortCode) {
        generateQR(currentCreatedShortCode);
      } else {
        showToast('No short code available', 'error');
      }
    }

    function copyUrl(url) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('Copied to clipboard!');
      });
    }

    // Focus management for modals
    let lastFocusedElement = null;

    function trapFocus(modal) {
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      modal.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      });
    }

    function openModal(modalId) {
      lastFocusedElement = document.activeElement;
      const modal = $(modalId);
      modal.classList.add('active');
      trapFocus(modal);

      // Focus first focusable element
      const firstInput = modal.querySelector('input, button, select, textarea');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }

    function closeModal(modalId) {
      $(modalId).classList.remove('active');
      if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
      }
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeEditModal();
        closeAnalyticsModal();
        closeQRModal();
        hideLogin();
      }

      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = $('searchUrls');
        if (searchInput && !searchInput.classList.contains('hidden')) {
          searchInput.focus();
        }
      }

      // Ctrl/Cmd + / to focus long URL input
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        $('longUrl').focus();
      }
    });

    // Universal alert function
    function showAlertIn(alertId, message, type) {
      const alert = $(alertId);
      alert.textContent = message;
      alert.className = 'alert alert-' + type;
      alert.style.display = 'block';
      setTimeout(() => alert.style.display = 'none', 5000);
    }

    // Specific alert helpers
    const showAlert = (msg, type) => showAlertIn('alert', msg, type);
    const showLoginAlert = (msg, type) => showAlertIn('loginAlert', msg, type);
    const showEditAlert = (msg, type) => showAlertIn('editAlert', msg, type);

    // Show edit modal
    function showEditModal(shortCode, longUrl, expiresAt) {
      $('editShortCode').value = shortCode;
      $('editLongUrl').value = longUrl;
      $('editExpiresIn').value = '';

      // Display current expiration status
      const hintElement = $('currentExpirationHint');
      if (expiresAt) {
        const expirationDate = new Date(expiresAt);
        const isExpired = expirationDate < new Date();
        if (isExpired) {
          hintElement.textContent = 'Current: EXPIRED on ' + formatDate(expiresAt);
          hintElement.style.color = '#ff0000';
        } else {
          hintElement.textContent = 'Current: Expires on ' + formatDate(expiresAt);
          hintElement.style.color = 'var(--text-secondary)';
        }
      } else {
        hintElement.textContent = 'Current: Never expires';
        hintElement.style.color = 'var(--text-secondary)';
      }

      openModal('editModal');
    }

    // Close edit modal
    function closeEditModal() {
      closeModal('editModal');
      $('editForm').reset();
    }

    // Helper: Create analytics bar chart
    function createBarChart(items, maxCount) {
      return items.map(item => {
        const percentage = maxCount > 0 ? (item.count / maxCount * 100) : 0;
        return \`
          <div class="analytics-stat-with-bar">
            <div class="analytics-stat-header">
              <span>\${escapeHtml(item.name)}</span>
              <span>\${item.count} (\${percentage.toFixed(1)}%)</span>
            </div>
            <div class="analytics-bar">
              <div class="analytics-bar-fill" style="width: \${percentage}%"></div>
            </div>
          </div>
        \`;
      }).join('');
    }

    // Show analytics modal
    async function showAnalytics(shortCode) {
      openModal('analyticsModal');
      const analyticsContent = document.getElementById('analyticsContent');
      analyticsContent.textContent = 'Loading analytics...';
      analyticsContent.className = 'loading';

      try {
        const response = await fetch('/api/analytics/' + shortCode, {
          headers: {
            'Authorization': 'Bearer ' + adminPassword
          }
        });
        const data = await response.json();

        if (response.ok) {
          const analytics = data.analytics;
          const detailedVisits = analytics.detailedVisits || [];

          if (analytics.totalVisits === 0) {
            const analyticsContent = document.getElementById('analyticsContent');
            analyticsContent.textContent = 'No visits yet';
            analyticsContent.className = 'loading';
            return;
          }

          const maxCount = Math.max(...[
            ...analytics.topReferers?.map(i => i.count) || [0],
            ...analytics.topCountries?.map(i => i.count) || [0],
            ...analytics.topBrowsers?.map(i => i.count) || [0]
          ]);

          // Build analytics HTML with tabs
          let html = \`
            <div class="analytics-grid">
              <div class="analytics-card">
                <div class="analytics-card-value">\${analytics.totalVisits}</div>
                <div class="analytics-card-label">Total Visits</div>
              </div>
              <div class="analytics-card">
                <div class="analytics-card-value">\${detailedVisits.length}</div>
                <div class="analytics-card-label">Tracked Visits</div>
              </div>
              <div class="analytics-card">
                <div class="analytics-card-value">\${analytics.topCountries?.length || 0}</div>
                <div class="analytics-card-label">Countries</div>
              </div>
              <div class="analytics-card">
                <div class="analytics-card-value">\${analytics.topBrowsers?.length || 0}</div>
                <div class="analytics-card-label">Browsers</div>
              </div>
            </div>

            <div class="analytics-tabs">
              <button class="analytics-tab active" onclick="switchAnalyticsTab('overview')">Overview</button>
              <button class="analytics-tab" onclick="switchAnalyticsTab('traffic')">Traffic Sources</button>
              <button class="analytics-tab" onclick="switchAnalyticsTab('technology')">Technology</button>
              <button class="analytics-tab" onclick="switchAnalyticsTab('recent')">Recent Visits</button>
            </div>

            <div id="analytics-overview" class="analytics-panel active">
              <div class="analytics-section">
                <h3>Top Countries</h3>
                \${createBarChart(analytics.topCountries || [], maxCount)}
              </div>
              <div class="analytics-section">
                <h3>Top Cities</h3>
                \${createBarChart(analytics.topCities || [], maxCount)}
              </div>
            </div>

            <div id="analytics-traffic" class="analytics-panel">
              <div class="analytics-section">
                <h3>Top Referrers</h3>
                \${createBarChart(analytics.topReferers || [], maxCount)}
              </div>
            </div>

            <div id="analytics-technology" class="analytics-panel">
              <div class="analytics-section">
                <h3>Browsers</h3>
                \${createBarChart(analytics.topBrowsers || [], maxCount)}
              </div>
              <div class="analytics-section">
                <h3>Devices</h3>
                \${createBarChart(analytics.topDevices || [], maxCount)}
              </div>
              <div class="analytics-section">
                <h3>Operating Systems</h3>
                \${createBarChart(analytics.topOS || [], maxCount)}
              </div>
            </div>

            <div id="analytics-recent" class="analytics-panel">
              <div class="analytics-section">
                <h3>Recent Visits (Last 20)</h3>
                \${detailedVisits.length > 0 ? detailedVisits.slice(-20).reverse().map(visit => \`
                  <div class="analytics-stat" style="padding: 12px 0; border-bottom: 1px solid var(--border-color);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <strong style="color: var(--text-primary);">\${formatUTCDate(visit.timestamp)}</strong>
                      <span style="color: var(--accent);">\${escapeHtml(visit.browser || 'Unknown')} on \${escapeHtml(visit.device || 'Unknown')}</span>
                    </div>
                    <div style="font-size: 13px; color: var(--text-meta);">
                      <span>\${escapeHtml(visit.country || 'Unknown')}, \${escapeHtml(visit.city || 'Unknown')}</span> •
                      <span>\${escapeHtml(visit.os || 'Unknown')}</span> •
                      <span>IP: \${escapeHtml(visit.ip || 'unknown')}</span>
                    </div>
                    <div style="font-size: 13px; color: var(--text-meta); margin-top: 4px;">
                      <span>Referer: \${escapeHtml(visit.referer || 'Direct/Unknown')}</span>
                    </div>
                  </div>
                \`).join('') : '<p>No recent visits</p>'}
              </div>
            </div>
          \`;

          document.getElementById('analyticsContent').innerHTML = html;
        } else {
          const analyticsContent = document.getElementById('analyticsContent');
          analyticsContent.textContent = 'Error loading analytics';
          analyticsContent.className = 'loading';
        }
      } catch (error) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'loading';
        errorDiv.textContent = 'Error: ' + error.message;
        document.getElementById('analyticsContent').textContent = ''; // Safe clearing
        document.getElementById('analyticsContent').appendChild(errorDiv);
      }
    }

    // Switch analytics tabs
    function switchAnalyticsTab(tabName) {
      document.querySelectorAll('.analytics-tab').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.analytics-panel').forEach(panel => panel.classList.remove('active'));

      event.target.classList.add('active');
      document.getElementById('analytics-' + tabName).classList.add('active');
    }

    // Close analytics modal
    function closeAnalyticsModal() {
      closeModal('analyticsModal');
    }

    // Handle edit form submission
    document.getElementById('editForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const shortCode = document.getElementById('editShortCode').value;
      const newLongUrl = document.getElementById('editLongUrl').value;
      const expiresIn = document.getElementById('editExpiresIn').value;

      const submitBtn = e.target.querySelector('button[type="submit"]');
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      showEditAlert('Updating URL...', 'success');

      try {
        const payload = {
          url: newLongUrl
        };

        // Handle expiration update
        if (expiresIn === 'remove') {
          payload.removeExpiration = true;
        } else if (expiresIn) {
          payload.expiresIn = parseInt(expiresIn);
        }

        const response = await fetch('/api/update/' + shortCode, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + adminPassword
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          showEditAlert('URL updated successfully!', 'success');
          setTimeout(() => {
            closeEditModal();
            loadUrls();
            showAlert('URL updated successfully!', 'success');
          }, 1000);
        } else {
          if (response.status === 401) {
            logout();
            closeEditModal();
            showAlert('Session expired. Please login again.', 'error');
          } else {
            showEditAlert('Error: ' + data.error, 'error');
          }
        }
      } catch (error) {
        showEditAlert('Error: ' + error.message, 'error');
      } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    });

    // Load global stats
    async function loadGlobalStats() {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        if (response.ok) {
          document.getElementById('visitorCount').innerHTML = \`
            <span style="color: var(--accent); font-weight: bold;">\${(data.totalVisitors || 0).toLocaleString()}</span> total visitors •
            <span style="color: var(--accent); font-weight: bold;">\${(data.totalUrls || 0).toLocaleString()}</span> URLs shortened
          \`;
        }
      } catch (error) {
        document.getElementById('visitorCount').textContent = 'Stats unavailable';
      }
    }

    // Client-side validation with real-time feedback
    function setupValidation() {
      const longUrlInput = $('longUrl');
      const shortCodeInput = $('shortCode');
      const shortCodeError = $('shortCodeError');

      if (!longUrlInput || !shortCodeInput || !shortCodeError) return;

      // Validate URL in real-time (now supports both HTTP and HTTPS)
      longUrlInput.addEventListener('input', function() {
        const value = this.value.trim();
        if (!value) {
          this.classList.remove('invalid', 'valid');
          return;
        }

        try {
          const url = new URL(value);
          if (url.protocol === 'http:' || url.protocol === 'https:') {
            this.classList.remove('invalid');
            this.classList.add('valid');
          } else {
            this.classList.add('invalid');
            this.classList.remove('valid');
          }
        } catch (e) {
          if (value.length > 10) {
            this.classList.add('invalid');
            this.classList.remove('valid');
          }
        }
      });

      // Validate short code in real-time
      shortCodeInput.addEventListener('input', function() {
        const value = this.value.trim();

        if (value === '') {
          this.classList.remove('invalid', 'valid');
          shortCodeError.classList.remove('visible');
          shortCodeError.textContent = '';
          return;
        }

        if (value.length < 3) {
          this.classList.add('invalid');
          this.classList.remove('valid');
          shortCodeError.textContent = 'Must be at least 3 characters';
          shortCodeError.classList.add('visible');
        } else if (value.length > 50) {
          this.classList.add('invalid');
          this.classList.remove('valid');
          shortCodeError.textContent = 'Must not exceed 50 characters';
          shortCodeError.classList.add('visible');
        } else if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
          this.classList.add('invalid');
          this.classList.remove('valid');
          shortCodeError.textContent = 'Only letters, numbers, hyphens, and underscores';
          shortCodeError.classList.add('visible');
        } else {
          this.classList.remove('invalid');
          this.classList.add('valid');
          shortCodeError.classList.remove('visible');
          shortCodeError.textContent = '';
        }
      });
    }

    // Initialize on page load
    initTheme();
    checkSession();
    loadGlobalStats();
    setupLoginForm();
    setupCreateForm();
    setupValidation();
    setupUrlValidation();
    setupShortCodeValidation();
    setupUrlPreview();
    if (isLoggedIn) {
      loadUrls();
      // Analytics loads on-demand when switching to analytics page
    }
  </script>
</body>
</html>`;
}

export function getOfflinePage() {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline - pR1</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
      color: #00ff41;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      text-align: center;
      max-width: 500px;
    }
    h1 {
      font-size: 4em;
      margin-bottom: 20px;
      text-shadow: 0 0 20px rgba(0, 255, 65, 0.5);
    }
    p {
      font-size: 1.2em;
      margin-bottom: 30px;
      color: #00dd33;
    }
    .btn {
      background: #00ff41;
      color: #000;
      border: none;
      padding: 15px 30px;
      font-size: 1.1em;
      font-weight: bold;
      cursor: pointer;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      transition: all 0.3s;
    }
    .btn:hover {
      background: #00dd33;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 255, 65, 0.3);
    }
    .icon {
      font-size: 6em;
      margin-bottom: 20px;
      opacity: 0.7;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">📡</div>
    <h1>Offline</h1>
    <p>You're currently offline. Please check your internet connection and try again.</p>
    <button class="btn" onclick="window.location.reload()">Retry</button>
  </div>
</body>
</html>`;
}

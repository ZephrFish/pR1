# pR1

**pR1** - Pretty-fast serverless URL shortener built on Cloudflare Workers. Zero runtime dependencies, real-time analytics, automatic QR code generation, and optimized for the free tier.

First project I've developed with 100% just dictation and claude code (due to recovering from a shoulder surgery and unable to type properly)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)


## Features

- **Pretty Fast** - Edge computing with Cloudflare Workers
- **Real-time Analytics** - Track visits, locations, devices, and more
- **QR Codes** - Automatic generation for all short URLs
- **Self-Service Editing** - Edit tokens for public URL management
- **Free Tier Optimised** - Handle 2,500-3,000 redirects/day on free tier

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/zephrfish/pR1.git
cd pR1
npm install

# 2. Login to Cloudflare
npx wrangler login

# 3. Create KV namespaces
npx wrangler kv:namespace create "URL_STORE"
npx wrangler kv:namespace create "ANALYTICS"
npx wrangler kv:namespace create "URL_STORE" --preview
npx wrangler kv:namespace create "ANALYTICS" --preview

# 4. Configure wrangler.toml
cp wrangler.toml.example wrangler.toml
# Edit wrangler.toml with your KV IDs and domain

# 5. Set admin password
npx wrangler secret put ADMIN_PASSWORD
# Enter a strong password (12+ chars, mixed case, numbers, special chars)

# 6. Deploy
npm run deploy
```

Visit your domain and start creating short URLs!

## Requirements

- **Node.js** 18 or higher
- **Cloudflare Account** (free tier works perfectly)
- **Custom Domain** added to Cloudflare
- **Cloudflare API Token** with permissions:
  - Account > Workers KV Storage > Edit
  - Account > Workers Scripts > Edit
  - Zone > Workers Routes > Edit

## Configuration

### 1. Create API Token

1. Visit [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token" → "Create Custom Token"
3. Set permissions:
   - **Account** | Workers KV Storage | Edit
   - **Account** | Workers Scripts | Edit
   - **Zone** | Workers Routes | Edit
4. Set **Zone Resources** to include your domain
5. Save token securely

### 2. Configure wrangler.toml

```toml
name = "pR1"
main = "src/index.js"
compatibility_date = "2024-11-01"

routes = [
  { pattern = "yourdomaingoeshere/*", zone_name = "yourdomaingoeshere" }
]

[[kv_namespaces]]
binding = "URL_STORE"
id = "your_url_store_id_here"
preview_id = "your_preview_id_here"

[[kv_namespaces]]
binding = "ANALYTICS"
id = "your_analytics_id_here"
preview_id = "your_preview_id_here"

[vars]
DOMAIN = "yourdomaingoeshere"
ALLOW_HTTP = "true"           # Allow HTTP URLs (set false for production)
ALLOW_PRIVATE_IPS = "true"    # Allow private IPs (set false for production)
```

### 3. Set Secrets

```bash
# Set admin password (required)
npx wrangler secret put ADMIN_PASSWORD

# Password requirements:
# - Minimum 12 characters
# - Uppercase and lowercase letters
# - Numbers and special characters
```

### 4. Configure DNS

1. Go to Cloudflare Dashboard → DNS
2. Add A record:
   - **Type**: A
   - **Name**: @ (root domain)
   - **IPv4**: 192.0.2.1 (placeholder)
   - **Proxy**: **Enabled** (orange cloud) - Required

## Usage

### Web Interface

1. Visit your domain (e.g., `https://yourdomaingoeshere`)
2. Enter a long URL
3. Optional: Custom short code or expiration
4. Click "Create Short URL"
5. **QR code automatically appears** - scan or download
6. Copy, download QR, or share
7. Use edit token to manage your URL later

### Admin Panel

1. Click "Login" button
2. Enter admin password
3. View all URLs with analytics
4. Edit, delete, or view detailed analytics
5. Access global analytics dashboard
6. Generate QR codes for any URL

### API Usage

#### Create Short URL (Public)

```bash
curl -X POST https://yourdomaingoeshere/api/create \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/very/long/url",
    "shortCode": "mylink",
    "expiresIn": 86400
  }'
```

**Response:**
```json
{
  "success": true,
  "shortUrl": "https://yourdomaingoeshere/mylink",
  "shortCode": "mylink",
  "expiresAt": "2025-01-20T12:00:00.000Z",
  "editToken": "abc123...",
  "editUrl": "https://yourdomaingoeshere/e/abc123..."
}
```

#### List All URLs (Requires Auth)

```bash
curl https://yourdomaingoeshere/api/urls \
  -H "Authorization: Bearer your_admin_password"
```

#### Get Analytics (Requires Auth)

```bash
curl https://yourdomaingoeshere/api/analytics/mylink \
  -H "Authorization: Bearer your_admin_password"
```

**Response includes:**
- Total visits (human vs bot)
- Unique visitors and sessions
- Geographic data (country, city, timezone)
- Technology data (browser, OS, device)
- Traffic sources (referrers, UTM parameters)
- Network information (ASN, data center)

#### Update URL (Requires Auth or Edit Token)

```bash
# With admin password
curl -X PUT https://yourdomaingoeshere/api/update/mylink \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_admin_password" \
  -d '{"url": "https://example.com/new-destination"}'

# With edit token (public)
curl -X PUT https://yourdomaingoeshere/api/url/EDIT_TOKEN \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/new-destination"}'
```

#### Delete URL (Requires Auth or Edit Token)

```bash
# With admin password
curl -X DELETE https://yourdomaingoeshere/api/delete/mylink \
  -H "Authorization: Bearer your_admin_password"

# With edit token (public)
curl -X DELETE https://yourdomaingoeshere/api/url/EDIT_TOKEN
```

#### Get Global Stats (Public)

```bash
curl https://yourdomaingoeshere/api/stats
```

## Architecture

```
┌─────────────────┐
│     Browser     │
└────────┬────────┘
         │ HTTPS
         ↓
┌───────────────────────────┐
│  Cloudflare Workers       │
│  (Edge Computing)         │
│  ┌────────────────────┐   │
│  │  src/index.js      │   │
│  │  - Routing         │   │
│  │  - Security        │   │
│  │  - Rate Limiting   │   │
│  │  - API Handlers    │   │
│  └────────────────────┘   │
│  ┌────────────────────┐   │
│  │  src/html.js       │   │
│  │  - UI Templates    │   │
│  │  - QR Generation   │   │
│  │  - Themes          │   │
│  └────────────────────┘   │
│  ┌────────────────────┐   │
│  │  src/sw.js         │   │
│  │  - Service Worker  │   │
│  │  - Offline Support │   │
│  └────────────────────┘   │
└───────────┬───────────────┘
            │
      ┌─────┴──────┐
      ↓            ↓
┌──────────┐  ┌──────────┐
│URL_STORE │  │ANALYTICS │
│   KV     │  │   KV     │
└──────────┘  └──────────┘
```

## Free Tier Optimization

pR1 is heavily optimized to maximize usage on Cloudflare's free tier:

### Analytics Sampling
- **Detailed Analytics**: 2% sample rate (1 in 50 visits)
- **Visit Counters**: 5% sample rate (1 in 20 visits)
- **Statistical Accuracy**: Estimates are statistically valid

### KV Write Reduction
- **Before**: 2 writes per redirect (1000 redirects = 2000 writes )
- **After**: 0.07 writes per redirect (1000 redirects = 70 writes )
- **Reduction**: 96.5% fewer writes

### Capacity on Free Tier
- **~2,500-3,000 redirects/day** (was ~500 before optimization)
- Unlimited homepage visits (no KV writes)
- ~200 new URLs/day

## Development

### Local Development

```bash
# Start dev server
npm run dev
# Access at http://localhost:8787

# View logs in real-time
npx wrangler tail
```

### Testing

```bash
# Create test URL
curl -X POST http://localhost:8787/api/create \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "shortCode": "test"}'

# Test redirect
curl -I http://localhost:8787/test

# Run unit tests
npm test
```

### Debugging

```bash
# View logs
npx wrangler tail

# Check deployment
npx wrangler whoami
npx wrangler deployments list

# List KV namespaces
npx wrangler kv:namespace list

# Inspect KV keys
npx wrangler kv:key list --namespace-id YOUR_ID
```

## Cost Breakdown

Runs entirely on **Cloudflare Free Tier**:

| Resource | Free Tier Limit | pR1 Usage (Optimized) | Status |
|----------|----------------|----------------------|---------|
| **Workers Requests** | 100,000/day | ~3,000/day |  3% |
| **KV Reads** | 100,000/day | ~3,000/day |  3% |
| **KV Writes** | 1,000/day | ~210/day |  21% |
| **KV Storage** | 1 GB | <1 MB |  <0.1% |
| **Bandwidth** | Unlimited | Free |  Free |

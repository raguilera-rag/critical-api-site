export function GET() {
  return new Response(
`User-agent: *
Disallow: /_astro/
Disallow: /api/
Disallow: /admin/

# Allow search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Block AI scrapers
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: FacebookBot
Disallow: /

# Sitemap
Sitemap: https://criticalapiservices.com/sitemap.xml
`,
{
  headers: {
    "Content-Type": "text/plain",
  },
});
}

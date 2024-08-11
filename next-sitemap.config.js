/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://website-lilac-eight-36.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 50000,
  outDir: 'public',
}

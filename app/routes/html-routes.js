/**
 * HTML Routes - Modern routing with security and error handling
 * Serves static HTML pages with proper caching and security headers
 */

const path = require('path');

/**
 * Secure file serving middleware
 * @param {string} filename - HTML file to serve
 * @returns {Function} Express middleware function
 */
const serveSecureHTML = (filename) => (req, res, next) => {
  try {
    const filePath = path.join(__dirname, '../public', filename);
    
    // Set security headers for HTML pages
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Cache-Control': 'public, max-age=300' // 5 minutes cache
    });
    
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(`Error serving ${filename}:`, err);
        res.status(404).json({
          error: 'Page not found',
          message: 'The requested page could not be found.'
        });
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = function(app) {

  // Home route - loads book search/view page
  app.get('/', serveSecureHTML('view.html'));

  // Add book route - loads the add book form
  app.get('/add', serveSecureHTML('add.html'));

  // All books route - displays all books in the database
  app.get('/all', serveSecureHTML('all.html'));

  // Short books route - displays books with 150 pages or less
  app.get('/short', serveSecureHTML('short.html'));

  // Long books route - displays books with more than 300 pages
  app.get('/long', serveSecureHTML('long.html'));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Robots.txt for SEO
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Disallow: /api/
Allow: /

Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml`);
  });

  // Basic sitemap for SEO
  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/all</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/add</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/long</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/short</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;
    
    res.type('application/xml');
    res.send(sitemap);
  });

};

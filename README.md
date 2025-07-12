# Books SQZ 📚

A modern, high-performance book library management system built with Express.js, Sequelize, and MySQL. Optimized for accessibility, performance, and developer experience following Lighthouse principles and ACID scoring methodology.

## ✨ Features

- 🚀 **High Performance**: Optimized for Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- ♿ **Accessible**: WCAG 2.1 AA compliant with proper ARIA labels and keyboard navigation
- 🔒 **Secure**: Helmet.js security headers, rate limiting, input validation, and XSS prevention
- 📱 **Responsive**: Mobile-first design with progressive enhancement
- 🔍 **SEO Optimized**: Semantic HTML, meta tags, and structured data
- 🧪 **Testable**: Comprehensive test suite with Jest
- 📊 **Analytics**: Built-in statistics and performance monitoring

## 🏗️ Architecture (ACID Scoring)

### Architecture (A)
- **Clean Code**: Modular structure with separation of concerns
- **Design Patterns**: RESTful API design with proper error handling
- **Scalability**: Connection pooling and optimized database queries
- **Testing**: Unit and integration tests with coverage reporting

### Cross-Domain (C)
- **Performance**: Compression, caching, and optimized asset loading
- **Compatibility**: Cross-browser support with graceful degradation
- **Accessibility**: Screen reader support and keyboard navigation
- **Mobile**: Responsive design with mobile-first approach

### Innovation (I)
- **Modern Stack**: Latest Node.js, Express 4.x, and Sequelize 6.x
- **Security**: Advanced security headers and rate limiting
- **Performance**: Async/await patterns and connection pooling
- **Developer Experience**: ESLint, automated testing, and hot reloading

### Documentation (D)
- **Self-Documenting**: Clear naming conventions and inline comments
- **API Documentation**: Comprehensive endpoint documentation
- **Setup Guide**: Step-by-step installation instructions
- **Examples**: Usage examples and code samples

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- MySQL >= 5.7 or MariaDB >= 10.2

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd books-sqz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Setup database**
   ```sql
   CREATE DATABASE sequelize_library;
   ```

5. **Start the application**
   ```bash
   # Development mode with hot reloading
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Visit the application**
   Open [http://localhost:8080](http://localhost:8080)

## 📖 API Documentation

### Books Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/api/all` | Get all books with pagination | `page`, `limit`, `sortBy`, `order` |
| GET | `/api/book/:id` | Get single book by ID | `id` (required) |
| GET | `/api/search/:title` | Search books by title | `title` (min 2 chars) |
| GET | `/api/genre/:genre` | Get books by genre | `genre` (required) |
| GET | `/api/author/:author` | Get books by author | `author` (required) |
| GET | `/api/books/long` | Get books > 300 pages | - |
| GET | `/api/books/short` | Get books ≤ 150 pages | - |
| POST | `/api/books` | Create new book | `title`, `author`, `genre`, `pages` |
| PUT | `/api/books/:id` | Update existing book | `id`, `title`, `author`, `genre`, `pages` |
| DELETE | `/api/books/:id` | Delete book | `id` (required) |
| GET | `/api/stats` | Get database statistics | - |

### Example Requests

**Create a new book:**
```bash
curl -X POST http://localhost:8080/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Fiction",
    "pages": 180
  }'
```

**Get paginated books:**
```bash
curl "http://localhost:8080/api/all?page=1&limit=10&sortBy=title&order=ASC"
```

**Search books by title:**
```bash
curl "http://localhost:8080/api/search/gatsby"
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage

# Lint code
npm run lint
```

## 📊 Performance Metrics

The application is optimized to meet Google Lighthouse standards:

- **Performance**: Score > 90
  - First Contentful Paint < 1.8s
  - Largest Contentful Paint < 2.5s
  - Cumulative Layout Shift < 0.1

- **Accessibility**: Score 100
  - WCAG 2.1 AA compliance
  - Proper ARIA labels
  - Keyboard navigation

- **Best Practices**: Score > 95
  - HTTPS enforcement
  - Security headers
  - Modern JavaScript

- **SEO**: Score > 95
  - Semantic HTML
  - Meta descriptions
  - Structured data

## 🔒 Security Features

- **Helmet.js**: Security headers (CSP, HSTS, X-Frame-Options)
- **Rate Limiting**: API endpoint protection
- **Input Validation**: XSS and injection prevention
- **Environment Variables**: Secure configuration management
- **CORS Configuration**: Cross-origin request control
- **Automated Security Scanning**: Daily vulnerability checks
- **Dependency Monitoring**: Automated dependency updates

### Security Commands

```bash
# Check for security vulnerabilities
npm run security:check

# Run security audit and auto-fix
npm run security

# Check before starting (automatically runs)
npm start
```

### Security Policy

Please see our [Security Policy](SECURITY.md) for information on:
- Reporting vulnerabilities
- Supported versions
- Security measures implemented
- Response timelines

## 🛠️ Development

### File Structure

```
books-sqz/
├── app/
│   ├── config/
│   │   └── connection.js     # Database configuration
│   ├── models/
│   │   └── book.js          # Book model with validation
│   ├── routes/
│   │   ├── api-routes.js    # API endpoints
│   │   └── html-routes.js   # HTML routes
│   └── public/
│       ├── js/
│       │   └── all.js       # Frontend JavaScript
│       └── *.html           # HTML pages
├── server.js                # Main server file
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Made with ❤️ by the Books SQZ Team**

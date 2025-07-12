# Security Policy

## Supported Versions

We actively support and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |
| 1.x.x   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. Please follow these steps to report security issues:

### How to Report

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. Email security issues to: [your-security-email@example.com]
3. Include detailed information about the vulnerability
4. Provide steps to reproduce the issue
5. Include any proof-of-concept code if applicable

### What to Include

Please include the following information in your report:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact of the vulnerability
- Any suggested fixes or mitigations
- Your contact information for follow-up

### Response Timeline

- **Initial Response**: Within 48 hours
- **Triage**: Within 5 business days
- **Fix Timeline**: Varies based on severity
  - Critical: 24-72 hours
  - High: 1-2 weeks
  - Medium: 2-4 weeks
  - Low: Next scheduled release

### Security Measures

Our application implements the following security measures:

#### Application Security
- Helmet.js for security headers
- Rate limiting on API endpoints
- Input validation and sanitization
- XSS protection
- SQL injection prevention via Sequelize ORM
- CORS configuration
- Environment variable protection

#### Infrastructure Security
- HTTPS enforcement
- Secure cookie configuration
- Content Security Policy (CSP)
- Security headers (HSTS, X-Frame-Options, etc.)
- Regular dependency updates
- Automated security scanning

#### Development Security
- ESLint security rules
- Automated dependency vulnerability scanning
- Pre-commit security checks
- Code review requirements
- Secure coding guidelines

### Dependencies

We regularly monitor and update our dependencies to address security vulnerabilities:

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Fix with breaking changes if necessary
npm audit fix --force
```

### Security Checklist for Contributors

Before submitting code, please ensure:

- [ ] No sensitive data (passwords, keys, tokens) in code
- [ ] Input validation for all user inputs
- [ ] Proper error handling without information disclosure
- [ ] No use of deprecated or vulnerable dependencies
- [ ] Security headers are properly configured
- [ ] Authentication and authorization checks are in place

### Vulnerability Disclosure

Once a vulnerability is fixed:

1. We will create a security advisory
2. Credit will be given to the reporter (if desired)
3. A CVE may be requested for significant vulnerabilities
4. Users will be notified through our standard channels

### Contact

For security-related questions or concerns:
- Security Email: [security@books-sqz.com] (replace with actual email)
- General Contact: [contact@books-sqz.com] (replace with actual email)
- GitHub Issues: For non-security bugs and feature requests

### Prerequisites for Secure Operation

Before running the application, ensure:

1. **Database Security**:
   - MySQL server is properly configured and running
   - Database user has minimal required privileges
   - Database connection uses strong credentials
   - See `DATABASE_SETUP.md` for secure database setup

2. **Environment Configuration**:
   - `.env` file contains proper credentials
   - No sensitive data in version control
   - Production environment variables are secure

3. **Network Security**:
   - Firewall properly configured
   - Only required ports are open
   - HTTPS enabled in production

### Acknowledgments

We appreciate the security research community and responsible disclosure of vulnerabilities. Contributors who report security issues will be acknowledged in our security advisories (unless they prefer to remain anonymous).

---

**Note**: This security policy is subject to updates. Please check back regularly for the latest version.

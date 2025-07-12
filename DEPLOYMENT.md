# Books SQZ Deployment Guide

## Production Deployment Checklist

### Environment Setup
- [ ] Set NODE_ENV=production
- [ ] Configure production database credentials
- [ ] Set secure SESSION_SECRET
- [ ] Configure HTTPS certificates
- [ ] Set up reverse proxy (nginx/Apache)

### Security Hardening
- [ ] Enable HTTPS only
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Configure firewall rules
- [ ] Set up SSL/TLS certificates

### Performance Optimization
- [ ] Enable gzip compression
- [ ] Configure static file caching
- [ ] Set up CDN for assets
- [ ] Optimize database indexes
- [ ] Configure connection pooling
- [ ] Enable application monitoring

### Database Setup
- [ ] Create production database
- [ ] Run database migrations
- [ ] Set up database backups
- [ ] Configure read replicas (if needed)
- [ ] Set up database monitoring

### Monitoring & Logging
- [ ] Configure application logging
- [ ] Set up error tracking
- [ ] Configure health checks
- [ ] Set up performance monitoring
- [ ] Configure alerting

## Docker Deployment

### Dockerfile (Production-ready)
```dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS app
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs
EXPOSE 8080
CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - DB_NAME=books_sqz_prod
      - DB_USER=${DB_USER}
      - DB_PASS=${DB_PASS}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASS}
      - MYSQL_DATABASE=books_sqz_prod
      - MYSQL_USER=${DB_USER}
      - MYSQL_PASSWORD=${DB_PASS}
    volumes:
      - db_data:/var/lib/mysql
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  db_data:
```

## Nginx Configuration

### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:8080;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static file caching
        location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

## Environment Variables (Production)

### .env.production
```bash
# Database
DB_NAME=books_sqz_prod
DB_USER=books_app_user
DB_PASS=secure_password_here
DB_HOST=localhost
DB_PORT=3306

# Application
NODE_ENV=production
PORT=8080
SESSION_SECRET=your_super_secure_session_secret_here

# Security
CORS_ORIGIN=https://your-domain.com
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Monitoring
LOG_LEVEL=info
ENABLE_METRICS=true
```

## Health Check Endpoints

The application includes built-in health check endpoints:

- `GET /health` - Basic application health
- `GET /api/stats` - Database connectivity check

## Monitoring Setup

### Application Metrics
- Response time tracking
- Error rate monitoring
- Database connection pooling metrics
- Memory and CPU usage

### Recommended Tools
- **Application Monitoring**: New Relic, DataDog, or Prometheus
- **Error Tracking**: Sentry or Rollbar
- **Log Management**: ELK Stack or Splunk
- **Uptime Monitoring**: UptimeRobot or Pingdom

## Backup Strategy

### Database Backups
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -h localhost -u backup_user -p books_sqz_prod > "/backups/books_sqz_${DATE}.sql"

# Keep only last 30 days
find /backups -name "books_sqz_*.sql" -mtime +30 -delete
```

### Application Backups
- Code repository (Git)
- Environment configuration
- SSL certificates
- Static assets

## Scaling Considerations

### Horizontal Scaling
- Load balancer configuration
- Session store (Redis)
- Database read replicas
- CDN for static assets

### Vertical Scaling
- CPU and memory optimization
- Database performance tuning
- Connection pool sizing
- Cache configuration

## Troubleshooting

### Common Issues
1. **Database Connection Errors**
   - Check database credentials
   - Verify network connectivity
   - Review connection pool settings

2. **Performance Issues**
   - Monitor query performance
   - Check memory usage
   - Review error logs

3. **Security Issues**
   - Verify SSL configuration
   - Check security headers
   - Review access logs

### Log Locations
- Application logs: `/var/log/books-sqz/`
- Access logs: `/var/log/nginx/access.log`
- Error logs: `/var/log/nginx/error.log`

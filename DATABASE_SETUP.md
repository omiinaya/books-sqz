# Database Setup Instructions

## MySQL Setup for Windows

### Option 1: Install MySQL Server
1. Download MySQL Community Server from https://dev.mysql.com/downloads/mysql/
2. Run the installer and follow the setup wizard
3. Set root password during installation
4. Start MySQL service

### Option 2: Use XAMPP (Recommended for Development)
1. Download XAMPP from https://www.apachefriends.org/
2. Install XAMPP
3. Open XAMPP Control Panel
4. Start MySQL service
5. Default credentials: user=`root`, password=`` (empty)

### Option 3: Use Docker (if you have Docker installed)
```bash
# Run MySQL in Docker
docker run --name books-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=sequelize_library -p 3306:3306 -d mysql:8.0

# Stop the container
docker stop books-mysql

# Start existing container
docker start books-mysql
```

## Database Configuration

1. Create the database:
```sql
CREATE DATABASE sequelize_library CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Create a dedicated user (optional but recommended):
```sql
CREATE USER 'books_user'@'localhost' IDENTIFIED BY 'books_password';
GRANT ALL PRIVILEGES ON sequelize_library.* TO 'books_user'@'localhost';
FLUSH PRIVILEGES;
```

## Environment Configuration

Create a `.env` file in the project root:

```bash
# Copy from .env.example
cp .env.example .env
```

Edit `.env` with your database credentials:
```bash
DB_NAME=sequelize_library
DB_USER=root
DB_PASS=root  # or your MySQL root password
DB_HOST=localhost
DB_PORT=3306
```

## Testing Database Connection

Run the connection test:
```bash
npm run test:db
```

## Troubleshooting

### Common Issues:

1. **MySQL service not running**
   - Windows: Check Services (services.msc) for MySQL service
   - XAMPP: Start MySQL in XAMPP Control Panel

2. **Connection refused (ECONNREFUSED)**
   - MySQL server is not running
   - Wrong host/port configuration
   - Firewall blocking connection

3. **Access denied**
   - Wrong username/password
   - User doesn't have privileges
   - Database doesn't exist

4. **Port already in use**
   - Another MySQL instance running
   - Change port in .env file

### Quick Fix Commands:

```bash
# Check if MySQL is running (Windows)
netstat -an | findstr :3306

# Test database connection
mysql -u root -p -h localhost

# Show databases
mysql -u root -p -e "SHOW DATABASES;"
```

@echo off
echo 📊 Books SQZ - Database Setup Helper
echo.

REM Check if MySQL is running
echo Checking if MySQL is running...
netstat -an | findstr :3306 >nul
if %errorlevel% == 0 (
    echo ✅ MySQL appears to be running on port 3306
) else (
    echo ❌ MySQL is not running on port 3306
    echo.
    echo 💡 Options to start MySQL:
    echo    1. If using XAMPP: Open XAMPP Control Panel and start MySQL
    echo    2. If using MySQL Service: Run 'net start mysql' as administrator
    echo    3. If using Docker: Run 'docker start books-mysql' ^(if container exists^)
    echo.
    echo See DATABASE_SETUP.md for detailed instructions
    pause
    exit /b 1
)

echo.
echo Testing database connection...
npm run test:db

echo.
echo 💡 If connection failed, check:
echo    1. MySQL credentials in .env file
echo    2. Database 'sequelize_library' exists
echo    3. User has proper permissions
echo.

echo To create the database, run this in MySQL:
echo CREATE DATABASE sequelize_library CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
echo.

pause

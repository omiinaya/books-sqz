/**
 * Database Connection Configuration
 * Modern Sequelize setup with environment variables and connection pooling
 */

const { Sequelize } = require('sequelize');

// Database configuration with environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME || 'sequelize_library',
  process.env.DB_USER || 'root', 
  process.env.DB_PASS || 'root',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    },
    dialectOptions: {
      charset: 'utf8mb4'
      // Note: collate option moved to database/table level as it's not supported in connection options
    }
  }
);

// Test connection with retry logic
async function testConnection(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log('✅ Database connection established successfully');
      return true;
    } catch (error) {
      console.error(`❌ Database connection attempt ${i + 1}/${retries} failed:`, error.message);
      
      if (i === retries - 1) {
        console.error('💡 Troubleshooting tips:');
        console.error('   1. Ensure MySQL server is running');
        console.error('   2. Check database credentials in .env file');
        console.error('   3. Verify database exists: CREATE DATABASE sequelize_library;');
        console.error('   4. See DATABASE_SETUP.md for detailed setup instructions');
        return false;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// Test connection on module load
testConnection();

module.exports = sequelize;

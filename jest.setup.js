/**
 * Jest Setup File
 * Global test configuration and mocks
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'test_db';
process.env.DB_USER = 'test_user';
process.env.DB_PASS = 'test_pass';

// Global test timeout
jest.setTimeout(10000);

// Mock console methods in tests
global.console = {
  ...console,
  // Uncomment to suppress logs during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  error: jest.fn()
};

// Mock Sequelize for database operations
jest.mock('sequelize', () => {
  const mSequelize = {
    authenticate: jest.fn(() => Promise.resolve()),
    sync: jest.fn(() => Promise.resolve()),
    define: jest.fn(() => ({
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      count: jest.fn(),
      sum: jest.fn()
    })),
    Op: {
      like: Symbol('like'),
      gt: Symbol('gt'),
      lte: Symbol('lte')
    },
    fn: jest.fn(),
    col: jest.fn(),
    DataTypes: {
      STRING: 'STRING',
      INTEGER: 'INTEGER'
    }
  };
  
  return {
    Sequelize: jest.fn(() => mSequelize),
    DataTypes: mSequelize.DataTypes,
    Op: mSequelize.Op
  };
});

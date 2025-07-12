/**
 * Book Model
 * Sequelize model with validation, indexes, and modern practices
 */

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection.js');

class Book extends Model {
  /**
   * Get formatted book information
   * @returns {string} Formatted book display string
   */
  getDisplayName() {
    return `${this.title} by ${this.author}`;
  }

  /**
   * Check if book is considered long (>300 pages)
   * @returns {boolean} True if book is long
   */
  isLongBook() {
    return this.pages > 300;
  }

  /**
   * Get reading time estimate (assuming 250 words per page, 200 WPM)
   * @returns {number} Estimated reading time in hours
   */
  getReadingTimeHours() {
    return Math.round((this.pages * 250) / (200 * 60) * 100) / 100;
  }
}

Book.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Title cannot be empty'
      },
      len: {
        args: [1, 255],
        msg: 'Title must be between 1 and 255 characters'
      }
    }
  },
  author: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Author cannot be empty'
      },
      len: {
        args: [1, 255],
        msg: 'Author must be between 1 and 255 characters'
      }
    }
  },
  genre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Genre cannot be empty'
      },
      isIn: {
        args: [['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Romance', 'Thriller', 'Biography', 'History', 'Other']],
        msg: 'Genre must be a valid category'
      }
    }
  },
  pages: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'Pages must be a whole number'
      },
      min: {
        args: [1],
        msg: 'Pages must be at least 1'
      },
      max: {
        args: [10000],
        msg: 'Pages cannot exceed 10,000'
      }
    }
  }
}, {
  sequelize,
  modelName: 'Book',
  tableName: 'books',
  indexes: [
    {
      fields: ['title']
    },
    {
      fields: ['author']
    },
    {
      fields: ['genre']
    },
    {
      fields: ['pages']
    }
  ]
});

module.exports = Book;
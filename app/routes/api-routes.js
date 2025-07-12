/**
 * API Routes - Modern RESTful API with validation and error handling
 * Follows ACID principles and best practices
 */

const Book = require('../models/book.js');
const { Op } = require('sequelize');

/**
 * Async error handler wrapper
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Validation middleware for book data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateBookData = (req, res, next) => {
  const { title, author, genre, pages } = req.body;
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  }
  if (!author || author.trim().length === 0) {
    errors.push('Author is required');
  }
  if (!genre || genre.trim().length === 0) {
    errors.push('Genre is required');
  }
  if (!pages || isNaN(pages) || pages < 1) {
    errors.push('Pages must be a positive number');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

module.exports = function(app) {

  // Get all books with pagination and sorting
  app.get('/api/all', asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100); // Max 100 items
    const offset = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await Book.findAndCountAll({
      limit,
      offset,
      order: [[sortBy, order]],
      attributes: ['id', 'title', 'author', 'genre', 'pages', 'createdAt', 'updatedAt']
    });

    res.json({
      books: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  }));

  // Get books by title search
  app.get('/api/search/:title', asyncHandler(async (req, res) => {
    const { title } = req.params;
    
    if (!title || title.trim().length < 2) {
      return res.status(400).json({
        error: 'Search term must be at least 2 characters long'
      });
    }

    const books = await Book.findAll({
      where: {
        title: {
          [Op.like]: `%${title}%`
        }
      },
      order: [['title', 'ASC']],
      limit: 50
    });

    res.json({
      books,
      searchTerm: title,
      count: books.length
    });
  }));

  // Get single book by ID
  app.get('/api/book/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid book ID'
      });
    }

    const book = await Book.findByPk(id);
    
    if (!book) {
      return res.status(404).json({
        error: 'Book not found'
      });
    }

    res.json(book);
  }));

  // Get books by genre
  app.get('/api/genre/:genre', asyncHandler(async (req, res) => {
    const { genre } = req.params;
    
    if (!genre) {
      return res.status(400).json({
        error: 'Genre parameter is required'
      });
    }

    const books = await Book.findAll({
      where: {
        genre: {
          [Op.like]: `%${genre}%`
        }
      },
      order: [['title', 'ASC']],
      limit: 100
    });

    res.json({
      books,
      genre,
      count: books.length
    });
  }));

  // Get books by author
  app.get('/api/author/:author', asyncHandler(async (req, res) => {
    const { author } = req.params;
    
    if (!author) {
      return res.status(400).json({
        error: 'Author parameter is required'
      });
    }

    const books = await Book.findAll({
      where: {
        author: {
          [Op.like]: `%${author}%`
        }
      },
      order: [['title', 'ASC']],
      limit: 100
    });

    res.json({
      books,
      author,
      count: books.length
    });
  }));

  // Get long books (more than 300 pages)
  app.get('/api/books/long', asyncHandler(async (req, res) => {
    const books = await Book.findAll({
      where: {
        pages: {
          [Op.gt]: 300
        }
      },
      order: [['pages', 'DESC']],
      limit: 100
    });

    res.json({
      books,
      filter: 'long',
      count: books.length,
      criteria: 'More than 300 pages'
    });
  }));

  // Get short books (150 pages or less)
  app.get('/api/books/short', asyncHandler(async (req, res) => {
    const books = await Book.findAll({
      where: {
        pages: {
          [Op.lte]: 150
        }
      },
      order: [['pages', 'ASC']],
      limit: 100
    });

    res.json({
      books,
      filter: 'short',
      count: books.length,
      criteria: '150 pages or less'
    });
  }));

  // Create a new book
  app.post('/api/books', validateBookData, asyncHandler(async (req, res) => {
    const { title, author, genre, pages } = req.body;

    // Check for duplicate books
    const existingBook = await Book.findOne({
      where: {
        title: title.trim(),
        author: author.trim()
      }
    });

    if (existingBook) {
      return res.status(409).json({
        error: 'A book with this title and author already exists',
        existingBook: {
          id: existingBook.id,
          title: existingBook.title,
          author: existingBook.author
        }
      });
    }

    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      pages: parseInt(pages)
    });

    res.status(201).json({
      message: 'Book created successfully',
      book
    });
  }));

  // Update a book
  app.put('/api/books/:id', validateBookData, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, author, genre, pages } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid book ID'
      });
    }

    const book = await Book.findByPk(id);
    
    if (!book) {
      return res.status(404).json({
        error: 'Book not found'
      });
    }

    await book.update({
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      pages: parseInt(pages)
    });

    res.json({
      message: 'Book updated successfully',
      book
    });
  }));

  // Delete a book
  app.delete('/api/books/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid book ID'
      });
    }

    const book = await Book.findByPk(id);
    
    if (!book) {
      return res.status(404).json({
        error: 'Book not found'
      });
    }

    await book.destroy();

    res.json({
      message: 'Book deleted successfully',
      deletedBook: {
        id: book.id,
        title: book.title,
        author: book.author
      }
    });
  }));

  // Get database statistics
  app.get('/api/stats', asyncHandler(async (req, res) => {
    const [totalBooks, totalPages, avgPages, genres] = await Promise.all([
      Book.count(),
      Book.sum('pages'),
      Book.findAll({
        attributes: [[Book.sequelize.fn('AVG', Book.sequelize.col('pages')), 'avgPages']]
      }),
      Book.findAll({
        attributes: ['genre', [Book.sequelize.fn('COUNT', '*'), 'count']],
        group: ['genre'],
        order: [[Book.sequelize.fn('COUNT', '*'), 'DESC']]
      })
    ]);

    res.json({
      totalBooks,
      totalPages: totalPages || 0,
      averagePages: Math.round(avgPages[0]?.dataValues?.avgPages || 0),
      genreDistribution: genres.map(g => ({
        genre: g.genre,
        count: parseInt(g.dataValues.count)
      }))
    });
  }));

};

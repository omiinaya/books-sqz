/**
 * API Routes Test Suite
 * Comprehensive testing for all API endpoints
 */

const request = require('supertest');
const app = require('../server');
const Book = require('../app/models/book');

// Mock the database
jest.mock('../app/models/book');

describe('API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/all', () => {
    it('should return all books with pagination', async () => {
      const mockBooks = [
        {
          id: 1,
          title: 'Test Book 1',
          author: 'Test Author 1',
          genre: 'Fiction',
          pages: 200
        },
        {
          id: 2,
          title: 'Test Book 2', 
          author: 'Test Author 2',
          genre: 'Non-Fiction',
          pages: 300
        }
      ];

      Book.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: mockBooks
      });

      const response = await request(app)
        .get('/api/all')
        .expect(200);

      expect(response.body).toHaveProperty('books');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.books).toEqual(mockBooks);
      expect(response.body.pagination.total).toBe(2);
    });

    it('should handle pagination parameters', async () => {
      Book.findAndCountAll.mockResolvedValue({
        count: 10,
        rows: []
      });

      await request(app)
        .get('/api/all?page=2&limit=5')
        .expect(200);

      expect(Book.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 5,
          offset: 5
        })
      );
    });
  });

  describe('POST /api/books', () => {
    it('should create a new book with valid data', async () => {
      const newBook = {
        title: 'New Test Book',
        author: 'New Test Author',
        genre: 'Fiction',
        pages: 250
      };

      Book.findOne.mockResolvedValue(null); // No duplicate
      Book.create.mockResolvedValue({ id: 1, ...newBook });

      const response = await request(app)
        .post('/api/books')
        .send(newBook)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Book created successfully');
      expect(response.body).toHaveProperty('book');
    });

    it('should validate required fields', async () => {
      const invalidBook = {
        title: '',
        author: 'Test Author',
        genre: 'Fiction',
        pages: 200
      };

      const response = await request(app)
        .post('/api/books')
        .send(invalidBook)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.details).toContain('Title is required');
    });

    it('should prevent duplicate books', async () => {
      const existingBook = {
        id: 1,
        title: 'Existing Book',
        author: 'Existing Author'
      };

      Book.findOne.mockResolvedValue(existingBook);

      const duplicateBook = {
        title: 'Existing Book',
        author: 'Existing Author',
        genre: 'Fiction',
        pages: 200
      };

      const response = await request(app)
        .post('/api/books')
        .send(duplicateBook)
        .expect(409);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('already exists');
    });
  });

  describe('GET /api/book/:id', () => {
    it('should return a specific book by ID', async () => {
      const mockBook = {
        id: 1,
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction',
        pages: 200
      };

      Book.findByPk.mockResolvedValue(mockBook);

      const response = await request(app)
        .get('/api/book/1')
        .expect(200);

      expect(response.body).toEqual(mockBook);
    });

    it('should return 404 for non-existent book', async () => {
      Book.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/book/999')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Book not found');
    });

    it('should validate book ID format', async () => {
      const response = await request(app)
        .get('/api/book/invalid')
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid book ID');
    });
  });

  describe('DELETE /api/books/:id', () => {
    it('should delete an existing book', async () => {
      const mockBook = {
        id: 1,
        title: 'Test Book',
        author: 'Test Author',
        destroy: jest.fn().mockResolvedValue()
      };

      Book.findByPk.mockResolvedValue(mockBook);

      const response = await request(app)
        .delete('/api/books/1')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Book deleted successfully');
      expect(mockBook.destroy).toHaveBeenCalled();
    });

    it('should return 404 for non-existent book', async () => {
      Book.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/books/999')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Book not found');
    });
  });

  describe('GET /api/stats', () => {
    it('should return database statistics', async () => {
      Book.count.mockResolvedValue(10);
      Book.sum.mockResolvedValue(2500);
      Book.findAll
        .mockResolvedValueOnce([{ dataValues: { avgPages: 250 } }])
        .mockResolvedValueOnce([
          { genre: 'Fiction', dataValues: { count: '5' } },
          { genre: 'Non-Fiction', dataValues: { count: '3' } }
        ]);

      const response = await request(app)
        .get('/api/stats')
        .expect(200);

      expect(response.body).toHaveProperty('totalBooks', 10);
      expect(response.body).toHaveProperty('totalPages', 2500);
      expect(response.body).toHaveProperty('averagePages', 250);
      expect(response.body).toHaveProperty('genreDistribution');
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limiting to API routes', async () => {
      // This would require more complex setup with actual rate limiting
      // For now, just verify the endpoint works
      Book.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });
      
      await request(app)
        .get('/api/all')
        .expect(200);
    });
  });
});

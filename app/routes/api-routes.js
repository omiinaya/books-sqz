// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================
var Books = require("../models/book.js");

// Routes
// =============================================================
module.exports = function (app) {

  // Add sequelize code to get all books and return them as JSON
  app.get("/api/all", function (req, res) {
    Books.findAll({}).then(function (result) {
      res.json(result);
    });
  });

  // Add sequelize code to get a specific book and return it as JSON
  app.get("/api/:book", function (req, res) {
    if (req.params.books) {
      Books.findAll({
        where: {
          title: req.params.books
        }
      }).then(function (result) {
        res.json(result);
      });
    }
  });

  // Add sequelize code to get all books of a specific genre and return them as JSON
  app.get("/api/genre/:genre", function (req, res) {

  });

  // Add sequelize code to get all books from a specific author and return them as JSON
  app.get("/api/author/:author", function (req, res) {

  });

  // Add sequelize code to get all "long" books (more than 150 pages) and return them as JSON
  app.get("/api/books/long", function (req, res) {
    Books.findAll({
      WHERE: {
        PAGES: {
          $gte: 150
        }
      },
      order: [["pages", "DESC"]]
    }).then(function (results) {
      res.json(results)
    });
  });

  // Add sequelize code to get all "short" books (150 pages or less) and return them as JSON
  app.get("/api/books/short", function (req, res) {
    Books.findAll({
      WHERE: {
        PAGES: {
          $lte: 150
        }
      },
      order: [["pages", "DESC"]]
    }).then(function (results) {
      res.json(results)
    });
  });

  // Add sequelize code to create a book
  app.post("/api/new", function (req, res) {
    var book = req.body;

    // Then add the character to the database using sequelize
    Books.create({
      title: book.title,
      author: book.author,
      genre: book.genre,
      pages: book.pages
    });
  });



  // Add sequelize code to delete a book
  app.delete("/api/book/:id", function (req, res) {

  });

};

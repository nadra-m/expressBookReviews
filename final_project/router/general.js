const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({message: "Please provide a Username or Password."});
  }

  if (isValid(username)) {
    const newUser = { username, password };
    users.push(newUser);
    return res.status(201).json({message: "New user has been created."})
  }
  return res.status(400).json({message: "This user already exists."})
});

// HELPER FUNCTIONS //


function getBooks(){ 
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books)
    }, 1000)
  })
}

function getBooksByIsbn(isbn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];

      if (book) {
        resolve(book);
      } else {
        reject("Book unavailable.")
      }
    }, 1000)
  })
}

function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(book =>
        book.author.toLowerCase().includes(author)
      );

      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject("No books found by this Author.");
      }
    }, 1000)
  })
}

function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(book =>
        book.title.toLowerCase().includes(title)
      );

      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject("No books found with this Title.");
      }
    }, 1000)
  })
}


// MAIN METHODS //


public_users.get('/',function (req, res) {
  getBooks().then((allBooks) => {
    res.status(200).send(allBooks)
  })
});

public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  getBooksByIsbn(isbn).then((book) => {
    return res.status(200).json(book);
  })
  .catch((error) => {
    return res.status(404).json({message: error});
  })
 });
  
public_users.get('/author/:author',function (req, res) {
 const author = req.params.author.toLowerCase();
 getBooksByAuthor(author).then((books) => {
  res.status(200).send(books)
 })
 .catch((error) => {
  res.status(404).json({message: error})
 })
});

public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();

  getBooksByTitle(title).then((book) => {
    res.status(200).json(book);
  })
  .catch((error) => {
    res.status(404).json({message: error});
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({message: "This book cannot be found."})
  }
});

module.exports.general = public_users;

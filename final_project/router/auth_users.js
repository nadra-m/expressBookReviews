const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  if (users.find(user => user.username === username)) {
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{
  if ((users.find(user => user.username === username)) && (users.find(user => user.password === password))) {
    return true;
  } else {
    return false;
  }
}

regd_users.post("/login", (req,res) => {
  let {username, password} = req.body;
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({data: password}, "access", {expiresIn: '1 hour.'});
    req.session.authorization {
      accessToken,
      username
    }
    return res.status(202).json({message: "You have successfully logged in!", accessToken});
  } else {
    return res.status(401).json({message: "These are not the correct credentials."});
  }

  // return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const bookReview = req.body.bookReview;
  const username = req.session.authorization?.username;
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({message: "This book cannot be found."})
  }

  if (!bookReview) {
    return res.status(400).json({message: "There are no reviews available. Would you like to add one?"})
  }

  books[isbn].reviews[username] = bookReview;
  return res.status(200).json({message: "Review has been successfully added!"})
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array6-register
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
 public_users.get('/',function (req, res) {
  //Write your code here
   res.send(JSON.stringify(books,null,4));
   return res.status(300).json({message: "Yet to be implemented"});
 });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    try {
        const requestedIsbn = req.params.isbn;
        const book = books[requestedIsbn];
        if (book) {
          res.json(book);
        } else {
          res.status(404).json({ message: "Book not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
      }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    try {
        const requestedAuthor = req.params.author;
        const matchingBooks = [];
    
        
        const bookKeys = Object.keys(books);
    
        
        for (const key of bookKeys) {
          const book = books[key];
          if (book.author === requestedAuthor) {
            matchingBooks.push(book);
          }
        }
    
        if (matchingBooks.length > 0) {
          res.json(matchingBooks);
        } else {
          res.status(404).json({ message: "No books found by that author" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving books" });
      }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  try {
    const requestedTitle = req.params.title;
    const matchingBooks = [];

    
    const bookKeys = Object.keys(books);

    
    for (const key of bookKeys) {
      const book = books[key];
      if (book.title.toLowerCase() === requestedTitle.toLowerCase()) { 
        matchingBooks.push(book);
      }
    }

    if (matchingBooks.length > 0) {
      res.json(matchingBooks);
    } else {
      res.status(404).json({ message: "No books found with that title" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving books" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  try {
    const requestedIsbn = req.params.isbn;
    const book = books[requestedIsbn];

    if (book) {
      const reviews = book.reviews;
      res.json(reviews);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving reviews" });
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;

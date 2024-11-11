const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  try {
    const bookList = books; 
    res.json(bookList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book list" });
  }
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
});

// Function to fetch book list using Promise callbacks
function getBookListWithPromise(url) {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
}

// Function to fetch book list using async-await
async function getBookListAsync(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}


public_users.get('/promise', function (req, res) {
  try {
    getBookListWithPromise(url) 
      .then(bookList => {
        res.json(bookList);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book list" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
});

public_users.get('/async', async function (req, res) {
  try {
    const bookList = await getBookListAsync(url); //
    res.json(bookList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book list" });
  }
});

public_users.get('/promise/isbn/:isbn', function (req, res) {
  try {
    const requestedIsbn = req.params.isbn;
    getBookListWithPromise("url" + requestedIsbn) 
      .then(book => {
        res.json(book);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
});

public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const requestedIsbn = req.params.isbn;
    const book = await getBookListAsync("url" + requestedIsbn);
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});

public_users.get('/promise/author/:author', function (req, res) {
  try {
    const requestedAuthor = req.params.author;
    getBookListWithPromise("url" + requestedAuthor) 
      .then(book => {
        res.json(book);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
});


public_users.get('/async/author/:author', async function (req, res) {
  try {
    const requestedAuthor = req.params.author;
    const book = await getBookListAsync("url" + requestedAuthor);
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});


public_users.get('/promise/title/:title', function (req, res) {
  try {
    const requestedTitle = req.params.title;
    getBookListWithPromise("url" + requestedTitle) 
      .then(book => {
        res.json(book);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
});


public_users.get('/async/title/:title', async function (req, res) {
  try {
    const requestedTitle = req.params.title;
    const book = await getBookListAsync("url" + requestedTitle);
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});

module.exports = {
  general: public_users,
  getBookListWithPromise,
  getBookListAsync
};
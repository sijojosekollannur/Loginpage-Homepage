const path = require("path")
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const port = 8080;

// Session configuration
app.use(session({
  secret: 'random-long-secret-key-for-session', 
  resave: false,
  saveUninitialized: true
}));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Dummy user data (replace with database)
const users = [
  { username: 'sijo jose k', password: '$2b$10$28FtKxZ4xGDqrkgwi31RMuImwqKw9KKc8dyncPtWT/F4d9V7Z2nJS' } ,
  {username: 'sijo',password:'$2b$10$28FtKxZ4xGDqrkgwi31RMuImwqKw9KKc8dyncPtWT/F4d9V7Z2nJS'},
  {username:'user',password:'$2b$10$28FtKxZ4xGDqrkgwi31RMuImwqKw9KKc8dyncPtWT/F4d9V7Z2nJS'},
  {username:'sijo jose kollannur',password:'$2b$10$mm7x15kljvgMfZ5bONy6COVIZr5YxIcrKo/9Ewxt7J2onOSDLckKq'}
];

// Root route
app.get('/', (req, res) => {
  const username = req.session.username
  if (req.session && req.session.authenticated) {
    res.redirect('/home',{username:username,users:users});
  } else {
    res.render('login', { errorMessage: req.query.error });
  }
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.authenticated = true;
    req.session.username = username
    res.redirect('/home');
  } else {
    req.session.errorMessage = 'Incorrect Username or Password'
    res.render('login',{errorMessage:req.session.errorMessage});
  }
});

// Home route
app.get('/home', isAuthenticated, (req, res) => {
  const username = req.session.username
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies

  res.render('home',{username:username,users:users});
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
});


// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  } else {
    res.redirect(`/?error=You must be logged in to access the home page`);

  }
}

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

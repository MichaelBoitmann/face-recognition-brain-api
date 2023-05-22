// require('dotenv').config();

const express = require('express');
// Latest version of ExpressJS that comes with Body-Parser!
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { config } = require('dotenv');

const register = require('../controllers/register');
const signin = require('../controllers/signin');
const profile = require('../controllers/profile');
const image = require('../controllers/image');

// config();

// Connecting to Postgres database using PGAdmin4
const db = knex({
  // Connection to postgres database
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    // ssl: { rejectUnauthorized: true },
    host : process.env.DATABASE_HOST,
    port : 5432,
    user : process.env.DATABASE_USER,
    password : process.env.DATABASE_PW,
    database : process.env.DATABASE_DB
  }
});

// Local host connection
// const db = knex({
//   // Connection to postgres database
//   client: 'pg',
//   connection: {
//     host : 'localhost',
//     port : '5432',
//     user : 'postgres',
//     password : 'boitmann',
//     database : 'smart-face-detector'
//   }
// });

// Listing the database built from Postgres; e.g. "users" the table name
// db.select('*').from('users').then(mich => {
//   console.log(mich);
// });

const app = express();

// Old database setup before migrating to Postgres
// const database = {
//   users: [
//   {
//     id: '123',
//     name: 'Michael',
//     email: 'michael@gmail.com',
//     password: 'lenovo',
//     entries: 0,
//     joince: new Date() 
//   },
//   {
//     id: '124',
//     name: 'Joyce',
//     email: 'joyce@gmail.com',
//     password: 'red',
//     entries: 0,
//     joince: new Date() 
//   },
//   {
//     id: '125',
//     name: 'Angel',
//     email: 'angel@gmail.com',
//     password: 'rotorua',
//     entries: 0,
//     joined: new Date() 
//   }
//   ],
//   login: [
//     {
//       id: '987',
//       hash: '',
//       email: 'michael@gmail.com'
//     }
//   ]
// }

app.use(cors());
app.use(express.json());

// Root page
app.get('/', (req, res) => { res.send(db.users) })

// Sign in for registered user
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })
// app.post('/signin', signin.handleSignin(req, res, db, bcrypt))

// Register for new user
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

// User profile with number of image detection request
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

// Handle image processing
app.put('/image', (req, res) => { image.handleImage(req, res, db) })

// Api Call for image
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on post ${process.env.PORT}`);
})
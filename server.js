const express = require('express');
// Latest version of ExpressJS that comes with Body-Parser!
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// Connecting to Postgres database using PGAdmin4
const db = knex({
  // Connection to postgres database
  client: 'pg',
  connection: {
    host : 'postgres://sfd_db_user:XAcsLhdIg7Z6RgXFlIQTyalXQFTQlwyE@dpg-ch7miv02qv26p1dt7jlg-a/sfd_db',
    port : '5432',
    user : 'sfd_db_user',
    password : 'XAcsLhdIg7Z6RgXFlIQTyalXQFTQlwyE',
    database : 'sfd_db'
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
// app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })
app.post('/signin', signin.handleSignin(db, bcrypt))

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
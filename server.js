require('dotenv').config();

import express, { json } from 'express';
// Latest version of ExpressJS that comes with Body-Parser!
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import { config } from 'dotenv';

import { handleRegister } from './controllers/register';
import { handleSignin } from './controllers/signin';
import { handleProfileGet } from './controllers/profile';
import { handleImage, handleApiCall } from './controllers/image';

config();

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
app.use(json());

// Root page
app.get('/', (req, res) => { res.send(db.users) })

// Sign in for registered user
app.post('/signin', (req, res) => { handleSignin(req, res, db, bcrypt) })
// app.post('/signin', signin.handleSignin(req, res, db, bcrypt))

// Register for new user
app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) })

// User profile with number of image detection request
app.get('/profile/:id', (req, res) => { handleProfileGet(req, res, db) })

// Handle image processing
app.put('/image', (req, res) => { handleImage(req, res, db) })

// Api Call for image
app.post('/imageurl', (req, res) => { handleApiCall(req, res) })

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on post ${process.env.PORT}`);
})
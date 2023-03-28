const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');


const userDB = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : '5432',
      user : 'postgres',
      password : 'boitmann',
      database : 'smart-brain'
    }
});

// userDB.select('*').from('users').then(data => {
//     console.log(data);
// });

const app = express();

// const userDatabase = {
//     users: [
//         {
//             id: '134', 
//             name: 'Michael',
//             email: 'michael@gmail.com',
//             password: 'lenovo',
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id: '135',
//             name: 'Jocelyn',
//             email: 'joyce@gmail.com',
//             password: 'iphone13',
//             entries: 0,
//             joined: new Date()            
//         }
//     ],
//     login: [
//         {
//             id: '987',
//             hash: '',
//             email: 'michael@gmail.com'
//         }
//     ]
// }

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send(userDatabase.users);
    console.log(users);
})

app.post('/signin', (req, res) => {
    if(req.body.email === userDatabase.users[0].email &&
        req.body.password === userDatabase.users[0].password) {
        res.json('success');
    } else {
        res.status(400).json('error logging in');
    }
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    userDB('users')
    .returning('*')
    .insert({
        name: name,
        email: email,
        joined: new Date() 
    })
    .then(users => {
        res.json(users[0]);
    })
    .catch(err => res.status(400).json('unable to register...'))
})

app.get('/profile/:id', (req,res) => {
    const { id } = req.params;
    let found = false;
    userDB.select('*').from('users').then(user => {
        console.log(user);
    })

    if (!found) {
        res.status(400).json('not found');
    }
})

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.post('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    userDatabase.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        } 
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

app.listen(3001, () => {
    console.log('app.listen line is running on port 3001');
})

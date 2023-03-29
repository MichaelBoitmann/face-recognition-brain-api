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
  userDB.select('email', 'hash').from(login)
  .where({'email', '=', req.body.email})
  .then(data => {
    console.log(data)
  })
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    userDB.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                name: name,
                email: loginEmail,
                joined: new Date() 
            })
            .then(user => {
                res.json(user[0])
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register...'))
})

app.get('/profile/:id', (req,res) => {
    const { id } = req.params;
    userDB.select('*').from('users').where({id})
        .then(user => {
            if (user.length) {
                res.json(user[0])
            }else {
                res.status(400).json('not found')
            }
        })
        .catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    userDB('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0])
    })
    .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3001, () => {
    console.log('app.listen line is running on port 3001');
})

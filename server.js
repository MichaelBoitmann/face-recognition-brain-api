const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('this app.get line is working');
})

app.listen(3001, () => {
    console.log('app.listen line is running on port 3001');
})
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // uuidv4(); ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

const app = express();
const PORT = process.env.port || 3001;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));



// routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// get the currents notes by reading `db.json`
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.err(err);
        } else {
            res.json(JSON.parse(data))
        }
    });
});

app.post('/api/notes', (req, res) => {
    res.send("Posted, man")
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});



// Listener
app.listen(PORT, () => {
    console.log(`App listening on PORT http://localhost:${PORT}`)
});
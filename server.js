const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.port || 3001;

// middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

// routes
app.get('/notes', (req, res) => {
    res.send(req.url)
});

app.get('/api/notes', (req, res) => {
    res.send(req.url)
});

app.post('/api/notes', (req, res) => {
    res.send("Posted, man")
});

app.get('*', (req, res) => {
    res.send("Catch All")
});

// Listener
app.listen(PORT, () => {
    console.log(`App listening on PORT http://localhost:${PORT}`);
});
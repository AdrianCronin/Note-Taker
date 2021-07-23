const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.port || 3001;

// routes
app.get('/notes', (req, res) => {

});

app.get('/api/notes', (req, res) => {

});

app.post('/api/notes', (req, res) => {

});

app.get('*', (req, res) => {

});

// Listener
app.listen(PORT, () => {
    console.log(`App listening on PORT http://localhost:${PORT}`);
});
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

// return the current notes by reading `db.json`
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

    const { title, text } = req.body; // destructure note object into its properties

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4()
        };

        // read file then append new note
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.err(err);
            } else {
                const noteCollection = JSON.parse(data); // put db.json into array of objects
                noteCollection.push(newNote); // add new note object to the array

                // overwrite new collection into db.json
                fs.writeFile("./db/db.json", JSON.stringify(noteCollection, null, 4), (err) => {
                    if (err) throw err;
                    console.log('Saved db.json');
                });

                res.json(newNote); // return new note to client
            }
        });

    } else {
        res.error('Error adding Note');
    };

});


app.delete('/api/notes/:id', (req, res) => {
    console.log(`DELETE Path: ${req.url}`);

    if (req.params.id) {
        const noteId = req.params.id;

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.err(err);
            } else {
                const noteCollection = JSON.parse(data); // put db.json into array of objects

                for (let i = 0; i < noteCollection.length; i++) {
                    if (noteCollection[i].id === noteId) {
                        noteCollection.splice([i], 1);
                        break; // stop iterating because each id is unique
                    };
                };

                // overwrite new collection into db.json
                fs.writeFile("./db/db.json", JSON.stringify(noteCollection, null, 4), (err) => {
                    if (err) throw err;
                    console.log('Saved db.json');
                });
            };
        });
        
        res.send(`Deleted`);
    } else {
        res.error('Error deleting note')
    };

});

// wildcard path
app.get('*', (req, res) => {

    res.sendFile(path.join(__dirname, '/public/index.html'))
});

// Listener
app.listen(PORT, () => {
    console.log(`App listening on PORT http://localhost:${PORT}`)
});
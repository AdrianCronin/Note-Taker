const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // uuidv4(); ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

const overwriteDBFile = (noteCollection) => {
    fs.writeFile("./db/db.json", JSON.stringify(noteCollection, null, 4), (err) => {
        if (err) throw err;
        console.log('Saved db.json');
    });
};

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
        // creates a new note object with a unique ID and the user input
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
                const noteCollection = JSON.parse(data); // save db.json data into an array

                noteCollection.push(newNote); // add new note object to the array 
                overwriteDBFile(noteCollection); // save the new data to db.json
                res.json(newNote); // return new note to client
            }
        });

    } else {
        res.error('Error adding Note');
    };

});

app.delete('/api/notes/:id', (req, res) => {

    if (req.params.id) {
        const noteId = req.params.id;

        // read file then delete note with matching id
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.err(err);
            } else {
                const noteCollection = JSON.parse(data); // save db.json data into an array

                for (let i = 0; i < noteCollection.length; i++) {
                    if (noteCollection[i].id === noteId) {
                        noteCollection.splice([i], 1);
                        break; // stop iterating once a unique id is found
                    };
                };

                overwriteDBFile(noteCollection); // save the new data to db.json
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
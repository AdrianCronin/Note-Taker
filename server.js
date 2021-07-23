const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.port || 3001;

app.listen(PORT, () => {
    console.log(`App listening on PORT http://localhost:${PORT}`);
});
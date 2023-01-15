const bodyParser = require('body-parser');
const express = require('express');
const app = express();
PORT = 3000;

let envelopes = [];

app.envelopes = envelopes;

app.use('/envelopes', bodyParser.json({ type: 'application/json' }));

app.listen(PORT, () => 
    console.log(`App listening on localhost:${PORT}/`));


module.exports = app;
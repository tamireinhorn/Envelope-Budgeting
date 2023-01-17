const bodyParser = require('body-parser');
const express = require('express');
const app = express();
PORT = 3000;

let envelopes = [];

app.envelopes = envelopes;

app.use('/envelopes', bodyParser.json({ type: 'application/json' }));

app.listen(PORT, () => 
    console.log(`App listening on localhost:${PORT}/`));


// GET all envelopes:

app.get('/envelopes', (req, res, next) => {
    res.send(envelopes);
});

// GET specific envelope:
app.get('/envelopes/:envelopeTitle', (req, res, next) => {
    // Find envelope: 
    const envelope = app.envelopes.find(envelope => envelope.title === req.params.envelopeTitle);
    if (envelope){
        res.send(envelope);
    }
    else{
        res.sendStatus(404);   
    }
});


module.exports = app;
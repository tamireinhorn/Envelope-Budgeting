const bodyParser = require('body-parser');
const express = require('express');
const app = express();
PORT = 3000;

let envelopes = [];

const validateEnvelopes = (req, res, next) => {
    // A valid envelope has to have title, and a positive budget
    envelope = req.body;
    if (typeof envelope.title === 'string' && typeof envelope.budget === 'number' && envelope.budget > 0){
        next();
    }
    else{
        res.status(400).send('Invalid envelope. Envelope is a JSON with a unique title and numeric budget.');
    }
};

app.envelopes = envelopes;

app.param('envelopeTitle', (req, res, next, title) => {
    const envelope = app.envelopes.find(envelope => envelope.title.toLowerCase() === req.params.envelopeTitle.toLowerCase());
    if (envelope){
        req.envelope = envelope;
    }
    next();
})



app.use('/envelopes', bodyParser.json({ type: 'application/json' }));

app.listen(PORT, () => 
    console.log(`App listening on localhost:${PORT}/`));


// GET all envelopes:

app.get('/envelopes', (req, res, next) => {
    res.send(envelopes);
});

// GET specific envelope:
app.get('/envelopes/:envelopeTitle', (req, res, next) => {

    if (req.envelope){
        res.send(req.envelope);
    }
    else{
        res.sendStatus(404);   
    }
});

// POST new envelope:
app.post('/envelopes', validateEnvelopes, (req, res, next) => {
    // Verify if envelope already exists:
    const newEnvelopeTitle = req.body.title;
    if (app.envelopes.find(envelope => envelope.title.toLowerCase() === newEnvelopeTitle.toLowerCase())){
        res.status(409).send('An envelope with this title already exists!');
    }
    else {
        envelopes.push(req.envelope);
        res.sendStatus(201);
    }
    
});

// PUT envelope:
// app.put('/envelopes/:envelopeTitle', validateEnvelopes, (req, res, next) => {
//     // TODO: If envelope already exists, update code, else create, the rest is already handled?
// });


module.exports = app;
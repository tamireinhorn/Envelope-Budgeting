const bodyParser = require('body-parser');
const express = require('express');
const app = express();
PORT = 3000;

let envelopes = [];

app.use('/envelopes', bodyParser.json({ type: 'application/json' }));

app.param('envelopeTitle', (req, res, next, title) => {
    const envelope = envelopes.find((envelope) => {
        return envelope.title.toLowerCase() === title.toLowerCase()});
    if (envelope) {
        req.envelope = envelope;
        next()
    }
    else {
        res.status(404).send('Envelope not found!');
    }
});

const validateEnvelope = (req, res, next) => {
    const envelope = req.body;
    envelope.budget = Number(envelope.budget);
    envelope.id = `${envelopes.length + 1}`;
    const foundEnvelope = envelopes.find((prevEnvelope) => {return prevEnvelope.title == envelope.title});
    // Verify if envelope has all we need:
    if (!envelope.title || !envelope.budget || isNaN(envelope.budget)){
        res.status(400).send(`Invalid envelope. Envelopes should be a JSON with a unique title and a numeric budget.`);

    }
    // We also don't allow repeated envelopes.
    else if (foundEnvelope) {
        res.status(400).send(`Envelope already exists. Check it out: 
                                ${JSON.stringify(foundEnvelope)}`);
    }
    else {
        
        next();
    }
    
};


app.get('/envelopes', (req, res, next) => res.send(envelopes));

app.post('/envelopes', validateEnvelope, (req, res, next) => 
            {
            res.status(201).send('Envelope added!');
            envelopes.push(req.body)
            }
        );

app.get('/envelopes/:envelopeTitle', (req, res, next) => {
    res.send(req.envelope);
})

app.delete('/envelopes/:envelopeTitle', (req, res, next) => {  
    envelopes = envelopes.filter((envelope) => (envelope) !== req.envelope)
    res.status(204).send(); // You don't send messages with this status.
});

app.put('/envelopes/:envelopeId', (req, res, next) => {
    // Find envelope is done via param. With that, you should also send either:
    // A new budget or a spent value.
    
    
})

app.listen(PORT, () => 
    console.log(`App listening on localhost:${PORT}/`));

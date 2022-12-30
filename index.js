const bodyParser = require('body-parser');
const express = require('express');
const app = express();
PORT = 3000;

let envelopes = [];

app.envelopes = envelopes;

app.use('/envelopes', bodyParser.json({ type: 'application/json' }));

app.param('envelopeTitle', (req, res, next, title) => {
    const envelope = app.envelopes.find((envelope) => {
      return envelope.title.toLowerCase() === title.toLowerCase();
    });
    if (envelope) {
      req.envelope = envelope;
    }
    next();

    
  });

const validateEnvelope = (req, res, next) => {
    const envelope = req.body;
    envelope.budget = Number(envelope.budget);
    envelope.id = `${envelopes.length + 1}`;
    // Verify if envelope has all we need:
    if (!envelope.title || !envelope.budget || isNaN(envelope.budget)){
        res.status(400).send(`Invalid envelope. Envelopes should be a JSON with a unique title and a numeric budget.`);

    }
    else {
        
        next();
    }
    
};


app.get('/envelopes', (req, res, next) => res.send(envelopes));

app.get('/envelopes/:envelopeTitle', (req, res, next) => {
    if (req.envelope){
        res.send(req.envelope);
    }
    else {
        res.status(404).send('Envelope not found!');
      };
    
})

app.delete('/envelopes/:envelopeTitle', (req, res, next) => {   
    if (req.envelope)
        {
        envelopes = envelopes.filter((envelope) => (envelope) !== req.envelope)
        res.status(204).send(); // You don't send messages with this status.
        }
    else {
        res.status(404).send('Envelope not found!');
        }

});



app.put('/envelopes/:envelopeTitle', validateEnvelope, (req, res, next) => {
    // Find envelope is done via param. With that, you should also send either: 
    // A new budget or a spent value.
    const foundEnvelope = envelopes.find((prevEnvelope) => {return prevEnvelope.title == req.envelope.title});
    if (foundEnvelope) {
        envelopes[envelopes.indexOf(foundEnvelope)] = req.body;
        res.status(200).send('Envelope updated.')
    }
    else{
        envelopes.push(req.body);
        res.status(201).send('Envelope created!');
    }
})

app.listen(PORT, () => 
    console.log(`App listening on localhost:${PORT}/`));


module.exports = app;
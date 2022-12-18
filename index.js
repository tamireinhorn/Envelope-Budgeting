const bodyParser = require('body-parser');
const express = require('express');
const app = express();
PORT = 3000;

envelopes = [];

app.use('/envelopes', bodyParser.json({ type: 'application/json' }));

const validateEnvelope = (req, res, next) => {
    const envelope = req.body;
    envelope.budget = Number(envelope.budget);
    // Verify if envelope has all we need:
    if (!envelope.title || !envelope.budget || isNaN(envelope.budget)){
        res.status(400).send(`Invalid envelope. Envelopes should be a JSON with a title and a budget.`);

    }
    else {
        
        next();
    }
    
};

app.get('/', (req, res, next) => res.send('Hello world'));

app.get('/envelopes', (req, res, next) => res.send(envelopes));

app.post('/envelopes', validateEnvelope, (req, res, next) => 
            {
            res.status(201).send('Envelope added!');
            envelopes.push(req.body)
            }
        );


app.listen(PORT, () => 
    console.log(`App listening on localhost:${PORT}/`));

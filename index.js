express = require('express');
app = express();
PORT = 3000;

app.get('/', (req, res, next) => res.send('Hello world'));


app.listen(PORT, () => 
    console.log(`App listening on localhost:${PORT}/`));

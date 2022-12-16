express = require('express');
app = express();
PORT = 3000;

app.get('/', () => console.log('Hello world'));


app.listen(PORT, () => 
    console.log(`App listening on localhost:${PORT}/`));

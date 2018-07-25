require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const options = {
    useNewUrlParser:true
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use(express.static( path.resolve(__dirname, '../public')));

app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, options, (err, res) => {
    if(err) throw err;
    console.log('Conexión a la base de datos realizada');

});

app.listen(process.env.PORT, ()=> {
    console.log('Escuchando el puerto', process.env.PORT);
});
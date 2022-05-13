const express = require('express');
const cors  = require('cors');
const morgan  = require('morgan');

const app = express();
app.use(cors());
app.use(morgan());
// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Routes
app.use(require('./routes/index'));

app.listen(3000);
console.log('Server on port', 3000);
const express = require('express');
const cors = require('cors');
// const mongoose = require('mongoose'); TODO Add dependency when we start using mongoose
require('dotenv').config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;

// Cors Fix
app.use(cors());

app.get('/', (request, response) => {
  response.send('Make Crypto Great!');
});

// Listen on Port
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
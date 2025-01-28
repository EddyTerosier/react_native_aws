const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/api_react_native'

mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

app.use('/', routes);

app.listen(PORT, '0.0.0.0',() => {
    console.log(`Server is running on port ${PORT}`);
});



const express = require('express');
const dotenv = require('dotenv');
const  mongoose = require('mongoose');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Hello World!')
});

mongoose.connect(`mongodb+srv://phucvo140902:${process.env.MONGO_DB}@erodb.ri4bf8p.mongodb.net/?retryWrites=true&w=majority&appName=EroDB`)
.then(() => {
    console.log('Connected DB Success !!!')
})
.catch((err) => {
    console.log('Connected DB Failed !!!')
    console.log(err)
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
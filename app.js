const mongoose = require('mongoose')
const express = require ('express');
const createPost = require('./routes/createPost');
const port = 3000

// instance d'express
const app = express()

// middleware 
app.use(express.json());

//requête get pour hello world
app.get('/', (req, res) => {
    res.send('Hello World!')
  })

// connexion  
mongoose.connect('mongodb://127.0.0.1:27017/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
.then(() => {
    console.log("Connected to the database");
    // Lancer le serveur Express
    app.listen(port, () => {
        console.log(`listening on port http://localhost:${port}/`);
    });
})
.catch( error => console.log(error))

// routes
app.use('/api/post', createPost)


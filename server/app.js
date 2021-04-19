const fs = require('fs');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');


const itemsRoutes = require('./routes/routes');
const HttpError = require('./models/httpError');
const userController=require('././users/usersController')

const app = express();


app.use(express.json({limit: '20mb'}));

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/items', itemsRoutes);

app.use('/users',userController );
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
  .connect(
    `mongodb+srv://hend:hend@auctioncluster.v7esi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    ,{useNewUrlParser: true,useUnifiedTopology: true} )
  .then(() => {
    app.listen(5000);
    console.log(" server started")
  })
  .catch(err => {
    console.log(err);
  });

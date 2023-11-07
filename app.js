const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRoute = require('./routes/tourRoutes');
const userRoute = require('./routes/userRoutes');

app.use(express.json()); //middleware that allow content of response to be process in the req

//1 . Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(morgan('dev'));

//3. Routes
//Best Practice to Declare route
app.use('/api/v1/tours', tourRoute); //when it reach this route it will execute the middleware
app.use('/api/v1/users', userRoute);

module.exports = app;


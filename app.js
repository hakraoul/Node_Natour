const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json()); //middleware that allow content of response to be process in the req
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//Route Functions
const getAllTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1; //this will turn id from string to number

  if (id > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Tour not found.',
    });
  }

  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body); //merge two object together

  tours.push(newTour);

  //Post method here is an event loop so don't use Syncronus
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'created',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  const id = req.params.id * 1; //this will turn id from string to number
  if (id > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Tour not found.',
    });
  }
  res.status(200).json({
    status: 'Success',
    message: 'Tour update',
  });

  //update new tour
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({
  //       status: 'Success',
  //       message: 'Tour update',
  //       data: {
  //         tour: newTour,
  //       },
  //     });
  //   }
  // );
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1; //this will turn id from string to number
  if (id > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Tour not found.',
    });
  }
  res.status(200).json({
    status: 'Success',
    message: 'Tour Deleted',
  });
};

//get all tour
// app.get('/api/v1/tours', getAllTour);
//create new tour
// app.post('/api/v1/tours', createTour);
//get 1 tour
// app.get('/api/v1/tours/:id', getTour);
//Update Method
//Put update the whole object
//Patch update only the property that should be updated
// app.patch('/api/v1/tours/:id', updateTour);
//Delete Method
// app.delete('/api/v1/tours/:id', deleteTour);

//Best Practice to Declare route
app.route('/api/v1/tours').get(getAllTour).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

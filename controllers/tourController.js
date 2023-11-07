const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1; //this will turn id from string to number

  if (id > tours.length) {
    return res.status(404).json({
      status: 'failed',
      requestAt: req.requestTime,
      message: 'Tour not found.',
    });
  }

  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    data: {
      tour: tour,
    },
  });
};

exports.createTour = (req, res) => {
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

exports.updateTour = (req, res) => {
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

exports.deleteTour = (req, res) => {
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

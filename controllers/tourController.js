// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
// exports.checkID = (req, res, next, val) => {
//   const id = req.params.id * 1; //this will turn id from string to number
//   if (id > tours.length) {
//     return res.status(404).json({
//       status: 'failed',
//       message: 'Tour not found.',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(404).json({
//       status: 'Error',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };

exports.getAllTour = async (req, res) => {
  try {
    // const tours = await Tour.find({
    //   duration: req.query.duration,
    //   difficulty: req.query.difficulty,
    // });

    // const tours = await Tour.find()
    //   .where('duration')
    //   .gte(5)
    //   .where('difficulty')
    //   .equals('easy');

    //EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filther()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query.exec();
    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    // const id = req.params.id * 1; //this will turn id from string to number
    // const tour = tours.find((el) => el.id === id);
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      requestAt: req.requestTime,
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'Success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      message: err.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'Success',
      tour,
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message,
    });
  }

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

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'Success',
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};

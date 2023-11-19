// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

const Tour = require('../models/tourModel');

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
    //BUILD QUERY

    //1. Filthering
    const queryObj = Object.assign(req.query); //copy the object
    const excludedFields = ['sort', 'page', 'limit'];
    excludedFields.forEach((el) => delete queryObj[el]); //will delete fields in excludedFields from queryObj

    //1.1.Advance filthering
    let queryStr = JSON.stringify(queryObj);
    //if match will replace the string with $+matched string. g in there mean it will replace all occurance.
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));
    // 2. Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // minus sign will sort it in DECENDING order.
    }

    //3. Limiting fields
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      // const fields = '-name -duration';
      query = query.select(fields); //TODO: this line don't work
    } else {
      query = query.select('-__v'); //minus here mean EXCLUDE the field
    }

    //4. Pagination
    console.log(req.query);
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    console.log(req.query.page);
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

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
    const tours = await query.exec();

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

//  not found requests
const notFound = (req, res, next) => {
  let error = new Error(`Not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// error handler

const errorhandler = (error, req, res, next) => {
  let statuscode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statuscode);
  res.json({
    message: error?.message,
    stack: error?.stack,
  });
};

module.exports = { notFound, errorhandler };

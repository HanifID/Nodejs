
const { logEvents } = require('./logEvents');
const errorHandler = function (err, req, res, next) {
    logEvents(`${err.name}: \t${err.message}`, 'errLog.txt')
    console.log(err.stack)
    res.status(500).send(err.message);
}

module.exports = errorHandler;
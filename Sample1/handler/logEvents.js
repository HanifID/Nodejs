const { format } = require('date-fns')
const { v4: uuid } = require('uuid')

const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message, logName) => {
    const datetime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logitem = ` ${datetime}\t${uuid()}\t${message}\n`;
    console.log(logitem)
    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logitem);
    } catch (err) {
        console.log(err);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.header.origin}\t${req.url}`, 'reqLog.txt')
    console.log(` ${req.method} ${req.path}`)
    next();
}

module.exports = { logger, logEvents };
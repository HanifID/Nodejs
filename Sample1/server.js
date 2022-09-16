const express = require('express');
const app = express();
const path = require('path');
const { logger } = require('./handler/logEvents');
const errorHandler = require('./handler/errorHandler');
const config = require("./config/config");
const { json } = require('express');
const session = require('express-session');
const flash = require('req-flash');
const passport = require('passport');
const PORT = process.env.PORT || 3500;

// custom midleware
app.use(logger);

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'secreet5',
    name: 'secretName',
    cookie: {
        sameSite: true,
        maxAge: 80000
    },
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


config.authenticate().then( () => 
    console.log("db connected")
);

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(express.static(path.join(__dirname, '/public')));

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/datatables.net-bs5/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/datatables.net-bs5/js')));

const verifyUser = require('./handler/verify');
const auth = require('./routes/auth');
const routes = require('./routes/route');
const api = require('./routes/api/api');
const adminRoute = require('./routes/admin/route');

app.use('/auth', auth);
app.use('/', verifyUser.isLogin, routes);
app.use('/admin', verifyUser.isLogin, adminRoute);
app.use('/api', verifyUser.isLogin, api);

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res, json({ error: "404 Not Found" })
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


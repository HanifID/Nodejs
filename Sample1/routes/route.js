const express = require('express');
const router = express();
const path = require('path');


router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get('/nav(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'fragments', 'nav.html'), { username: req.user.username } );
});


router.get('/car(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'car.html'));
});

router.get('/employee(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'employee.html'));
});

router.get('/boss(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'boss.html'));
});

router.get('/house(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'house.html'));
});

router.get('/login(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.get('/profile(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'profile.html'));
});




module.exports = router;
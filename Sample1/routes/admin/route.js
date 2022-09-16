const express = require('express');
const router = express();
const path = require('path');

router.get('/authorities(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'views','admin', 'authorities.html'));
});


module.exports = router;
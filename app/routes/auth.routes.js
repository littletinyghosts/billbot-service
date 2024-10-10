const verifyToken = require('../middleware/authMiddleware.js');

module.exports = app => {
    const auth = require('../controllers/auth.controller.js');

    var router = require('express').Router();

    // login
    router.post('/login', auth.login);

    // validate pin
    router.post('/validate-pin/:userId', verifyToken, auth.validatePin);

    // reset-password
    router.post('/reset-password', verifyToken, auth.resetPassword);

    // reset-pin
    router.post('/reset-pin', verifyToken, auth.resetPin);

    app.use('/api/auth', router);
};

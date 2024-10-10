const verifyToken = require('../middleware/authMiddleware.js');

module.exports = app => {
    const settings = require('../controllers/setting.controller.js');

    var router = require('express').Router();

    // Create or update user settings
    router.post('/', verifyToken, settings.createOrUpdate);

    // Retrieve user settings by userId
    router.get('/:userId', verifyToken, settings.findByUserId);

    // Delete user settings by userId
    router.delete('/:userId', verifyToken, settings.delete);

    app.use('/api/settings', router);
};

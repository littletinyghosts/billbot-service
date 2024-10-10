const verifyToken = require('../middleware/authMiddleware.js');

module.exports = app => {
    const reminders = require('../controllers/reminder.controller.js');

    var router = require('express').Router();

    // Create a new reminder
    router.post('/', verifyToken, reminders.create);

    // Retrieve all reminders for a specific user
    router.get('/user/:userId', verifyToken, reminders.findAllByUser);

    // Retrieve a specific reminder for a specific user
    router.get('/:reminderId/user/:userId', verifyToken, reminders.findOneByUser);

    // Update a reminder for a specific user
    router.put('/:reminderId/user/:userId', verifyToken, reminders.updateByUser);

    // Delete a reminder for a specific user
    router.delete('/:reminderId/user/:userId', verifyToken, reminders.deleteByUser);

    app.use('/api/reminders', router);
};

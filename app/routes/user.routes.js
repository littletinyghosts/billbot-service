const verifyToken = require('../middleware/authMiddleware.js');

module.exports = app => {
    const users = require('../controllers/user.controller.js');

    var router = require('express').Router();

    // Create a new User
    router.post('/', users.create);

    // Retrieve all Users
    router.get('/', verifyToken, users.findAll);

    // Retrieve a single User by id
    router.get('/:id', verifyToken, users.findOne);

    // Update a User by id
    router.put('/:id', verifyToken, users.update);

    // Delete a User by id
    router.delete('/:id', verifyToken, users.delete);

    app.use('/api/users', router);
};

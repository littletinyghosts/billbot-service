const verifyToken = require('../middleware/authMiddleware.js');

module.exports = app => {
    const paymentMethods = require('../controllers/paymentmethod.controller.js');

    var router = require('express').Router();

    // Create a new Payment Method
    router.post('/', verifyToken, paymentMethods.create);

    // Retrieve all Payment Methods
    router.get('/', verifyToken, paymentMethods.findAllForUser);

    // Retrieve a single Payment Method by id
    router.get('/:id', verifyToken, paymentMethods.findOne);

    // Update a Payment Method by id
    router.put('/:id', verifyToken, paymentMethods.update);

    // Delete a Payment Method by id
    router.delete('/:id', verifyToken, paymentMethods.delete);

    app.use('/api/payment-methods', router);
};

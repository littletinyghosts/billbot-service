const verifyToken = require('../middleware/authMiddleware.js');

module.exports = app => {
    const payments = require('../controllers/payment.controller.js');

    var router = require('express').Router();

    // Create a new Payment
    router.post('/', verifyToken, payments.create);

    // Retrieve all Payments
    router.get('/', verifyToken, payments.findAll);

    // Retrieve a single Payment by id
    router.get('/:id', verifyToken, payments.findOne);

    // Update a Payment by id
    router.put('/:id', verifyToken, payments.update);

    // Delete a Payment by id
    router.delete('/:id', verifyToken, payments.delete);

    app.use('/api/payments', router);
};

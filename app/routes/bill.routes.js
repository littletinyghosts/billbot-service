const verifyToken = require('../middleware/authMiddleware.js');

module.exports = app => {
    const bills = require('../controllers/bill.controller.js');

    var router = require('express').Router();

    // Create a new Bill
    router.post('/', verifyToken, bills.create);

    // Retrieve all Bills for a specific user
    router.get('/user/:userId', verifyToken, bills.findAllForUser);

    // Retrieve a single Bill by id and userId
    router.get('/:id/user/:userId', verifyToken, bills.findOne);

    // Update a Bill by id and userId
    router.put('/:id/user/:userId', verifyToken, bills.update);

    // Delete a Bill by id and userId
    router.delete('/:id/user/:userId', verifyToken, bills.delete);

    // Use the '/api/bills' route for all bill-related operations
    app.use('/api/bills', router);
};

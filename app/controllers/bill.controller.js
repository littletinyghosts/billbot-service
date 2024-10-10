const db = require('../models');
const Bill = db.bills;

// Create a new bill
exports.create = async (req, res) => {
    try {
        const { billName, amount, dueDate, userId, paymentMethodId, recurring, recurringInterval, nextBillingDate, description } =
            req.body;

        // Validate required fields
        if (!billName || !amount || !dueDate || !userId || !paymentMethodId) {
            return res.status(400).send({
                message: 'Bill name, amount, due date, userId, and paymentMethodId are required!',
            });
        }

        // Create a new bill object
        const bill = {
            billName,
            amount,
            dueDate,
            userId,
            paymentMethodId,
            recurring: recurring || false,
            recurringInterval: recurring ? recurringInterval : null, // Only set interval if recurring is true
            nextBillingDate: recurring ? nextBillingDate : null, // Only set nextBillingDate if recurring is true
            description,
        };

        // Save the bill to the database
        const data = await Bill.create(bill);
        return res.send(data);
    } catch (err) {
        return res.status(500).send({
            message: err.message || 'Some error occurred while creating the bill.',
        });
    }
};

// Retrieve all bills for a specific user
exports.findAllForUser = async (req, res) => {
    const { userId } = req.params;

    console.log('hello!!');

    try {
        const bills = await Bill.findAll({ where: { userId } });
        return res.send(bills);
    } catch (err) {
        return res.status(500).send({
            message: err.message || `Some error occurred while retrieving bills for userId=${userId}.`,
        });
    }
};

// Retrieve a bill by id and userId
exports.findOne = async (req, res) => {
    const { id, userId } = req.params;

    try {
        const bill = await Bill.findOne({ where: { id, userId } });

        if (bill) return res.send(bill);
        return res.status(404).send({ message: `Bill with id=${id} not found for userId=${userId}.` });
    } catch (err) {
        return res.status(500).send({
            message: err.message || `Error retrieving bill with id=${id} for userId=${userId}.`,
        });
    }
};

// Update a bill by id and userId
exports.update = async (req, res) => {
    const { id, userId } = req.params;
    const { billName, amount, dueDate, paymentMethodId, recurring, recurringInterval, nextBillingDate, description } = req.body;

    try {
        const updateData = {
            billName,
            amount,
            dueDate,
            paymentMethodId,
            recurring: recurring || false,
            recurringInterval: recurring ? recurringInterval : null,
            nextBillingDate: recurring ? nextBillingDate : null,
            description,
        };

        const [num] = await Bill.update(updateData, { where: { id, userId } });

        if (num === 1) return res.send({ message: 'Bill was updated successfully.' });
        return res.status(400).send({ message: `Cannot update bill with id=${id} for userId=${userId}.` });
    } catch (err) {
        return res.status(500).send({
            message: err.message || `Error updating bill with id=${id} for userId=${userId}.`,
        });
    }
};

// Delete a bill by id and userId
exports.delete = async (req, res) => {
    const { id, userId } = req.params;

    try {
        const num = await Bill.destroy({ where: { id, userId } });

        if (num === 1) return res.send({ message: 'Bill was deleted successfully.' });
        return res.status(400).send({ message: `Cannot delete bill with id=${id} for userId=${userId}.` });
    } catch (err) {
        return res.status(500).send({
            message: err.message || `Error deleting bill with id=${id} for userId=${userId}.`,
        });
    }
};

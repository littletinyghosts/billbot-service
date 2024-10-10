const db = require('../models');
const PaymentMethod = db.paymentMethods;

// Create a new payment method
exports.create = async (req, res) => {
    const { userId, methodName, accountNumber } = req.body;

    // Validate request
    if (!userId || !methodName || !accountNumber) {
        return res.status(400).send({
            message: 'User ID, method name, and account number are required!',
        });
    }

    try {
        // Check for existing payment method
        const existingPaymentMethod = await PaymentMethod.findOne({
            where: {
                userId: userId,
                methodName: methodName,
                accountNumber: accountNumber,
            },
        });

        if (existingPaymentMethod) {
            return res.status(400).send({
                message: 'A payment method with this name and account number already exists for this user.',
            });
        }

        // Create new payment method
        const paymentMethod = {
            userId: userId,
            methodName: methodName,
            accountNumber: accountNumber,
            expirationDate: req.body.expirationDate,
            isDefault: req.body.isDefault || false,
        };

        const newPaymentMethod = await PaymentMethod.create(paymentMethod);
        res.send(newPaymentMethod);
    } catch (err) {
        res.status(500).send({
            message: err.message || 'Some error occurred while creating the payment method.',
        });
    }
};

// Retrieve all payment methods for a specific user
exports.findAllForUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const paymentMethods = await PaymentMethod.findAll({ where: { userId } });
        return res.send(paymentMethods);
    } catch (err) {
        return res.status(500).send({
            message: err.message || `Some error occurred while retrieving payment methods for userId=${userId}.`,
        });
    }
};

// Retrieve a payment method by id and userId
exports.findOne = async (req, res) => {
    const { id, userId } = req.params;

    try {
        const paymentMethod = await PaymentMethod.findOne({ where: { id, userId } });

        if (paymentMethod) return res.send(paymentMethod);
        return res.status(404).send({ message: `Payment method with id=${id} not found for userId=${userId}.` });
    } catch (err) {
        return res.status(500).send({
            message: err.message || `Error retrieving payment methods with id=${id} for userId=${userId}.`,
        });
    }
};

// Update a payment method by id
exports.update = (req, res) => {
    const id = req.params.id;

    PaymentMethod.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) res.send({ message: 'Payment method was updated successfully.' });
            else res.send({ message: `Cannot update payment method with id=${id}.` });
        })
        .catch(err =>
            res.status(500).send({
                message: err.message || `Error updating payment method with id=${id}.`,
            })
        );
};

// Delete a payment method by id
exports.delete = (req, res) => {
    const id = req.params.id;

    PaymentMethod.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) res.send({ message: 'Payment method was deleted successfully.' });
            else res.send({ message: `Cannot delete payment method with id=${id}.` });
        })
        .catch(err =>
            res.status(500).send({
                message: err.message || `Error deleting payment method with id=${id}.`,
            })
        );
};

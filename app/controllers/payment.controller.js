const db = require("../models");
const Payment = db.payments;

// Create a new payment
exports.create = (req, res) => {
  if (!req.body.billId || !req.body.amountPaid || !req.body.paymentDate) {
    return res.status(400).send({
      message: "Bill ID, amount paid, and payment date are required!"
    });
  }

  const payment = {
    billId: req.body.billId,
    amountPaid: req.body.amountPaid,
    paymentDate: req.body.paymentDate,
    paymentStatus: req.body.paymentStatus || 'pending'
  };

  Payment.create(payment)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({
      message: err.message || "Some error occurred while creating the payment."
    }));
};

// Retrieve all payments
exports.findAll = (req, res) => {
  Payment.findAll()
    .then(data => res.send(data))
    .catch(err => res.status(500).send({
      message: err.message || "Some error occurred while retrieving payments."
    }));
};

// Retrieve a payment by id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Payment.findByPk(id)
    .then(data => {
      if (data) res.send(data);
      else res.status(404).send({ message: `Payment with id=${id} not found.` });
    })
    .catch(err => res.status(500).send({
      message: err.message || `Error retrieving payment with id=${id}.`
    }));
};

// Update a payment by id
exports.update = (req, res) => {
  const id = req.params.id;

  Payment.update(req.body, { where: { id: id } })
    .then(num => {
      if (num == 1) res.send({ message: "Payment was updated successfully." });
      else res.send({ message: `Cannot update payment with id=${id}.` });
    })
    .catch(err => res.status(500).send({
      message: err.message || `Error updating payment with id=${id}.`
    }));
};

// Delete a payment by id
exports.delete = (req, res) => {
  const id = req.params.id;

  Payment.destroy({ where: { id: id } })
    .then(num => {
      if (num == 1) res.send({ message: "Payment was deleted successfully." });
      else res.send({ message: `Cannot delete payment with id=${id}.` });
    })
    .catch(err => res.status(500).send({
      message: err.message || `Error deleting payment with id=${id}.`
    }));
};

const db = require('../models');
const Reminder = db.reminders;
const Bill = db.bills;

// Create a new reminder
exports.create = (req, res) => {
    if (!req.body.billId || !req.body.reminderDate || !req.body.message) {
        return res.status(400).send({
            message: 'Bill ID, reminder date, and message are required!',
        });
    }

    const reminder = {
        billId: req.body.billId,
        reminderDate: req.body.reminderDate,
        nextReminderDate: req.body.nextReminderDate || null,
        recurring: req.body.recurring || false,
        recurringInterval: req.body.recurring ? req.body.recurringInterval : null,
        message: req.body.message,
        status: 'pending',
    };

    Reminder.create(reminder)
        .then(data => res.send(data))
        .catch(err =>
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the reminder.',
            })
        );
};

// Retrieve all reminders for a specific user
exports.findAllByUser = (req, res) => {
    const userId = req.params.userId;

    Reminder.findAll({
        include: [
            {
                model: Bill,
                where: { userId: userId },
            },
        ],
    })
        .then(data => res.send(data))
        .catch(err =>
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving reminders.',
            })
        );
};

// Retrieve a specific reminder by reminder ID and user ID
exports.findOneByUser = (req, res) => {
    const { userId, reminderId } = req.params;

    Reminder.findOne({
        where: { id: reminderId },
        include: [
            {
                model: Bill,
                where: { userId: userId },
            },
        ],
    })
        .then(data => {
            if (data) res.send(data);
            else res.status(404).send({ message: `Reminder with id=${reminderId} not found for this user.` });
        })
        .catch(err =>
            res.status(500).send({
                message: err.message || `Error retrieving reminder with id=${reminderId}.`,
            })
        );
};

// Update a reminder by ID for a specific user
exports.updateByUser = (req, res) => {
    const { userId, reminderId } = req.params;

    Reminder.findOne({
        where: { id: reminderId },
        include: [
            {
                model: Bill,
                where: { userId: userId },
            },
        ],
    })
        .then(reminder => {
            if (!reminder) {
                return res.status(404).send({ message: `Reminder with id=${reminderId} not found for this user.` });
            }

            return Reminder.update(req.body, { where: { id: reminderId } }).then(num => {
                if (num == 1) res.send({ message: 'Reminder was updated successfully.' });
                else res.send({ message: `Cannot update reminder with id=${reminderId}.` });
            });
        })
        .catch(err =>
            res.status(500).send({
                message: err.message || `Error updating reminder with id=${reminderId}.`,
            })
        );
};

// Delete a reminder by ID for a specific user
exports.deleteByUser = (req, res) => {
    const { userId, reminderId } = req.params;

    Reminder.findOne({
        where: { id: reminderId },
        include: [
            {
                model: Bill,
                where: { userId: userId },
            },
        ],
    })
        .then(reminder => {
            if (!reminder) {
                return res.status(404).send({ message: `Reminder with id=${reminderId} not found for this user.` });
            }

            return Reminder.destroy({ where: { id: reminderId } }).then(num => {
                if (num == 1) res.send({ message: 'Reminder was deleted successfully.' });
                else res.send({ message: `Cannot delete reminder with id=${reminderId}.` });
            });
        })
        .catch(err =>
            res.status(500).send({
                message: err.message || `Error deleting reminder with id=${reminderId}.`,
            })
        );
};

const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const db = require('../models');
const User = db.users;

// Create a new user
exports.create = async (req, res) => {
    const { fullName, username, email, phoneNumber, password, pin, dateOfBirth } = req.body;

    // Validate request
    if (!fullName || !username || !email || !phoneNumber || !password || !pin) {
        return res.status(400).send({
            message: 'Full Name, Username, Email, Phone Number, Password, and Pin are required!',
        });
    }

    try {
        // Check if email or phone number already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email: email }, { phoneNumber: phoneNumber }, { username: username }],
            },
        });

        if (existingUser) {
            return res.status(400).send({
                message: 'Email, Phone Number or Username already exists!',
            });
        }

        // Hash password and pin
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const hashedPin = await bcrypt.hash(pin, saltRounds);

        // Create user object
        const user = {
            fullName,
            username,
            email,
            phoneNumber,
            password: hashedPassword,
            pin: hashedPin,
            dateOfBirth: dateOfBirth || null,
        };

        // Save user in the database
        const data = await User.create(user);

        // Exclude password and pin from the returned data
        const responseUser = await User.findByPk(data.id, {
            attributes: { exclude: ['password', 'pin'] },
        });

        res.send(responseUser);
    } catch (err) {
        res.status(500).send({
            message: err.message || 'Some error occurred while creating the user.',
        });
    }
};

// Retrieve all users
exports.findAll = (req, res) => {
    User.findAll({
        attributes: { exclude: ['password', 'pin'] },
    })
        .then(data => res.send(data))
        .catch(err =>
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving users.',
            })
        );
};

// Retrieve a user by id
exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findByPk(id, { attributes: { exclude: ['password', 'pin'] } })
        .then(data => {
            if (data) res.send(data);
            else res.status(404).send({ message: `User with id=${id} not found.` });
        })
        .catch(err =>
            res.status(500).send({
                message: err.message || `Error retrieving user with id=${id}.`,
            })
        );
};

// Update a user by id
exports.update = async (req, res) => {
    const id = req.params.id;

    // Validate required fields
    if (!req.body.fullName || !req.body.username || !req.body.email || !req.body.phoneNumber) {
        return res.status(400).send({
            message: 'Full name, username, email, and phone number are required!',
        });
    }

    // Ensure email and phone number are unique
    try {
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).send({ message: `User with id=${id} not found.` });
        }

        // Prevent updating password and pin unless explicitly provided
        const updateData = { ...req.body, password: user.password, pin: user.pin };

        // Perform the update
        const num = await User.update(updateData, { where: { id } });
        if (num == 1) {
            res.send({ message: 'User was updated successfully.' });
        } else {
            res.send({ message: `Cannot update user with id=${id}.` });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || `Error updating user with id=${id}.`,
        });
    }
};

// Delete a user by id
exports.delete = (req, res) => {
    const id = req.params.id;

    // TODO: ask for the password before we delete
    User.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) res.send({ message: 'User was deleted successfully.' });
            else res.send({ message: `Cannot delete user with id=${id}.` });
        })
        .catch(err =>
            res.status(500).send({
                message: err.message || `Error deleting user with id=${id}.`,
            })
        );
};

const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models'); // Assuming your Sequelize models are set up
const User = db.users;

const jwtSecret = 'your_jwt_secret_key';

// Login Method
exports.login = async (req, res) => {
    const { emailOrPhone, password } = req.body;

    // Validate request
    if (!emailOrPhone || !password) {
        return res.status(400).send({ message: 'Email/Phone and password are required!' });
    }

    try {
        // Find user by either email or phoneNumber
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
            },
        });

        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid credentials!' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '24h' });

        res.send({
            id: user.id,
            email: user.email,
            username: user.username,
            token: token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message || 'Error logging in.' });
    }
};

exports.validatePin = async (req, res) => {
    const { pin } = req.body;
    const { userId } = req.params;

    // Validate request
    if (!pin) {
        return res.status(400).send({ message: 'PIN is required!' });
    }

    try {
        // Find user by either email or phoneNumber
        const user = await User.findOne({
            where: { userId },
        });

        if (!user) {
            return res.status(404).send({ message: 'Invalid credentials!' });
        }

        // Compare pin
        const isPinValid = await bcrypt.compare(pin, user.pin);
        if (!isPinValid) {
            return res.status(401).send({ message: 'Invalid credentials!' });
        }

        res.send({ message: 'PIN validated successfully!' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message || 'Error logging in.' });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { emailOrPhone, oldPassword, newPassword } = req.body;

    if (!emailOrPhone || !oldPassword || !newPassword) {
        return res.status(400).send({ message: 'Email/Phone, old password, and new password are required!' });
    }

    try {
        // Find user by either email or phoneNumber
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
            },
        });

        if (!user) {
            return res.status(404).send({ message: 'Bad credentials!' });
        }

        // Verify old password
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return res.status(401).send({ message: 'Bad credentials!' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await user.update({ password: hashedPassword });

        res.send({ message: 'Password reset successfully!' });
    } catch (err) {
        res.status(500).send({ message: err.message || 'Error resetting password.' });
    }
};

// Reset PIN
exports.resetPin = async (req, res) => {
    const { emailOrPhone, password, newPin } = req.body;

    if (!emailOrPhone || !password || !newPin) {
        return res.status(400).send({ message: 'Email, password, and new PIN are required!' });
    }

    try {
        // Find user by either email or phoneNumber
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
            },
        });

        if (!user) {
            return res.status(404).send({ message: 'Bad credentials!' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Bad credentials!' });
        }

        // Hash new PIN
        const salt = await bcrypt.genSalt(10);
        const hashedPin = await bcrypt.hash(newPin, salt);

        // Update PIN
        await user.update({ pin: hashedPin });

        res.send({ message: 'PIN reset successfully!' });
    } catch (err) {
        res.status(500).send({ message: err.message || 'Error resetting PIN.' });
    }
};

const db = require('../models');
const Settings = db.settings;

// Create or update user settings
exports.createOrUpdate = (req, res) => {
    const { userId, preferredLanguage, notificationSettings, timezone, darkMode } = req.body;

    Settings.findOne({ where: { userId } })
        .then(settings => {
            if (settings) {
                // Update existing settings
                settings
                    .update({
                        preferredLanguage,
                        notificationSettings,
                        timezone,
                        darkMode,
                    })
                    .then(updatedSettings => res.send(updatedSettings))
                    .catch(err =>
                        res.status(500).send({
                            message: err.message || 'Error updating user settings.',
                        })
                    );
            } else {
                // Create new settings
                const newSettings = {
                    userId,
                    preferredLanguage,
                    notificationSettings,
                    timezone,
                    darkMode,
                };
                Settings.create(newSettings)
                    .then(data => res.send(data))
                    .catch(err =>
                        res.status(500).send({
                            message: err.message || 'Some error occurred while creating the user settings.',
                        })
                    );
            }
        })
        .catch(err =>
            res.status(500).send({
                message: err.message || 'Error retrieving user settings.',
            })
        );
};

// Get user settings by userId
exports.findByUserId = (req, res) => {
    const userId = req.params.userId;

    Settings.findOne({ where: { userId } })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({ message: `User settings with userId=${userId} not found.` });
            }
        })
        .catch(err =>
            res.status(500).send({
                message: err.message || 'Error retrieving user settings.',
            })
        );
};

// Delete user settings by userId
exports.delete = (req, res) => {
    const userId = req.params.userId;

    Settings.destroy({ where: { userId } })
        .then(num => {
            if (num == 1) {
                res.send({ message: 'User settings were deleted successfully.' });
            } else {
                res.send({ message: `Cannot delete user settings with userId=${userId}. Maybe user settings were not found.` });
            }
        })
        .catch(err =>
            res.status(500).send({
                message: err.message || 'Could not delete user settings.',
            })
        );
};

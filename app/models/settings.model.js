module.exports = (sequelize, Sequelize) => {
    const Settings = sequelize.define('settings', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        preferredLanguage: {
            type: Sequelize.STRING,
            defaultValue: 'en',
        },
        notificationSettings: {
            type: Sequelize.JSON,
            defaultValue: {
                email: true,
                sms: true,
                push: true,
            },
        },
        timezone: {
            type: Sequelize.STRING,
            defaultValue: 'UTC',
        },
        darkMode: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    });

    return Settings;
};

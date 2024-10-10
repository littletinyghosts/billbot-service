module.exports = (sequelize, Sequelize) => {
    const Reminder = sequelize.define('reminder', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        billId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'bills',
                key: 'id',
            },
        },
        reminderDate: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        nextReminderDate: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        recurring: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        recurringInterval: {
            type: Sequelize.ENUM('daily', 'weekly', 'monthly', 'yearly'),
            allowNull: true,
        },
        message: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM('sent', 'pending'),
            defaultValue: 'pending',
        },
    });

    return Reminder;
};

module.exports = (sequelize, Sequelize) => {
    const Bill = sequelize.define('bill', {
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
        billName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        amount: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        dueDate: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM('pending', 'paid', 'failed'),
            defaultValue: 'pending',
        },
        paymentMethodId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'paymentMethods',
                key: 'id',
            },
            allowNull: false,
        },
        recurring: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        recurringInterval: {
            type: Sequelize.ENUM('daily', 'weekly', 'monthly', 'yearly'),
            allowNull: true,
        },
        nextBillingDate: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    });

    return Bill;
};

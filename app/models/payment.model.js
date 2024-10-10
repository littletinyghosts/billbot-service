module.exports = (sequelize, Sequelize) => {
    const Payment = sequelize.define("payment", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      billId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'bills',
          key: 'id'
        }
      },
      paymentDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      amountPaid: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      paymentStatus: {
        type: Sequelize.ENUM('success', 'failed', 'pending'),
        defaultValue: 'pending'
      }
    });
  
    return Payment;
  };
  
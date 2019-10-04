const Sequelize = require('sequelize')

let db

db = new Sequelize('palportal', process.env.DATABASE_USER, process.env.DATABASE_PASS, {
	dialect: 'mssql'
})

const User = db.define('users', {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    accountNumber1: {
        type: Sequelize.STRING,
        allowNull: false
    },
    accountNumber2: {
        type: Sequelize.STRING,
        allowNull: true
    },
    accountNumber3: {
        type: Sequelize.STRING,
        allowNull: true
    },
    accountNumber4: {
        type: Sequelize.STRING,
        allowNull: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    hashedPassword: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isChangingPassword: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    passToken: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
	timestamps: false
})

module.exports = User
const Sequelize = require('sequelize')

let db

db = new Sequelize('palportal', process.env.DATABASE_USER, process.env.DATABASE_PASS, {
    dialect: 'mssql'
})

const Username = db.define('usernames', {
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false
})

module.exports = Username
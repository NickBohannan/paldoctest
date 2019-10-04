const bcrypt = require('bcrypt')
const moment = require('moment')

const User = require("../models/user")
const logger = require('../logger.js')
const schema = require('../passvalidator.js')

module.exports = async (req, res) => {
    if (req.body.firstName == '' ||
        req.body.lastName == '' ||
        req.body.email == '' ||
        req.body.confirmEmail == '' ||
        req.body.phoneNumber == '' ||
        req.body.username == ''
    ) {
        res.render("error", {
            errorText: "Please fill out all required fields marked with an asterisk (*)."
        })
        return 1
    }
    if (req.body.password !== req.body.confirmPassword) {
        res.render("error", {
            errorText: "Please make sure your passwords are the same."
        });
        return 1
    } else if (req.body.email !== req.body.confirmEmail) {
        res.render("error", {
            errorText: "Please make sure your emails are the same."
        })
        return 1
    } else if (req.body.accountNumber1 == '') {
        res.render("error", {
            errorText: "Sorry, you must enter an account number."
        })
        return 1
    } else if (!schema.validate(req.body.password)) {
        res.render("error", {
            errorText: "Please make sure your password has at least one uppercase letter, one lowercase letter, one number and one symbol."
        })
    } else if (req.body.webmasterpass !== process.env.WEBMASTERPASS) {    
        res.render("error", {
            errorText: "The webmaster password you entered is incorrect. Please go back and try again."
        })
    } else {
        try {
            let testUsername = await User.findOne({
                where: {
                    username: req.body.username
                }
            })
            console.log(testUsername)
            if (testUsername.username == req.body.username) {
                res.render("error", {
                    errorText: "Sorry, a user with that username already exists"
                })
                return 1
            }
        } catch(err) {
            console.error(err)
        }

        try {
            let saltRounds = 10;
            let hashPass = await bcrypt.hash(req.body.password, saltRounds);
            await User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                phone: req.body.phoneNumber,
                accountNumber1: req.body.accountNumber1,
                accountNumber2: req.body.accountNumber2,
                accountNumber3: req.body.accountNumber3,
                accountNumber4: req.body.accountNumber4,
                email: req.body.email,
                hashedPassword: hashPass
            })

            logger.log({
                level: 'info',
                message: `${moment()} - a new account has been created. User Email: ${req.body.email} - Name: ${req.body.firstName} ${req.body.lastName} - Username: ${req.body.username} - Accounts: ${req.body.accountNumber1}, ${req.body.accountNumber2}, ${req.body.accountNumber3}, ${req.body.accountNumber4}`
            })

        } catch (err) {
            console.error(err);
        }
        res.render("message", {
			messageText: "You have successfully created an account. Please click below to return to the login page."
		});
    }
}
const bcrypt = require('bcrypt')
const moment = require('moment')

const User = require("../models/user")
const logger = require('../logger.js')

module.exports = async (req, res) => {

    // run through error handling conditionals
    if (req.body.username == '') {
        res.render("error", {
            errorText: "Please go back and enter your email address."
        })
        return 1
    } else if (req.body.newPassword == '') {
        res.render("error", {
            errorText: "Please go back and enter a new password."
        })
        return 1
    } else if (req.body.confirmNewPassword == '') {
        res.render("error", {
            errorText: "Please go back and confirm your new password."
        })
        return 1
    } else if (req.body.newPassword !== req.body.confirmNewPassword) {
        res.render("error", {
            errorText: "Please go back and make sure both passwords are identical."
        })
        return 1
    } else {
        let user 
        let userIP = req.headers['x-forwarded-for']

        // find the user based on whether they are toggled to change their password and if they have
        try {
            user = await User.findOne({ 
                where: {
                    username: req.body.username,
                    isChangingPassword: true
                }
            })
        } catch (err) {
            console.error(err)
        }

        // hash password and store it
        try {
            let saltRounds = 10
            let newHashPass = await bcrypt.hash(req.body.newPassword, saltRounds)
            await user.update({
                hashedPassword: newHashPass,
                isChangingPassword: false
            })

            logger.log({
                level: 'info',
                message: `${moment()} - user ${user.username} (${user.email}) (${userIP}) has successfully changed passwords.`
            })

        } catch(err) {
            console.error(err)
        }

        // render success page
        res.render('successpass', {
            text: "Your password has been successfully changed. Please click below to login."
        })
    }
}
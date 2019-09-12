const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const moment = require('moment')

const User = require("../models/user");
const logger = require("../logger.js")

module.exports = async (req, res) => {
	
    let user

    // grabbing the user's IP from the header (req.connection.remoteAddress does not work due to reverse proxy in IIS)
    let userIP = req.headers['x-forwarded-for']

    // find the user currently logged in
    try {
        user = await User.findOne({ where: { username: req.body.username } });
    } catch (err) {
        console.error(err);
    }

    // error handling for not finding user
    if (user == null) {
        res.render("error", {
            errorText: "Sorry, there is no user with that username."
        })
        return 1
    }

    // if passwords match, create json web token
    try {
        if (await bcrypt.compare(req.body.password, user.hashedPassword)) {
            const payload = { user: user.lastName }
            const options = { expiresIn: '30m' }
            const secret = process.env.JWT_SECRET
            const token = jwt.sign(payload, secret, options)

            console.log(token)

            // add token, username, and user email to cookies
            res.cookie("token", token, {
                expires: new Date(Date.now() + 1800000)
            })
            res.cookie("userEmail", user.dataValues.email, {
                expires: new Date(Date.now() + 1800000)
            })
            res.cookie("username", user.dataValues.username, {
                expires: new Date(Date.now() + 1800000)
            })

            // log userEmail and and ip address
            logger.log({
                level: 'info',
                message: `New User Login: ${user.dataValues.username} - IP Address: ${userIP} - ${moment()}`
            })
    
            // redirect to landing page
            res.redirect("/");
            
        } else {

            // error if passwords don't match
            res.render("error", {
                errorText: "Password is incorrect. Please go back and try again."
            });
            return 1
        }
    } catch (err) {
        console.error(err)
    }
}
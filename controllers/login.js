const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const moment = require('moment')

const User = require("../models/user");

module.exports = async (req, res) => {
	
    let user

    // find the user currently logged in
    try {
        user = await User.findOne({ where: { email: req.body.email } });
    } catch (err) {
        console.error(err);
    }

    // error handling for not finding user
    if (user == null) {
        res.render("error", {
            errorText: "Sorry, there is no user with that email address."
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

            // add token and user email to cookies
            res.cookie("token", token, {
                expires: new Date(Date.now() + 1800000)
            })
            res.cookie("userEmail", user.dataValues.email, {
                expires: new Date(Date.now() + 1800000)
            });
    
            // redirect to landing page
            res.redirect("/");
            
        } else {

            // error if passwords don't match
            res.render("error", {
                errorText: "Password mismatched with stored password. Please go back and try again."
            });
            return 1
        }
    } catch (err) {
        console.error(err)
    }
}
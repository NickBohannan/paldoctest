const User = require("../models/user")
const logger = require('../logger.js')
const moment = require('moment')

// This module allows users with knowledge of the admin password to change their account number bindings to view whichever account they choose.

module.exports = async (req, res) => {
	if (req.body.password !== process.env.ADMINPASS) {
		res.render("error", {
			errorText: "Sorry, the admin password you entered does not match."
		})
	} else {
		let user
		let userIP = req.headers['x-forwarded-for']
		try {
			user = await User.findOne({
				where: {
					username: req.cookies.username
				}
			})
			
			await user.update({
				accountNumber1: req.body.accountNumber1,
				accountNumber2: req.body.accountNumber2,
				accountNumber3: req.body.accountNumber3,
				accountNumber4: req.body.accountNumber4
			})

			logger.log({
				level: 'warn',
				message: `${moment()} - User ${user.username} (${user.email}) (${userIP}) has accessed the admin page and has successfully accessed the following account numbers: ${req.body.accountNumber1}, ${req.body.accountNumber2}, ${req.body.accountNumber3}, ${req.body.accountNumber4}`
			})
			
			res.redirect("/")
			
		} catch(err) {
			console.error(err)
		}
	}
}
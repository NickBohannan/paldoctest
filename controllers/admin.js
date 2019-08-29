const User = require("../models/user");

module.exports = async (req, res) => {
	if (req.body.password !== process.env.ADMINPASS) {
		res.render("error", {
			errorText: "Sorry, the admin password you entered does not match."
		})
	} else {
		let user
		try {
			user = await User.findOne({
				where: {
					email: req.cookies.userEmail
				}
			})
			
			await user.update({
				accountNumber1: req.body.accountNumber1,
				accountNumber2: req.body.accountNumber2,
				accountNumber3: req.body.accountNumber3,
				accountNumber4: req.body.accountNumber4
			})
			
			res.redirect("/")
			
		} catch(err) {
			console.error(err)
		}
	}
}
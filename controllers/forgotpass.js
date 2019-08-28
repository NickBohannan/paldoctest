const nodemailer = require("nodemailer");
const Sequelize = require('sequelize')

const User = require("../models/user");
const jwt = require('jsonwebtoken')

const Op = Sequelize.Op

module.exports = async (req, res) => {

    // handling missing fields
    if (req.body.email == '' || req.body.accountNumber == '') {
        res.render("error", {
            errorText: "Please fill out both fields to receive an email with instructions to change your password."
        })
        return 1
    }

    // gathering info for JSON web token
    const cpPayload = { user: req.body.email }
    const cpOptions = { expiresIn: '24h' }
    const cpSecret = process.env.JWT_SECRET

    // signing the token
    const cpToken = jwt.sign(cpPayload, cpSecret, cpOptions)

    // change password URL with token as past of query string
    let cpURL = `portal.palhealth.com:8080/changepass?token=${cpToken}`

    let passUser

    // find the user currently logged in
    try {
        passUser = await User.findOne({
            where: {
                email: req.body.email,
                [Op.or]: [
                    {accountNumber1: req.body.accountNumber},
                    {accountNumber2: req.body.accountNumber},
                    {accountNumber3: req.body.accountNumber},
                    {accountNumber4: req.body.accountNumber}
                ]
            }
        })
    } catch (err) {
        console.error(err)
    }

    // if user not found, send message
    if (passUser == null) {
        res.send("Sorry, no user with that email address was found.")
    } else {

        // toggle password change and save token to database
        try {
            await passUser.update({
                isChangingPassword: true,
                passToken: cpToken
            })
        } catch (err) {
            console.error(err)
        }

        // send email with link to change password (URL with token as part of query string)
		try {
			let transporter = nodemailer.createTransport({
				host: "smtp.gmail.com",
				port: 587,
				secure: false, 
				auth: {
				  user: "n.bohannan@palhealth.com", 
				  pass: process.env.EMAILPASS 
				}
			})
			let info = await transporter.sendMail({
				from: 'n.bohannan@palhealth.com', 
				to: passUser.email, 
				subject: "Password Reset Link - PAL Provider Portal",
				html: `Hello ${passUser.firstName + " " + passUser.lastName},<br><br>

				Please click the following URL to change your password:<br><br>

				${cpURL}<br><br>
				
				Thank you,<br> 
				PAL Health Technologies`, 
			})

			// send confirmation message in browser
			console.log("Message sent: %s", info.messageId)
			res.send(`An email has been sent to ${passUser.email} with a link to change your password. Please close tab.`)
		} catch (err) {
			console.error(err)
		}
    }
}
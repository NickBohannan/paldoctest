const nodemailer = require('nodemailer')
const logger = require('../logger.js')

module.exports = async (req, res) => {
    // send email to customer service team with above order in body.
	try {
		let transporter = nodemailer.createTransport({
			host: "smtp-relay.gmail.com",
			port: 25,
			secure: false, 
			auth: {
			  user: "n.bohannan@palhealth.com",
			  pass: process.env.EMAILPASS 
			}
		})
		
		let info = await transporter.sendMail({
			from: '"Portal Support" <portalsupport@palhealth.com>', 
			to: `n.bohannan@palhealth.com`,
			subject: "TESTING PLEASE DISREGARD New Sign Up Submission",
			html: `Hello Nick,<br><br>

            A new user has submitted sign-up information:<br><br>
            
            First Name: ${req.body.firstName}<br>
            Last Name: ${req.body.lastName}<br>
            Username: ${req.body.username}<br>
            Phone Number: ${req.body.phoneNumber}<br>
            Email: ${req.body.email}<br>
            Account #1: ${req.body.accountNumber1}<br>
            Account #2: ${req.body.accountNumber2}<br>
            Account #3: ${req.body.accountNumber3}<br>
            Account #4: ${req.body.accountNUmber4}<br><br>
            
			Thank you,<br> 
			PAL Provider Portal`
        })
    
        res.render('message', {
            messageText: `Thank you for submitting your sign-up information. A PAL Health Technologies representative will contact you via phone and email to verify your information and get you started.`
        })
    
    } catch(err) {
        console.error(err)
    }
}
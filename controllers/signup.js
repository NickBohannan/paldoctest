const nodemailer = require('nodemailer')
const logger = require('../logger.js')

module.exports = async (req, res) => {
    // send email to customer service team with above order in body.
	try {
		let transporter = nodemailer.createTransport({
			host: "smtp-relay.gmail.com",
			port: 25,
			secure: false
		})
		
		let info = await transporter.sendMail({
			from: '"Portal Support" <portalsupport@palhealth.com>', 
			to: `n.bohannan@palhealth.com`,
			subject: "New PAL Provider Portal Sign Up Submission",
			html: `Hello Nick,<br><br>

            A new user has submitted sign-up information:<br><br>
            
            First Name: ${req.body.firstName}<br>
            Last Name: ${req.body.lastName}<br>
            Username: ${req.body.username}<br>
            Phone Number: ${req.body.phoneNumber}<br>
            Email: ${req.body.email}<br>
            Office Name: ${req.body.officename}<br>
            Office Zip Code: ${req.body.officezip}<br><br>
            
			Thank you,<br> 
			PAL Provider Portal`
        })
    
        res.render('message', {
            messageText: `Thank you for submitting your sign-up information. A PAL Health Technologies representative will connect your user information with your office's account numbers and notify you via email when you are set up.`
        })
    
    } catch(err) {
        console.error(err)
    }
}
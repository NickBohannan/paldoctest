const nodemailer = require('nodemailer')
const moment = require('moment')

const logger = require('../logger.js')

module.exports = async (req, res) => {

	let userIP = req.headers['x-forwarded-for']
	
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
			to: `n.bohannan@palhealth.com, j.robertson@palhealth.com`,
			subject: "Supply Request from PAL Provider Portal",
			html: `Hello Customer Service Team,<br><br>

			User ${req.cookies.username} at ${req.cookies.name} (${req.cookies.accountNumber}) has requested the following supplies:
            <br><br>
            
            STS Socks: ${req.body.stssocks}<br>
            Ankle Brace Straps: ${req.body.afostraps}<br>
            Biofoam Boxes: ${req.body.biofoams}<br>
            Shipping Labels: ${req.body.shiplabels}<br>
            Boxes: ${req.body.boxes}<br>
            Order Forms: ${req.body.orderforms}<br>
			STS Starter Kits: ${req.body.starterkits}<br><br>
			
			Notes: ${req.body.notes}<br><br>

            Please deliver to ${req.cookies.address}.<br><br>

			Thank you,<br> 
			PAL Provider Portal`
		})

		logger.log({
			level: 'info',
			message: `${moment()} - user ${req.cookies.username} (${req.cookies.userEmail}) (${userIP}) has sent a supply request to customer service.`
		})

		// send confirmation message in browser
		res.render("reordersuccess", {
			messageText: `Your supply request has been sent. Please click below to return to the main page.`
		})
	} catch (err) {
		console.error(err)
	}
}
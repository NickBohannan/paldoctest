const nodemailer = require('nodemailer')

const Order = require("../models/order");

module.exports = async (req, res) => {
	
	let order
	
	// finds the order you wish to reorder
	try {
		order = await Order.findOne({
			where: { order_no_ext: req.params.order_no_ext }
		});
	} catch(err) {
		console.error(err)
	}
	
	// send email to customer service team with above order in body.
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
			to: `customerservice@palhealth.com, ${req.cookies.userEmail}`, 
			subject: "TESTING PLEASE DISREGARD Reorder from PAL Provider Portal",
			html: `Hello Customer Service Team,<br><br>

			Please create a reorder for the following: ` + order.order_no_ext + `
			<br><br>
			This individual is a patient of ` + order.customer_name + `.
			<br><br>
			Thank you,<br> 
			PAL Provider Portal`, 
		})

		// send confirmation message in browser
		res.render("reordersuccess", {
			messageText: `Your reorder email has been sent. Please click below to return to the main page.`
		})
	} catch (err) {
		console.error(err)
	}
}
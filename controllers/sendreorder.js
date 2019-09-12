const nodemailer = require('nodemailer')
const moment = require('moment')

const Order = require("../models/order")
const logger = require('../logger.js')

module.exports = async (req, res) => {
	
	let order
	let userIP = req.headers['x-forwarded-for']
	
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
			host: "smtp-relay.gmail.com",
			port: 25,
			secure: false, 
			auth: {
			  user: "n.bohannan@palhealth.com",
			  pass: process.env.EMAILPASS 
			}
		})
		
		let info = await transporter.sendMail({
			from: 'portalsupport@palhealth.com', 
			to: `n.bohannan@palhealth.com, ${req.cookies.userEmail}, j.robertson@palhealth.com`,
			subject: "TESTING PLEASE DISREGARD Reorder from PAL Provider Portal",
			html: `Hello Customer Service Team,<br><br>

			Please create a reorder for the following: ` + order.order_no_ext + `
			<br><br>
			This individual is a patient of ` + order.customer_name + `.
			<br><br>
			Thank you,<br> 
			PAL Provider Portal`
		})

		logger.log({
			level: 'info',
			message: `${moment()} - user ${req.cookies.username} (${req.cookies.userEmail}) (${userIP}) has sent a reorder email for ${order.order_no_ext} to customer service.`
		})

		// send confirmation message in browser
		res.render("reordersuccess", {
			messageText: `Your reorder email has been sent. Please click below to return to the main page.`
		})
	} catch (err) {
		console.error(err)
	}
}
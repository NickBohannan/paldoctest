module.exports = (req, res) => {
	res.render("confirmreorder", {
		messageText: `Are you sure you would like to reorder order #` + req.params.order_no_ext + "? The order and product information will be identical to the previous order. An email will be sent to our customer service representatives along with a copy sent to your login email account as confirmation.",
		orderNumber: req.params.order_no_ext
	})
}
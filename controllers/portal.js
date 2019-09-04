const jwt = require('jsonwebtoken');

module.exports = (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login");
    } else {
        if (!jwt.verify(req.cookies.token, process.env.JWT_SECRET)) {
            res.redirect("/login");
        } else {
			// show information regarding the state of the portal
            res.render("portal", {
                cookies: req.cookies
            });
        }
    }
}
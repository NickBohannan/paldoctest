const jwt = require('jsonwebtoken');

module.exports = (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login");
    } else {
        if (!jwt.verify(req.cookies.token, process.env.JWT_SECRET)) {
            res.redirect("/login");
        } else {
            res.render("portal", {
                cookies: req.cookies
            });
        }
    }
}
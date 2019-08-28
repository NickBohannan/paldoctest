const jwt = require('jsonwebtoken');

module.exports = (req, res) => {

    // checks for token and verifies, then render search page
    if (!req.cookies.token) {
        res.redirect("/login");
    } else {
        if (!jwt.verify(req.cookies.token, process.env.JWT_SECRET)) {
            res.redirect("/login");
        } else {
            res.render("reordersearch", {
                cookies: req.cookies
            });
        }
    }
}
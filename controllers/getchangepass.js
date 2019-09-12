const User = require('../models/user')

module.exports = async (req, res) => {
    
    let user

    try {
        user = await User.findOne({
            where: {
                passToken: req.query.token
            }
        })

        if (user == undefined) {
            res.render('error', {
                errorText: `Sorry, the link you have used can only be used once. Please request a new link to be sent to your email via the forgot password link on the login page.`
            })
        } else {
            await user.update({
                passToken: null
            })
            res.render("changepass")
        }

    } catch(err) {
        console.error(err)
    }
}
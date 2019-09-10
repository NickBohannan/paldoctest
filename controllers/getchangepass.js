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
                errorText: `Sorry, this account has not been set up to reset it's password.`
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
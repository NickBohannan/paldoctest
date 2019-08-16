const bcrypt = require("bcrypt");

const User = require("../models/user");

module.exports = async (req, res) => {
    if (req.body.firstName == '' ||
        req.body.lastName == '' ||
        req.body.email == '' ||
        req.body.confirmEmail == ''
    ) {
        res.render("error", {
            errorText: "Please fill out all required fields marked with an asterisk (*)."
        })
        return 1
    }
    if (req.body.password !== req.body.confirmPassword) {
        res.render("error", {
            errorText: "Please make sure your passwords are the same."
        });
        return 1
    } else if (req.body.email !== req.body.confirmEmail) {
        res.render("error", {
            errorText: "Please make sure your emails are the same."
        })
        return 1
    } else if (req.body.accountNumber1 == '') {
        res.render("error", {
            errorText: "Sorry, you must enter an account number."
        })
        return 1
    } else {    
        try {
            let testUserEmail = await User.findOne({
                where: {
                    email: req.body.email
                }
            })
            if (testUserEmail.email == req.body.email) {
                res.render("error", {
                    errorText: "Sorry, a user with that email address already exists"
                })
                return 1
            }
        } catch(err) {
            console.error(err)
        }

        try {
            let saltRounds = 10;
            let hashPass = await bcrypt.hash(req.body.password, saltRounds);
            await User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                accountNumber1: req.body.accountNumber1,
                accountNumber2: req.body.accountNumber2,
                accountNumber3: req.body.accountNumber3,
                accountNumber4: req.body.accountNumber4,
                email: req.body.email,
                hashedPassword: hashPass
            });
        } catch (err) {
            console.error(err);
        }
        res.render("login");
    }
}
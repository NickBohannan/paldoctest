const jwt = require('jsonwebtoken');
const moment = require('moment')

const Order = require("../models/order");
const User = require("../models/user")

const Sequelize = require('sequelize')
const Op = Sequelize.Op

module.exports = async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login");
    } else {
        if (!jwt.verify(req.cookies.token, process.env.JWT_SECRET)) {
            res.redirect("/login");
        } else {
            if (req.body.searchradio == undefined) {
                res.render("noradio", {
                    cookies: req.cookies
                });
            }

            // switch for search functionality depending on which radio button was pressed
            switch (req.body.searchradio) {
                case "patientname":
                    // In the db, some patient names have an added space at the end, so this checks for that and searches using the added space
                    let ptName = req.body.searchfield;
                    let ptNameArray = ptName.toUpperCase().split(" ");
                    let lastName = ptNameArray.pop();
                    lastName += ",";
                    ptNameArray.unshift(lastName);
                    finalName = ptNameArray.join(" ");
				
					try {
						let user = await User.findOne({
							where: {
								username: req.cookies.username
							}
						})
						
						let orders = await Order.findAll({
							where: {
								customer_code: {
									[Op.or]: [
										user.accountNumber1,
										user.accountNumber2,
										user.accountNumber3,
										user.accountNumber4,
									]
								},
								[Op.or]: [
									{patient_name: {
										[Op.like]: "%" + req.body.searchfield.toUpperCase() + "%",
									}},
									{patient_name: finalName},
									{patient_name: finalName + " "}
								]
							},
							order: [['entry_date', 'DESC']]
						})
					
						if (orders[0] == null) {
							res.render("nosearchresults", {
								cookies: req.cookies
							});
						} else {
							res.render("reordersearchresults", {
								orders: orders,
								cookies: req.cookies
							});
						}
					} catch(err) {
						console.error(err);
					}
                    break;
                case "dateshipped":
					// some of this is redundant now that we're using moment.js. Will remove.
                    let dateArray = req.body.searchfield.split("/")
                    let lastElement = dateArray.pop()
                    dateArray.unshift(lastElement)
                    let dateString = dateArray.join('-')
                    let dayAfter = Number.parseInt(dateArray[2])+1
                    dateArray.pop()
                    dateArray.push(dayAfter)
                    let dateStringDayAfter = dateArray.join('')
                    console.log(dateStringDayAfter)

                    try {
                        let user = await User.findOne({
                            where: {
                                username: req.cookies.username
                            }})
                        let orders = await Order.findAll({
                                where: { 
                                    customer_code: {
                                        [Op.or]: [
                                            user.accountNumber1,
                                            user.accountNumber2,
                                            user.accountNumber3,
                                            user.accountNumber4,
                                        ]
                                    },
                                    entry_date: {
                                        [Op.gt]: dateString,
                                        [Op.lt]: moment(dateString).add(3, 'days')
                                    }
                                },
								order: [['entry_date', 'DESC']]
                            })

                        if (orders == undefined || orders[0] == null) {
                            res.render("nosearchresults", {
                                cookies: req.cookies
                            });
                        } else {
                            res.render("reordersearchresults", {
                                orders: orders,
                                cookies: req.cookies
                            });
                        }
                    } catch(err) {
                        console.log(err);
                    };
                    break;
                default:
                    break;
            }
        }
    }
}
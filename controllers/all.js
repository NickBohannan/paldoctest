const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize')
const moment = require('moment')

const Order = require("../models/order");
const User = require("../models/user");

const Op = Sequelize.Op

// This module is the routing function for viewing all orders
module.exports = async (req, res) => {
    
    // check client-side token
    if (!req.cookies.token) {
        res.redirect("/login");
    } else {
        if (!jwt.verify(req.cookies.token, process.env.JWT_SECRET)) {
            res.redirect("/login");
        } else {
            
            // saves current requested page
            let pageRequest = Number.parseInt(req.params.page_no)

            // offset variable calculation based on current page
            let pageOffset = (pageRequest - 1) * 25

            let allOrders, allUser

            // search for user in database
            try {
                allUser = await User.findOne({
                    where: {
                        username: req.cookies.username
                    }
                })
            } catch (err) {
                console.error(err)
            }
            
            // search for all orders held by user
            try {
                allOrders = await Order.findAll({
                    where: {
                        customer_code: {
                            [Op.or]: [
                                allUser.accountNumber1,
                                allUser.accountNumber2,
                                allUser.accountNumber3,
                                allUser.accountNumber4,
                            ]
                        },
						entry_date: {
							[Op.gt]: moment().subtract(12, 'months').toDate()
						}
                    },
                    order: [["entry_date", "DESC"]]
                });
            } catch (err) {
                console.error(err);
            }

            // saves number of pages to link to based on all orders/25 per page
            let totalPages = allOrders.length/25

            // find all orders again but this time offset results by number of pages and limit results to 25
            try {
                pageOrders = await Order.findAll({
                    where: {
                        customer_code: {
                            [Op.or]: [
                                allUser.accountNumber1,
                                allUser.accountNumber2,
                                allUser.accountNumber3,
                                allUser.accountNumber4,
                            ]
                        }
                    },
                    order: [["entry_date", "DESC"]],
                    offset: pageOffset,
                    limit: 25
                })
            } catch(err) {
                console.error(err)
            }

            // render the page based on above offset and limited order query
            // first query was only for getting the total number of orders
            res.render("list", {
                orders: pageOrders,
                cookies: req.cookies,
                totalPages: totalPages,
                pageRequest: pageRequest,
            });
        }
    }
}
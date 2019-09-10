const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize')
const moment = require('moment')

const Order = require("../models/order");
const User = require("../models/user");

const Op = Sequelize.Op

module.exports = async (req, res) => {

    // checks for client side token and verification
    if (!req.cookies.token) {
        res.redirect("/login");
    } else {
        if (!jwt.verify(req.cookies.token, process.env.JWT_SECRET)) {
            res.redirect("/login");
        } else {

            let landingUser, orders, yearlyOrders, quarterlyOrders;
			let nowDate = new Date(Date.now())
            nowDate = nowDate - 31536000000	

            // find the user that's logged in
            try {
                landingUser = await User.findOne({
                    where: { username: req.cookies.username }
                });

                // find all orders that belong to user and sort them by date
                orders = await Order.findAll({
                    where: {
                        customer_code: {
                            [Op.or]: [
                                landingUser.accountNumber1,
                                landingUser.accountNumber2,
                                landingUser.accountNumber3,
                                landingUser.accountNumber4,
                            ]
                        },
						entry_date: {
							[Op.gt]: moment().subtract(12, 'months').add(moment().daysInMonth() - moment().date(), 'days').toDate()
						}
                    },
                    order: [["entry_date", "DESC"]]
                });
            } catch (err) {
                console.error(err);
            }
			
			if (orders[0] == undefined) {
				res.render("error", {
					errorText: "Sorry, no orders were found."
				})
				return 1
			}
			
			// query orders for the year
			try {
                // find all orders that belong to user and sort them by date
                yearlyOrders = await Order.findAll({
                    where: {
                        customer_code: {
                            [Op.or]: [
                                landingUser.accountNumber1,
                                landingUser.accountNumber2,
                                landingUser.accountNumber3,
                                landingUser.accountNumber4,
                            ]
                        },
						entry_date: {
							[Op.gt]: moment().startOf('year').toDate()
						}
                    },
                    order: [["entry_date", "DESC"]]
                });
            } catch (err) {
                console.error(err);
            }
			
			// query orders for the quarter
			try {
                // find all orders that belong to user and sort them by date
                quarterlyOrders = await Order.findAll({
                    where: {
                        customer_code: {
                            [Op.or]: [
                                landingUser.accountNumber1,
                                landingUser.accountNumber2,
                                landingUser.accountNumber3,
                                landingUser.accountNumber4,
                            ]
                        },
						entry_date: {
							[Op.gt]: moment().startOf('quarter').toDate()
						}
                    },
                    order: [["entry_date", "DESC"]]
                });
            } catch (err) {
                console.error(err);
            }

            // this is an array that stores the number of orders for each month
            let monthlyOrdersArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

            // this mapping funtion adds orders based on the month it was shipped
            orders.map(order => {
                switch (order.entry_date.toString().substring(4, 7)) {
                    case "Jan":
                        monthlyOrdersArray[0]++;
                        break;
                    case "Feb":
                        monthlyOrdersArray[1]++;
                        break;
                    case "Mar":
                        monthlyOrdersArray[2]++;
                        break;
                    case "Apr":
                        monthlyOrdersArray[3]++;
                        break;
                    case "May":
                        monthlyOrdersArray[4]++;
                        break;
                    case "Jun":
                        monthlyOrdersArray[5]++;
                        break;
                    case "Jul":
                        monthlyOrdersArray[6]++;
                        break;
                    case "Aug":
                        monthlyOrdersArray[7]++;
                        break;
                    case "Sep":
                        monthlyOrdersArray[8]++;
                        break;
                    case "Oct":
                        monthlyOrdersArray[9]++;
                        break;
                    case "Nov":
                        monthlyOrdersArray[10]++;
                        break;
                    case "Dec":
                        monthlyOrdersArray[11]++;
                        break;
                    default:
                        console.error("Months not recognized");
                        break;
                }
            });

            // save order data to client via cookies for identification purposes and to generate graph when rendering landingpage.ejs
            res.cookie("accountNumber", orders[0].customer_code, {
                expires: new Date(Date.now() + 1800000)
            });
            res.cookie("name", orders[0].customer_name, {
                expires: new Date(Date.now() + 1800000)
            });
            res.cookie(
                "address",
                    orders[0].ship_to_addr1 +
                    " " +
                    orders[0].ship_to_addr2 +
                    " " +
                    orders[0].ship_to_addr3 +
                    " " +
                    orders[0].ship_to_city +
                    " " +
                    orders[0].ship_to_state +
                    " " +
                    orders[0].ship_to_zip,
                { expires: new Date(Date.now() + 1800000) }
            );
            res.cookie("phone", orders[0].phone, {
                expires: new Date(Date.now() + 1800000)
            });
            res.cookie("fax", orders[0].phone, {
                expires: new Date(Date.now() + 1800000)
            });
            res.cookie("poNum", orders[0].po_number, {
                expires: new Date(Date.now() + 1800000)
            });

            res.cookie("janOrders", monthlyOrdersArray[0], {
                expires: new Date(Date.now() + 1800000)
            });
            res.cookie("febOrders", monthlyOrdersArray[1], {
                expires: new Date(Date.now() + 1800000)
            });
            res.cookie("marOrders", monthlyOrdersArray[2], {
                expires: new Date(Date.now() + 1800000)
            });
            res.cookie("aprOrders", monthlyOrdersArray[3], {
                expires: new Date(Date.now() + 1800000)
            });
            res.cookie("mayOrders", monthlyOrdersArray[4], {
                expires: new Date(Date.now() + 1800000)
            });
            res.cookie("junOrders", monthlyOrdersArray[5], {
                expires: new Date(Date.now() + 1800000)
            });
            res.cookie("julOrders", monthlyOrdersArray[6], {
                expires: new Date(Date.now() + 1800000)
            });
            res.cookie("augOrders", monthlyOrdersArray[7], {
                expires: new Date(Date.now() + 1800000)
            });
            res.cookie("sepOrders", monthlyOrdersArray[8], {
                expires: new Date(Date.now() + 1800000)
            });
            res.cookie("octOrders", monthlyOrdersArray[9], {
                expires: new Date(Date.now() + 1800000)
            });
            res.cookie("novOrders", monthlyOrdersArray[10], {
                expires: new Date(Date.now() + 1800000)
            });
            res.cookie("decOrders", monthlyOrdersArray[11], {
                expires: new Date(Date.now() + 1800000)
            });

            // saving data for use in header (provider: | account #: )
            let temporaryHeaderObject = {
                name: orders[0].customer_name,
                accountNumber: orders[0].customer_code
            };

            console.log(res.cookies)

            res.render("landingpage", {
                orders: orders,
				yearlyOrders: yearlyOrders,
				quarterlyOrders: quarterlyOrders,
                cookies: temporaryHeaderObject
            });
        }
    }
}
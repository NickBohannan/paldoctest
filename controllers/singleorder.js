const jwt = require('jsonwebtoken');

const Order = require("../models/order");
const Workflow = require("../models/workflow");

module.exports = async (req, res) => {
    if (!req.cookies.token) {
        res.redirect("/login");
    } else {
        if (!jwt.verify(req.cookies.token, process.env.JWT_SECRET)) {
            res.redirect("/login");
        } else {
            let order, workflow;
			let manufacturing = false
			let qcPreShip = false
			
            try {
				console.log(req.params)
                order = await Order.findOne({
                    where: { order_no_ext: req.params.order_no_ext }
                });
  
				workflow = await Workflow.findAll({
					where: {
						order_no_ext: order.order_no_ext
					}
				});
			
				for (let i=0;i<workflow.length;i++) {
					console.log(workflow[i].function_code)
					if (workflow[i].function_code == "F000008800" || 
						workflow[i].function_code == "F000008810" || 
						workflow[i].function_code == "F000008820" || 
						workflow[i].function_code == "F000008825" || 
						workflow[i].function_code == "F000008800" || 
						workflow[i].function_code == "F000016000" || 
						workflow[i].function_code == "F000016010" || 
						workflow[i].function_code == "F888888888" || 
						workflow[i].function_code == "FC10000600" || 
						workflow[i].function_code == "FC10008800" || 
						workflow[i].function_code == "FC10008810" || 
						workflow[i].function_code == "FC20000600" || 
						workflow[i].function_code == "FC20008800" || 
						workflow[i].function_code == "FC20008810" || 
						workflow[i].function_code == "FC30000600" || 
						workflow[i].function_code == "FC30008800" || 
						workflow[i].function_code == "FC30008810" || 
						workflow[i].function_code == "FC40000600" || 
						workflow[i].function_code == "FC40008800" || 
						workflow[i].function_code == "FC40008810" || 
						workflow[i].function_code == "FH00013000" || 
						workflow[i].function_code == "FH00014000") {
						qcPreship = true
					} else if (workflow[i].function_code == "F000000450" || workflow[i].function_code == "F000100300") {
						manufacturing = true
					}
				}
				
			} catch (err) {
				console.log(err);
			}
			
            res.render("order", {
                order: order,
				manufacturing: manufacturing,
				qcPreShip: qcPreShip,
                cookies: req.cookies
            });
        }
    }
}
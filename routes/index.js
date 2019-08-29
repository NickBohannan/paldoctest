const express = require("express");
const router = express.Router();

// Grabbing Controllers
const forgotPass = require('../controllers/forgotpass')
const changePass = require('../controllers/changepass')
const login = require('../controllers/login')
const signup = require('../controllers/signup')
const landingPage = require('../controllers/landingpage')
const singleOrder = require('../controllers/singleorder')
const portal = require('../controllers/portal')
const getSearch = require('../controllers/getsearch')
const postSearch = require('../controllers/postsearch')
const all = require('../controllers/all')
const confirmReorder = require('../controllers/confirmreorder')
const sendReorder = require('../controllers/sendreorder')
const getReorderSearch = require('../controllers/getreordersearch')
const postReorderSearch = require('../controllers/postreordersearch')
const adminUpdate = require('../controllers/admin')

// Route List
router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", login);

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.post("/signup", signup);

router.get("/", landingPage);

router.get("/orders/:order_no_ext", singleOrder);

router.get("/confirmreorder/:order_no_ext", confirmReorder);

router.get("/sendreorder/:order_no_ext", sendReorder);

router.get("/reordersearch", getReorderSearch)

router.post("/reordersearch", postReorderSearch)

router.get("/forgotpass", (req, res) => {
    res.render("forgotpass", {
        cookies: req.cookies
    })
})

router.post("/forgotpass", forgotPass)

router.get("/changepass", (req, res) => {
    res.render("changepass")
})

router.post("/changepass", changePass)

router.get("/portal", portal)

router.get("/search", getSearch);

router.get("/list/:page_no", all);

router.post("/search", postSearch);

router.get("/admin", (req, res) => {
	res.render("admin")
})

router.post("/admin", adminUpdate)

module.exports = router;

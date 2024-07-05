const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {RedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.getSignUp)
.post(wrapAsync(userController.postSignUp))

router.route("/login")
.get(userController.getLogin)
.post(RedirectUrl, 
    passport.authenticate("local", {failureRedirect: "/login", failureFlash : true,
}),userController.postLogin);

router.get("/logout",userController.Logout)

module.exports = router;